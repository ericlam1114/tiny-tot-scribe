
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecordingControls } from "./transcription/RecordingControls";
import { TranscriptDisplay } from "./transcription/TranscriptDisplay";
import { RecordingIndicator } from "./transcription/RecordingIndicator";
import { SoapNoteEditor } from "./transcription/SoapNoteEditor";

interface SoapNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export const TranscriptionSection = () => {
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [soapNote, setSoapNote] = useState<SoapNote>({
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
  });
  const [activeTab, setActiveTab] = useState("transcript");

  useEffect(() => {
    if (typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognitionAPI) {
        const recognition = new SpeechRecognitionAPI();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event: SpeechRecognitionEvent) => {
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

          setTranscript((prev) => prev + finalTranscript);
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

  const handleSoapChange = (section: keyof SoapNote, value: string) => {
    setSoapNote((prev) => ({
      ...prev,
      [section]: value,
    }));
  };

  const saveNote = async () => {
    try {
      const { error } = await supabase.from("patient_notes").insert({
        content: transcript,
        soap_format: JSON.stringify(soapNote),
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
    <Card className="glass-card p-6 w-full max-w-4xl mx-auto transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-foreground">
          Patient Notes
        </h2>
        <RecordingControls
          isRecording={isRecording}
          onToggleRecording={toggleRecording}
          onSaveNote={saveNote}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 bg-secondary">
          <TabsTrigger value="transcript">Transcript</TabsTrigger>
          <TabsTrigger value="soap">SOAP Note</TabsTrigger>
        </TabsList>

        <TabsContent value="transcript">
          <div className="relative">
            <RecordingIndicator isRecording={isRecording} />
            <TranscriptDisplay
              transcript={transcript}
              isRecording={isRecording}
            />
          </div>
        </TabsContent>

        <TabsContent value="soap">
          <SoapNoteEditor
            soapNote={soapNote}
            onSoapChange={handleSoapChange}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
};
