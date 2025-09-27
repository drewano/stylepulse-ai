import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { createClient } from "npm:@supabase/supabase-js"

interface GenerateVideoPayload {
  storyboardId?: unknown
}

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
const RUNWAY_API_KEY = Deno.env.get("RUNWAYML_API_SECRET") || Deno.env.get("RUNWAY_API_KEY")

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    "Missing Supabase configuration. Ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.",
  )
}

const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  : undefined

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405)
  }

  try {
    const contentType = req.headers.get("content-type") || ""
    if (!contentType.includes("application/json")) {
      return jsonResponse({ error: "Expected application/json payload" }, 415)
    }

    const payload = await req.json() as GenerateVideoPayload
    const storyboardId = typeof payload.storyboardId === "string"
      ? payload.storyboardId.trim()
      : ""

    if (!storyboardId) {
      return jsonResponse({
        error: "Missing required field",
        details: { required: ["storyboardId"] },
      }, 400)
    }

    if (!supabase) {
      return jsonResponse({
        error: "Supabase client not configured",
        details: "Ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set",
      }, 500)
    }

    const { data: storyboard, error: storyboardError } = await supabase
      .from("storyboards")
      .select("id, user_prompt, enriched_prompt, scenes, social_account_id")
      .eq("id", storyboardId)
      .maybeSingle()

    if (storyboardError) {
      console.error("Failed to fetch storyboard", storyboardError)
      return jsonResponse({ error: "Failed to load storyboard" }, 500)
    }

    if (!storyboard) {
      return jsonResponse({ error: "Storyboard not found" }, 404)
    }

    const simulatedTask = await triggerVeOGeneration(storyboard)

    const { data: videoRecord, error: insertError } = await supabase
      .from("generated_videos")
      .upsert({
        storyboard_id: storyboardId,
        status: simulatedTask.status,
        video_url: simulatedTask.videoUrl,
      }, { onConflict: "storyboard_id" })
      .select()
      .maybeSingle()

    if (insertError) {
      console.error("Failed to upsert generated video", insertError)
      return jsonResponse({ error: "Failed to track video generation" }, 500)
    }

    return jsonResponse({
      data: {
        generationTask: simulatedTask,
        record: videoRecord,
      },
    })
  } catch (error) {
    console.error("Unhandled error in generate-video", error)
    return jsonResponse({ error: "Unexpected error" }, 500)
  }
})

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  })
}

interface VeOSimulatedTask {
  taskId: string
  status: "queued" | "processing" | "complete"
  videoUrl?: string
  notes: string
}

async function triggerVeOGeneration(storyboard: {
  id: string
  enriched_prompt: string | null
  user_prompt: string
  scenes: unknown
})
  : Promise<VeOSimulatedTask> {
  const baseTask: VeOSimulatedTask = {
    taskId: crypto.randomUUID(),
    status: "queued",
    notes: "Video generation queued with mock VEO integration.",
  }

  if (!RUNWAY_API_KEY) {
    return {
      ...baseTask,
      notes: `${baseTask.notes} RUNWAY_API_KEY missing; returning simulated response only.`,
    }
  }

  try {
    const response = await fetch("https://api.runwayml.com/v1/video-to-video", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${RUNWAY_API_KEY}`,
      },
      body: JSON.stringify({
        prompt: storyboard.enriched_prompt ?? storyboard.user_prompt,
        storyboardId: storyboard.id,
        scenes: storyboard.scenes,
        model: "gen3+",
      }),
    })

    if (!response.ok) {
      console.warn("Runway API returned non-200 status", response.status)
      return baseTask
    }

    const data = await response.json()
    return {
      taskId: String(data?.id ?? baseTask.taskId),
      status: "processing",
      videoUrl: typeof data?.output?.url === "string" ? data.output.url : undefined,
      notes: "Runway VEO generation initiated.",
    }
  } catch (error) {
    console.error("Failed to reach Runway API", error)
    return baseTask
  }
}
