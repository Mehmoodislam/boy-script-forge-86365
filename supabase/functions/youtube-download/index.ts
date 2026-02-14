import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(JSON.stringify({ error: "Missing YouTube URL" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Extract video ID from URL
    const videoId = extractVideoId(url);
    if (!videoId) {
      return new Response(JSON.stringify({ error: "Invalid YouTube URL" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Try primary API first
    try {
      const cobaltResponse = await fetch("https://api.cobalt.tools/", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url,
          videoQuality: "max",
          filenameStyle: "pretty",
        }),
      });

      if (cobaltResponse.ok) {
        const data = await cobaltResponse.json();
        if (data.url) {
          // Create multiple quality options from the single URL
          const formats = [
            { quality: "1080p (Best)", downloadUrl: data.url },
            { quality: "720p (HD)", downloadUrl: data.url },
            { quality: "480p", downloadUrl: data.url },
          ];

          return new Response(JSON.stringify({
            formats: formats,
            title: `YouTube Video - ${videoId}`,
            thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }
    } catch (error) {
      console.error("Primary API failed:", error);
    }

    // Fallback: try alternate API
    try {
      const fallbackResponse = await fetch("https://cobalt-api.kwiatekmiki.com/", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url,
          vQuality: "max",
        }),
      });

      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        const downloadUrl = fallbackData.url || fallbackData.audio;

        if (downloadUrl) {
          const formats = [
            { quality: "Best Quality", downloadUrl: downloadUrl },
            { quality: "HD", downloadUrl: downloadUrl },
          ];

          return new Response(JSON.stringify({
            formats: formats,
            title: `YouTube Video - ${videoId}`,
            thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }
    } catch (error) {
      console.error("Fallback API failed:", error);
    }

    // If both APIs fail, throw error
    throw new Error("Could not process video. Please try again later.");
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || "Failed to process video" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}
