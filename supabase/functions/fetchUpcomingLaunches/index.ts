// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "npm:@supabase/supabase-js@2.45.3"

console.log("Hello from Functions!")

const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!)

Deno.serve(async (req) => {
  const yesterdayDateTime = new Date();
  yesterdayDateTime.setDate(yesterdayDateTime.getDate() - 1);
  const yesterdayDate = yesterdayDateTime.toISOString().split('T')[0]

  const upcomingLaunchesResponse = await fetch(`https://ll.thespacedevs.com/2.2.0/launch/?limit=500&ordering=net&net__gt=${yesterdayDate}`)
  const upcomingLaunchesResult = await upcomingLaunchesResponse.json()
  const upcomingLaunches = upcomingLaunchesResult.results

  for (const launch of upcomingLaunches) {
    await supabase.from("launch").upsert({ id: launch.id, net: launch.net, last_updated: launch.last_updated, launchData: launch})
  }

  return new Response(
    JSON.stringify("hello everyone"),
    { headers: { "Content-Type": "application/json" } },
  )
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/fetchLaunches' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
