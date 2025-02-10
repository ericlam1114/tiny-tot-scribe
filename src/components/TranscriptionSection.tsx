
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, Edit2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export const TranscriptionSection = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
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

        setTranscript((prev) => prev + finalTranscript);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
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

  return (
    <Card className="p-6 w-full max-w-4xl mx-auto bg-white/80 backdrop-blur-sm shadow-lg border border-scribe-teal/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-scribe-purple-dark">Patient Notes</h2>
        <div className="flex gap-2">
          <Button
            onClick={toggleRecording}
            variant="outline"
            className={`
              transition-all duration-300 
              ${isRecording 
                ? "bg-scribe-teal text-white hover:bg-scribe-teal-dark" 
                : "border-scribe-teal text-scribe-teal hover:bg-scribe-teal/10"
              }
            `}
          >
            {isRecording ? (
              <MicOff className="w-5 h-5 mr-2" />
            ) : (
              <Mic className="w-5 h-5 mr-2" />
            )}
            {isRecording ? "Stop Recording" : "Start Recording"}
          </Button>
          <Button
            variant="outline"
            className="border-scribe-purple text-scribe-purple hover:bg-scribe-purple/10"
          >
            <Edit2 className="w-5 h-5 mr-2" />
            Edit Notes
          </Button>
        </div>
      </div>

      <div className="relative min-h-[300px] p-4 rounded-lg bg-scribe-gray-light border border-scribe-gray/20">
        {isRecording && (
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm text-scribe-gray">Recording...</span>
            </div>
          </div>
        )}
        <div className="prose max-w-none">
          {transcript || (
            <p className="text-scribe-gray italic">
              {isRecording 
                ? "Listening... Speak clearly into your microphone."
                : "Click 'Start Recording' to begin transcription."}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};
