
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

export const useSpeechRecognition = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState(null);

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

  return {
    isRecording,
    transcript,
    toggleRecording,
  };
};
