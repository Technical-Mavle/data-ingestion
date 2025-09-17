// In supabase/functions/trigger-ingestion/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  try {
    // 1. Get the file details from the webhook payload
    const payload = await req.json();
    const record = payload.record;
    const fileName = record.name;
    const bucketId = record.bucket_id;

    // 2. Only proceed if the file was added to the 'raw-uploads' bucket
    if (bucketId !== 'raw-uploads') {
      return new Response("Not a raw-uploads event. Skipping.", { status: 200 });
    }
    
    console.log(`File uploaded: ${fileName}. Triggering ingestion API.`);

    // 3. Get the Render API URL from environment variables for security
    const renderApiUrl = Deno.env.get('RENDER_API_ENDPOINT');
    if (!renderApiUrl) {
      throw new Error("RENDER_API_ENDPOINT is not set.");
    }

    // 4. Call your Render API endpoint
    const response = await fetch(renderApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: fileName }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`API call failed with status ${response.status}: ${errorBody}`);
    }

    console.log("Successfully triggered ingestion API.");
    return new Response(JSON.stringify({ success: true, message: "Ingestion triggered." }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error in Edge Function:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});