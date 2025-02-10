import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, Save } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

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
    if (typeof window !== "undefined" && window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognitionAPI =
        window.SpeechRecognition || window.webkitSpeechRecognition;

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

  const handleSoapChange = (section: keyof SoapNote) => (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setSoapNote((prev) => ({
      ...prev,
      [section]: e.target.value,
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
        <div className="flex gap-2">
          <Button
            onClick={toggleRecording}
            variant={isRecording ? "destructive" : "default"}
            className="transition-all duration-300"
          >
            {isRecording ? (
              <MicOff className="w-5 h-5 mr-2" />
            ) : (
              <Mic className="w-5 h-5 mr-2" />
            )}
            {isRecording ? "Stop Recording" : "Start Recording"}
          </Button>
          <Button
            onClick={saveNote}
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10"
          >
            <Save className="w-5 h-5 mr-2" />
            Save Note
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 bg-secondary">
          <TabsTrigger value="transcript">Transcript</TabsTrigger>
          <TabsTrigger value="soap">SOAP Note</TabsTrigger>
        </TabsList>

        <TabsContent value="transcript">
          <div className="relative min-h-[300px] p-4 rounded-lg bg-secondary/50 border border-border">
            {isRecording && (
              <div className="absolute top-4 right-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive animate-pulse" />
                  <span className="text-sm text-muted-foreground">Recording...</span>
                </div>
              </div>
            )}
            <div className="prose max-w-none">
              {transcript || (
                <p className="text-muted-foreground italic">
                  {isRecording
                    ? "Listening... Speak clearly into your microphone."
                    : "Click 'Start Recording' to begin transcription."}
                </p>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="soap">
          <div className="space-y-4">
            {["subjective", "objective", "assessment", "plan"].map((section) => (
              <div key={section}>
                <h3 className="text-lg font-semibold mb-2 capitalize text-foreground">
                  {section}
                </h3>
                <Textarea
                  value={soapNote[section]}
                  onChange={handleSoapChange(section)}
                  placeholder={`Enter ${section} information...`}
                  className="min-h-[100px] bg-secondary/50"
                />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
