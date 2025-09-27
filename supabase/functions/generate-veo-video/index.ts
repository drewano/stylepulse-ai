import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

// Environment variables
const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerateVideoRequest {
  scriptId: number;
  prompt: string;
}

interface VeoResponse {
  name: string;
  done?: boolean;
  response?: {
    generateVideoResponse?: {
      generatedSamples?: Array<{
        video?: {
          uri: string;
        };
      }>;
    };
  };
  error?: {
    code: number;
    message: string;
  };
}

// Safe JSON parsing utility
function safeParseJson(text: string): any {
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    console.error('Raw text:', text);
    const errorMessage = error instanceof Error ? error.message : 'Unknown parsing error';
    throw new Error(`Invalid JSON response: ${errorMessage}`);
  }
}

// Poll operation status with correct API format for VEO 3
async function pollOperationStatus(operationName: string): Promise<VeoResponse> {
  const maxAttempts = 60; // 10 minutes with 10-second intervals
  let attempts = 0;

  if (!geminiApiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  while (attempts < maxAttempts) {
    console.log(`Polling attempt ${attempts + 1}/${maxAttempts} for operation: ${operationName}`);
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/${operationName}`, {
      method: 'GET',
      headers: {
        'x-goog-api-key': geminiApiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Polling error (${response.status}):`, errorText);
      throw new Error(`Failed to poll operation: ${response.status} ${errorText}`);
    }

    const responseText = await response.text();
    const result: VeoResponse = safeParseJson(responseText);

    if (result.done === true) {
      console.log('Operation completed successfully');
      return result;
    }

    if (result.error) {
      console.error('Operation failed with error:', result.error);
      throw new Error(`Video generation failed: ${result.error.message}`);
    }

    attempts++;
    if (attempts < maxAttempts) {
      console.log('Operation still processing, waiting 10 seconds...');
      await new Promise(resolve => setTimeout(resolve, 10000)); // 10 seconds like in docs
    }
  }

  throw new Error('Video generation timed out after 10 minutes');
}

// Download video from Google AI with correct API key format
async function downloadVideo(fileUri: string): Promise<Uint8Array> {
  console.log('Downloading video from:', fileUri);
  
  if (!geminiApiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }
  
  const response = await fetch(fileUri, {
    headers: {
      'x-goog-api-key': geminiApiKey,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Download error (${response.status}):`, errorText);
    throw new Error(`Failed to download video: ${response.status}`);
  }

  return new Uint8Array(await response.arrayBuffer());
}

// Upload video to Supabase Storage
async function uploadToSupabase(supabase: any, videoData: Uint8Array, fileName: string): Promise<string> {
  console.log('Uploading video to Supabase Storage:', fileName);
  
  const { data, error } = await supabase.storage
    .from('videos')
    .upload(fileName, videoData, {
      contentType: 'video/mp4',
      upsert: false
    });

  if (error) {
    console.error('Supabase upload error:', error);
    throw new Error(`Failed to upload video: ${error.message}`);
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('videos')
    .getPublicUrl(fileName);

  console.log('Video uploaded successfully:', urlData.publicUrl);
  return urlData.publicUrl;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!geminiApiKey || !supabaseUrl || !supabaseServiceKey) {
    console.error('Missing required environment variables');
    return new Response(
      JSON.stringify({ error: 'Server configuration error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }

  // Declare requestData outside try block to access in catch
  let requestData: GenerateVideoRequest | undefined;
  
  try {
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body safely - store it first to avoid "body already consumed"
    const requestText = await req.text();
    if (!requestText.trim()) {
      throw new Error('Empty request body');
    }

    requestData = safeParseJson(requestText);
    
    if (!requestData || !requestData.scriptId || !requestData.prompt) {
      throw new Error('Missing required fields: scriptId and prompt');
    }
    
    const { scriptId, prompt } = requestData;

    console.log('Starting video generation for script:', scriptId);
    console.log('Prompt:', prompt.substring(0, 100) + '...');

    // Create initial video record in database
    const { data: videoRecord, error: insertError } = await supabase
      .from('videos')
      .insert({
        script_id: scriptId,
        status: 'processing',
        gcp_operation_name: 'pending'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating video record:', insertError);
      throw new Error(`Failed to create video record: ${insertError.message}`);
    }

    console.log('Video record created:', videoRecord.id);

    // Step 1: Generate video with VEO 3 using correct REST API format
    console.log('Calling VEO 3 API...');
    const veoRequest = {
      instances: [{
        prompt: `Create a short, engaging TikTok-style video based on this script: ${prompt}. 
                 Make it dynamic, visually interesting, and suitable for social media. 
                 Duration: 5-10 seconds. Style: Modern, energetic, professional yet fun.`
      }]
    };

    const veoResponse = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/veo-3.0-generate-001:predictLongRunning',
      {
        method: 'POST',
        headers: {
          'x-goog-api-key': geminiApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(veoRequest),
      }
    );

    if (!veoResponse.ok) {
      const errorText = await veoResponse.text();
      console.error(`VEO API error (${veoResponse.status}):`, errorText);
      
      // Update video record with error
      await supabase
        .from('videos')
        .update({
          status: 'failed',
          error_message: `VEO API error: ${veoResponse.status} - ${errorText}`
        })
        .eq('id', videoRecord.id);
      
      throw new Error(`VEO API failed: ${veoResponse.status} ${errorText}`);
    }

    const veoResponseText = await veoResponse.text();
    const veoResult: VeoResponse = safeParseJson(veoResponseText);

    if (veoResult.error) {
      console.error('VEO API returned error:', veoResult.error);
      
      // Update video record with error
      await supabase
        .from('videos')
        .update({
          status: 'failed',
          error_message: `VEO generation failed: ${veoResult.error.message}`
        })
        .eq('id', videoRecord.id);
      
      throw new Error(`VEO generation failed: ${veoResult.error.message}`);
    }

    console.log('VEO API response received, operation name:', veoResult.name);

    // Update video record with operation name
    await supabase
      .from('videos')
      .update({
        gcp_operation_name: veoResult.name
      })
      .eq('id', videoRecord.id);

    // Step 2: Poll for completion
    const completedResult = await pollOperationStatus(veoResult.name);

    // Step 3: Extract video URL using correct VEO 3 response structure
    const videoUri = completedResult.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.uri;

    if (!videoUri) {
      console.error('No video URI in response:', JSON.stringify(completedResult, null, 2));
      
      // Update video record with error
      await supabase
        .from('videos')
        .update({
          status: 'failed',
          error_message: 'No video generated - missing video URI in response'
        })
        .eq('id', videoRecord.id);
      
      throw new Error('No video generated - missing video URI in response');
    }

    console.log('Video generated successfully, video URI:', videoUri);

    // Step 4: Download video
    const videoData = await downloadVideo(videoUri);
    console.log('Video downloaded, size:', videoData.length, 'bytes');

    // Step 5: Upload to Supabase Storage
    const fileName = `script-${scriptId}-${Date.now()}.mp4`;
    const publicUrl = await uploadToSupabase(supabase, videoData, fileName);

    // Step 6: Update database with final URL
    const { error: finalUpdateError } = await supabase
      .from('videos')
      .update({ 
        status: 'completed',
        video_url: publicUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', videoRecord.id);

    if (finalUpdateError) {
      console.error('Failed to update video with final URL:', finalUpdateError);
      throw new Error(`Database update failed: ${finalUpdateError.message}`);
    }

    console.log('Video generation completed successfully:', publicUrl);

    return new Response(
      JSON.stringify({ 
        success: true,
        videoUrl: publicUrl,
        videoId: videoRecord.id,
        operationName: veoResult.name,
        message: 'Video generated and uploaded successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in generate-veo-video function:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    // Try to update video status to error if we have the video record
    try {
      if (supabaseUrl && supabaseServiceKey) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        
        // Try to find and update any processing video records for this script
        if (requestData?.scriptId) {
          await supabase
            .from('videos')
            .update({ 
              status: 'failed',
              error_message: errorMessage,
              updated_at: new Date().toISOString()
            })
            .eq('script_id', requestData.scriptId)
            .eq('status', 'processing');
        }
      }
    } catch (updateError) {
      console.error('Failed to update error status:', updateError);
    }

    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        success: false
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});