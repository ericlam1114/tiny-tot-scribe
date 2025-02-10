
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://deno.land/x/openai@v4.24.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { transcript } = await req.json();

    if (!transcript) {
      throw new Error('No transcript provided');
    }

    console.log('Processing transcript:', transcript.substring(0, 100) + '...');

    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a medical assistant helping to generate SOAP notes from medical transcripts. 
          Format the response as a JSON object with four sections: subjective, objective, assessment, and plan.
          Keep the original medical terminology and be precise.`
        },
        {
          role: 'user',
          content: `Please analyze this medical transcript and create a SOAP note from it: ${transcript}`
        }
      ],
    });

    if (!completion.choices?.[0]?.message?.content) {
      console.error('Unexpected OpenAI response format:', completion);
      throw new Error('Invalid response from OpenAI');
    }

    let soapNote;
    try {
      soapNote = JSON.parse(completion.choices[0].message.content);
    } catch (error) {
      console.error('Error parsing OpenAI response as JSON:', error);
      throw new Error('Failed to parse SOAP note format');
    }

    return new Response(JSON.stringify(soapNote), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-soap function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
