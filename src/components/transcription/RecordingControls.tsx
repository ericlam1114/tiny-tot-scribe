
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Save } from "lucide-react";

interface RecordingControlsProps {
  isRecording: boolean;
  onToggleRecording: () => void;
  onSaveNote: () => void;
}

export const RecordingControls = ({
  isRecording,
  onToggleRecording,
  onSaveNote,
}: RecordingControlsProps) => {
  return (
    <div className="flex gap-2">
      <Button
        onClick={onToggleRecording}
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
        onClick={onSaveNote}
        variant="outline"
        className="border-primary text-primary hover:bg-primary/10"
      >
        <Save className="w-5 h-5 mr-2" />
        Save Note
      </Button>
    </div>
  );
};
