
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const generateSoapNote = async (transcript) => {
  if (!transcript) {
    toast({
      title: "No Transcript Available",
      description: "Please record or enter some text first.",
      variant: "destructive",
    });
    return null;
  }

  try {
    const response = await fetch(
      `${supabase.supabaseUrl}/functions/v1/generate-soap`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabase.supabaseKey}`,
        },
        body: JSON.stringify({ transcript }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to generate SOAP note");
    }

    const generatedNote = await response.json();
    toast({
      title: "SOAP Note Generated",
      description: "The AI has analyzed your transcript and generated a SOAP note.",
    });
    return generatedNote;
  } catch (error) {
    console.error("Error generating SOAP note:", error);
    toast({
      title: "Error",
      description: "Failed to generate SOAP note. Please try again.",
      variant: "destructive",
    });
    return null;
  }
};

export const saveSoapNote = async (userId, transcript, soapNote) => {
  try {
    const { error } = await supabase.from("patient_notes").insert({
      content: transcript,
      soap_format: soapNote,
      user_id: userId,
    });

    if (error) throw error;

    toast({
      title: "Success",
      description: "Note saved successfully",
    });
    return true;
  } catch (error) {
    console.error("Error saving note:", error);
    toast({
      title: "Error",
      description: "Failed to save note",
      variant: "destructive",
    });
    return false;
  }
};
