import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecordingControls } from "./RecordingControls";
import { TranscriptView } from "./TranscriptView";
import { SoapNoteForm } from "./SoapNoteForm";

export const TranscriptionSection = () => {
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState(null);
  const [soapNote, setSoapNote] = useState({
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
  });
  const [activeTab, setActiveTab] = useState("transcript");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSoapNote = async () => {
    if (!transcript) {
      toast({
        title: "No Transcript Available",
        description: "Please record or enter some text first.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
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
      setSoapNote(generatedNote);
      setActiveTab("soap");
      toast({
        title: "SOAP Note Generated",
        description: "The AI has analyzed your transcript and generated a SOAP note.",
      });
    } catch (error) {
      console.error("Error generating SOAP note:", error);
      toast({
        title: "Error",
        description: "Failed to generate SOAP note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateSoap = () => {
    if (transcript) {
      generateSoapNote();
    } else {
      toast({
        title: "No Transcript Available",
        description: "Please record or enter some text first.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognitionAPI) {
        const recognition = new SpeechRecognitionAPI();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event) => {
          let interimTranscript = "";
          let finalTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + " ";
            } else {
              interimTranscript += transcript;
            }
          }

          setTranscript((prev) => {
            const newTranscript = prev + finalTranscript;
            return newTranscript;
          });
        };

        recognition.onerror = (event) => {
          console.error("Speech recognition error", event);
          toast({
            title: "Error",
            description: "There was an error with the speech recognition",
            variant: "destructive",
          });
          setIsRecording(false);
        };

        setRecognition(recognition);
      } else {
        toast({
          title: "Not Supported",
          description: "Speech recognition is not supported in this browser",
          variant: "destructive",
        });
      }
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  const toggleRecording = () => {
    if (!recognition) return;

    if (!isRecording) {
      recognition.start();
      setIsRecording(true);
      toast({
        title: "Recording Started",
        description: "Speak clearly into your microphone",
      });
    } else {
      recognition.stop();
      setIsRecording(false);
      toast({
        title: "Recording Stopped",
        description: "Transcription saved",
      });
    }
  };

  const handleSoapChange = (section) => (e) => {
    setSoapNote((prev) => ({
      ...prev,
      [section]: e.target.value,
    }));
  };

  const saveNote = async () => {
    try {
      const { error } = await supabase.from("patient_notes").insert({
        content: transcript,
        soap_format: soapNote,
        user_id: user?.id,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Note saved successfully",
      });
    } catch (error) {
      console.error("Error saving note:", error);
      toast({
        title: "Error",
        description: "Failed to save note",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6 w-full max-w-4xl mx-auto bg-white/80 backdrop-blur-sm shadow-lg border border-scribe-teal/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-scribe-purple-dark">
          Patient Notes
        </h2>
        <RecordingControls 
          isRecording={isRecording}
          onToggleRecording={toggleRecording}
          onSaveNote={saveNote}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="transcript">Transcript</TabsTrigger>
          <TabsTrigger value="soap">SOAP Note</TabsTrigger>
        </TabsList>

        <TabsContent value="transcript">
          <TranscriptView 
            transcript={transcript} 
            isRecording={isRecording} 
            onGenerateSoap={generateSoapNote}
            isGenerating={isGenerating}
          />
        </TabsContent>

        <TabsContent value="soap">
          <SoapNoteForm soapNote={soapNote} onSoapChange={handleSoapChange} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};
