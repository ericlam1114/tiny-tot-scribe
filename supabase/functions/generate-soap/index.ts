
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a medical assistant helping to generate SOAP notes from medical transcripts. 
            Generate a SOAP note with exactly these four fields: subjective (a string summarizing patient's symptoms and history), 
            objective (a string for examination findings), assessment (a string for diagnosis and clinical reasoning), 
            and plan (a string for treatment plan). Each field should be a simple string, not an object.`
          },
          {
            role: 'user',
            content: transcript
          }
        ],
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error('OpenAI API error:', JSON.stringify(errorData));
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await openaiResponse.json();
    console.log('OpenAI response:', JSON.stringify(data));

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from OpenAI');
    }

    let soapNote;
    try {
      soapNote = JSON.parse(data.choices[0].message.content);
      
      // Ensure each field is a string
      const formattedSoapNote = {
        subjective: typeof soapNote.subjective === 'object' ? 
          Object.values(soapNote.subjective).join('\n') : 
          soapNote.subjective || '',
        objective: typeof soapNote.objective === 'object' ? 
          Object.values(soapNote.objective).join('\n') : 
          soapNote.objective || '',
        assessment: typeof soapNote.assessment === 'object' ? 
          Object.values(soapNote.assessment).join('\n') : 
          soapNote.assessment || '',
        plan: typeof soapNote.plan === 'object' ? 
          Object.values(soapNote.plan).join('\n') : 
          soapNote.plan || ''
      };

      soapNote = formattedSoapNote;
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
