import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

// Headers CORS pour autoriser les requêtes depuis votre application web
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Safe JSON parser to avoid "Unexpected end of JSON input"
async function safeParseJson(res: Response) {
  const text = await res.text();
  try { 
    return JSON.parse(text); 
  } catch { 
    return { raw: text, parseError: true }; 
  }
}

// Fonction pour attendre un certain temps (en millisecondes)
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Initialiser le client Supabase
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  // Gérer la requête CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Récupérer la clé API Gemini depuis les secrets Supabase
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY non configuré dans les secrets Supabase');
    }
    
    // Extraire le prompt et l'ID du script du corps de la requête
    const body = await req.text();
    let requestData;
    
    try {
      requestData = JSON.parse(body);
    } catch (e) {
      throw new Error("Format JSON invalide dans la requête");
    }
    
    const { prompt, scriptId } = requestData;
    if (!prompt) {
      throw new Error("Le paramètre 'prompt' est requis dans le corps de la requête.");
    }
    if (!scriptId) {
      throw new Error("Le paramètre 'scriptId' est requis dans le corps de la requête.");
    }
    
    const scriptIdNum = Number(scriptId);
    if (!Number.isFinite(scriptIdNum)) {
      throw new Error("Le paramètre 'scriptId' doit être un nombre valide.");
    }

    console.log(`[+] Démarrage de la génération vidéo pour le prompt : "${prompt}"`);

    // --- Étape 1: Lancer l'opération de génération vidéo ---
    const initiateResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/veo:generateVideo?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: prompt,
        model: "models/veo-3.0-fast-generate-preview",
        config: {
          personGeneration: "dont_allow", // Ne pas générer de personnes
          aspectRatio: "16:9", // Format 16:9
        }
      }),
    });

    if (!initiateResponse.ok) {
      const errorData = await safeParseJson(initiateResponse);
      console.error('Erreur lors de l\'initiation (API Google):', initiateResponse.status, initiateResponse.statusText, errorData);
      throw new Error(`Erreur de l'API Google GenAI : ${initiateResponse.status} - ${errorData.raw || JSON.stringify(errorData)}`);
    }

    const initialOperation = await initiateResponse.json();
    const operationName = initialOperation.name;
    console.log(`[+] Opération démarrée avec succès. Nom de l'opération : ${operationName}`);

    // --- Étape 2: Interroger l'état de l'opération jusqu'à ce qu'elle soit terminée ---
    let operation = initialOperation;
    let attempts = 0;
    const maxAttempts = 60; // 60 tentatives * 10 secondes = 10 minutes max

    while (!operation.done && attempts < maxAttempts) {
      attempts++;
      console.log(`[i] Tentative ${attempts}/${maxAttempts}. L'opération n'est pas terminée, attente de 10 secondes...`);
      await sleep(10000); // Attendre 10 secondes entre chaque vérification

      const pollResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/${operationName}?key=${GEMINI_API_KEY}`);
      
      if (!pollResponse.ok) {
        const errorData = await safeParseJson(pollResponse);
        console.warn('Poll error:', pollResponse.status, pollResponse.statusText, errorData);
        // On continue d'essayer au lieu de s'arreter immediatement
        continue;
      } else {
        operation = await pollResponse.json();
        console.log(`[i] Status: ${operation.done ? 'terminé' : 'en cours'}${operation.error ? `, erreur: ${JSON.stringify(operation.error)}` : ''}`);
        
        // Si operation.error existe, arrêter
        if (operation.error) {
          throw new Error(`Erreur dans l'opération Google: ${JSON.stringify(operation.error)}`);
        }
      }
    }
    
    if (!operation.done) {
        throw new Error("L'operation de generation video a depasse le temps maximum.");
    }

    console.log("[+] Operation terminee !");

    // --- Étape 3: Télécharger et stocker la vidéo ---
    const finalResponse = operation.response;
    
    if (!finalResponse.video?.uri) {
      throw new Error("Aucune vidéo générée dans la réponse");
    }

    const videoUrl = finalResponse.video.uri;
    console.log(`[+] URL de la vidéo générée: ${videoUrl}`);

    // Télécharger la vidéo
    console.log("[+] Téléchargement de la vidéo...");
    const videoResponse = await fetch(videoUrl);
    if (!videoResponse.ok) {
      throw new Error(`Erreur lors du téléchargement de la vidéo: ${videoResponse.status}`);
    }

    const videoBlob = await videoResponse.blob();
    const videoBuffer = await videoBlob.arrayBuffer();
    
    // Générer un nom unique pour la vidéo
    const fileName = `video_${scriptIdNum}_${Date.now()}.mp4`;
    
    // Stocker la vidéo dans Supabase Storage
    console.log(`[+] Upload de la vidéo vers Supabase Storage: ${fileName}`);
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('videos')
      .upload(fileName, videoBuffer, {
        contentType: 'video/mp4',
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Erreur lors de l\'upload:', uploadError);
      throw new Error(`Erreur lors de l'upload: ${uploadError.message}`);
    }

    // Obtenir l'URL publique de la vidéo
    const { data: publicUrlData } = supabase.storage
      .from('videos')
      .getPublicUrl(fileName);
    
    const publicUrl = publicUrlData.publicUrl;
    console.log(`[+] Vidéo stockée avec succès: ${publicUrl}`);

    // Sauvegarder les informations dans la base de données
    const { data: videoRecord, error: dbError } = await supabase
      .from('videos')
      .insert({
        script_id: scriptIdNum,
        video_url: publicUrl,
        status: 'completed',
        gcp_operation_name: operationName
      })
      .select()
      .single();

    if (dbError) {
      console.error('Erreur lors de la sauvegarde en base:', dbError);
      throw new Error(`Erreur lors de la sauvegarde: ${dbError.message}`);
    }

    console.log("[+] Vidéo sauvegardée en base de données");

    // --- Étape 4: Renvoyer le résultat final ---
    return new Response(JSON.stringify({
      success: true,
      video: {
        id: videoRecord.id,
        url: publicUrl,
        originalUrl: videoUrl,
        fileName: fileName
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    // Gestion des erreurs
    console.error('Erreur dans la fonction Edge :', error);
    const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue';
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});