
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecordingControls } from "./RecordingControls";
import { TranscriptView } from "./TranscriptView";
import { SoapNoteForm } from "./SoapNoteForm";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { generateSoapNote, saveSoapNote } from "@/services/soapNoteService";

export const TranscriptionSection = () => {
  const { user } = useAuth();
  const { isRecording, transcript, toggleRecording } = useSpeechRecognition();
  const [soapNote, setSoapNote] = useState({
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
  });
  const [activeTab, setActiveTab] = useState("transcript");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateSoap = async () => {
    setIsGenerating(true);
    const generatedNote = await generateSoapNote(transcript);
    if (generatedNote) {
      setSoapNote(generatedNote);
      setActiveTab("soap");
    }
    setIsGenerating(false);
  };

  const handleSoapChange = (section) => (e) => {
    setSoapNote((prev) => ({
      ...prev,
      [section]: e.target.value,
    }));
  };

  const handleSaveNote = () => {
    saveSoapNote(user?.id, transcript, soapNote);
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
          onSaveNote={handleSaveNote}
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
            onGenerateSoap={handleGenerateSoap}
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
