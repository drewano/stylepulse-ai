import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { createClient } from "npm:@supabase/supabase-js"

interface GenerateStoryboardsPayload {
  userPrompt?: unknown
  accountId?: unknown
}

interface TrendInsight {
  title: string
  summary: string
  url?: string
}

interface StoryboardScene {
  id: string
  hook: string
  visuals: string
  narration: string
}

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
const EXA_API_KEY = Deno.env.get("EXA_API_KEY")

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

    const payload = await req.json() as GenerateStoryboardsPayload
    const userPrompt = typeof payload.userPrompt === "string"
      ? payload.userPrompt.trim()
      : ""
    const accountId = typeof payload.accountId === "string"
      ? payload.accountId.trim()
      : ""

    if (!userPrompt || !accountId) {
      return jsonResponse({
        error: "Missing required fields",
        details: { required: ["userPrompt", "accountId"] },
      }, 400)
    }

    if (!supabase) {
      return jsonResponse({
        error: "Supabase client not configured",
        details: "Ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set",
      }, 500)
    }

    const trends = await fetchTrendInsights(userPrompt)
    const storyboards = generateStoryboardVariants(userPrompt, trends)

    const { data, error } = await supabase.from("storyboards").insert(
      storyboards.map((storyboard) => ({
        social_account_id: accountId,
        user_prompt: userPrompt,
        enriched_prompt: storyboard.enrichedPrompt,
        scenes: storyboard.scenes,
        status: "pending",
      })),
    ).select()

    if (error) {
      console.error("Failed to insert storyboards", error)
      return jsonResponse({ error: "Failed to create storyboards" }, 500)
    }

    return jsonResponse({
      data: {
        inserted: data,
        trends,
      },
    })
  } catch (err) {
    console.error("Unhandled error in generate-storyboards", err)
    return jsonResponse({ error: "Unexpected error" }, 500)
  }
})

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  })
}

async function fetchTrendInsights(prompt: string): Promise<TrendInsight[]> {
  if (!EXA_API_KEY) {
    return simulateTrendInsights(prompt)
  }

  try {
    const response = await fetch("https://api.exa.ai/search", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": EXA_API_KEY,
      },
      body: JSON.stringify({
        query: prompt,
        numResults: 3,
        useAutoprompt: true,
      }),
    })

    if (!response.ok) {
      console.warn("Exa API returned non-200 status", response.status)
      return simulateTrendInsights(prompt)
    }

    const data = await response.json()
    const results = Array.isArray(data?.results) ? data.results : []
    if (results.length === 0) {
      return simulateTrendInsights(prompt)
    }

    return results.slice(0, 3).map((item: Record<string, unknown>, index: number) => ({
      title: String(item?.title ?? `Trend ${index + 1}`),
      summary: String(item?.snippet ?? item?.description ?? prompt),
      url: typeof item?.url === "string" ? item.url : undefined,
    }))
  } catch (error) {
    console.error("Failed to reach Exa API", error)
    return simulateTrendInsights(prompt)
  }
}

function simulateTrendInsights(prompt: string): TrendInsight[] {
  return [
    {
      title: "Trending Hook Research",
      summary: `Creators who lean into concise hooks around "${prompt}" are seeing higher watch time.`,
    },
    {
      title: "Audience Pain Points",
      summary: `Short-form audiences respond to stories that solve a common frustration related to "${prompt}".`,
    },
    {
      title: "Visual Style Inspiration",
      summary: `High-contrast visuals and bold captions enhance retention for narratives about "${prompt}".`,
    },
  ]
}

function generateStoryboardVariants(prompt: string, trends: TrendInsight[]) {
  return trends.map((trend, index) => {
    const enrichedPrompt = `${prompt} — ${trend.title}: ${trend.summary}`
    const scenes: StoryboardScene[] = [
      {
        id: crypto.randomUUID(),
        hook: `Hook inspired by ${trend.title}`,
        visuals: "Quick sequence showcasing the main tension point",
        narration: `Have you ever wondered ${prompt.toLowerCase()}?`,
      },
      {
        id: crypto.randomUUID(),
        hook: "Act 2",
        visuals: "Demonstrate the transformation with dynamic b-roll",
        narration: `Here is what creators are doing differently: ${trend.summary}`,
      },
      {
        id: crypto.randomUUID(),
        hook: "Resolution",
        visuals: "Showcase the payoff with punchy motion graphics",
        narration: "Call to action: try it and iterate your own spin.",
      },
    ]

    return {
      enrichedPrompt,
      scenes,
      originalTrend: trend,
      variantLabel: `Storyboard Variant ${index + 1}`,
    }
  })
}
