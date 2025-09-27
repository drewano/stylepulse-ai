import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Headers CORS pour autoriser les requêtes depuis votre application web
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Fonction pour attendre un certain temps (en millisecondes)
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
    
    // Extraire le prompt du corps de la requête
    const { prompt } = await req.json();
    if (!prompt) {
      throw new Error("Le paramètre 'prompt' est requis dans le corps de la requête.");
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
      const errorData = await initiateResponse.json();
      console.error('Erreur lors de l\'initiation (API Google) :', errorData);
      throw new Error(`Erreur de l'API Google GenAI : ${initiateResponse.status} ${JSON.stringify(errorData)}`);
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
        const errorData = await pollResponse.json();
        console.error('Erreur lors de la verification de l etat (API Google) :', errorData);
        // On continue d'essayer au lieu de s'arreter immediatement
      } else {
        operation = await pollResponse.json();
      }
    }
    
    if (!operation.done) {
        throw new Error("L'operation de generation video a depasse le temps maximum.");
    }

    console.log("[+] Operation terminee !");

    // --- Étape 3: Renvoyer le résultat final ---
    const finalResponse = operation.response;

    return new Response(JSON.stringify(finalResponse), {
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