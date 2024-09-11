// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "npm:@supabase/supabase-js@2.45.3"

const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!)

Deno.serve(async (req) => {
  let fetchUrl = "https://ll.thespacedevs.com/2.2.0/launch/?limit=100&mode=detailed&ordering=-net&net__lt=2024-09-10"

  while (fetchUrl) {
    try {
      const response = await fetch(fetchUrl);
      const result = await response.json();

      if (result.next === fetchUrl) break;
      fetchUrl = result.next;

      const launches = result.results
      for (const launch of launches) {
        await supabase.from("launch").insert({ id: launch.id, net: launch.net, launchData: launch})
      }
    } catch (error) {
      console.log("Error fetching launches", error, launches)
      break;
    }
  }

  return new Response(
    JSON.stringify("hello everyone"),
    { headers: { "Content-Type": "application/json" } },
  )
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/fetchPastLaunches' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
