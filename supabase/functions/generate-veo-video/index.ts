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
    candidates: Array<{
      content: {
        parts: Array<{
          fileData?: {
            fileUri: string;
            mimeType: string;
          };
        }>;
      };
    }>;
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

// Poll operation status
async function pollOperationStatus(operationName: string): Promise<VeoResponse> {
  const maxAttempts = 60; // 5 minutes with 5-second intervals
  let attempts = 0;

  while (attempts < maxAttempts) {
    console.log(`Polling attempt ${attempts + 1}/${maxAttempts} for operation: ${operationName}`);
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/${operationName}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${geminiApiKey}`,
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
      console.log('Operation still processing, waiting 5 seconds...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  throw new Error('Video generation timed out after 5 minutes');
}

// Download video from Google AI
async function downloadVideo(fileUri: string): Promise<Uint8Array> {
  console.log('Downloading video from:', fileUri);
  
  const response = await fetch(fileUri, {
    headers: {
      'Authorization': `Bearer ${geminiApiKey}`,
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

  try {
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body safely
    const requestText = await req.text();
    if (!requestText.trim()) {
      throw new Error('Empty request body');
    }

    const requestData: GenerateVideoRequest = safeParseJson(requestText);
    const { scriptId, prompt } = requestData;

    if (!scriptId || !prompt) {
      throw new Error('Missing required fields: scriptId and prompt');
    }

    console.log('Starting video generation for script:', scriptId);
    console.log('Prompt:', prompt.substring(0, 100) + '...');

    // Update video status to processing
    const { error: updateError } = await supabase
      .from('videos')
      .update({ 
        status: 'processing',
        updated_at: new Date().toISOString()
      })
      .eq('script_id', scriptId);

    if (updateError) {
      console.error('Failed to update video status:', updateError);
    }

    // Step 1: Generate video with VEO 3
    console.log('Calling VEO 3 API...');
    const veoRequest = {
      contents: [{
        parts: [{
          text: `Create a short, engaging TikTok-style video based on this script: ${prompt}. 
                 Make it dynamic, visually interesting, and suitable for social media. 
                 Duration: 5-10 seconds. Style: Modern, energetic, professional yet fun.`
        }]
      }],
      generationConfig: {
        responseModalities: ["VIDEO"],
        aspectRatio: "16:9"
      }
    };

    const veoResponse = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/veo-3:generateContent',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${geminiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(veoRequest),
      }
    );

    if (!veoResponse.ok) {
      const errorText = await veoResponse.text();
      console.error(`VEO API error (${veoResponse.status}):`, errorText);
      throw new Error(`VEO API failed: ${veoResponse.status} ${errorText}`);
    }

    const veoResponseText = await veoResponse.text();
    const veoResult: VeoResponse = safeParseJson(veoResponseText);

    if (veoResult.error) {
      console.error('VEO API returned error:', veoResult.error);
      throw new Error(`VEO generation failed: ${veoResult.error.message}`);
    }

    console.log('VEO API response received, operation name:', veoResult.name);

    // Step 2: Poll for completion
    const completedResult = await pollOperationStatus(veoResult.name);

    // Step 3: Extract video URL
    const candidate = completedResult.response?.candidates?.[0];
    const videoPart = candidate?.content?.parts?.[0];
    const fileUri = videoPart?.fileData?.fileUri;

    if (!fileUri) {
      console.error('No video file URI in response:', JSON.stringify(completedResult, null, 2));
      throw new Error('No video generated - missing file URI in response');
    }

    console.log('Video generated successfully, file URI:', fileUri);

    // Step 4: Download video
    const videoData = await downloadVideo(fileUri);
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
        updated_at: new Date().toISOString(),
        gcp_operation_name: veoResult.name
      })
      .eq('script_id', scriptId);

    if (finalUpdateError) {
      console.error('Failed to update video with final URL:', finalUpdateError);
      throw new Error(`Database update failed: ${finalUpdateError.message}`);
    }

    console.log('Video generation completed successfully:', publicUrl);

    return new Response(
      JSON.stringify({ 
        success: true,
        videoUrl: publicUrl,
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
    
    // Try to update video status to error if we have the script ID
    try {
      const requestData = safeParseJson(await req.text());
      if (requestData.scriptId && supabaseUrl && supabaseServiceKey) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        await supabase
          .from('videos')
          .update({ 
            status: 'error',
            error_message: errorMessage,
            updated_at: new Date().toISOString()
          })
          .eq('script_id', requestData.scriptId);
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