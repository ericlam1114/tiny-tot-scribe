
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Save } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export const RecordingControls = ({ isRecording, onToggleRecording, onSaveNote }) => {
  return (
    <div className="flex gap-2">
      <Button
        onClick={onToggleRecording}
        variant="outline"
        className={`
          transition-all duration-300 
          ${
            isRecording
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
        onClick={onSaveNote}
        variant="outline"
        className="border-scribe-purple text-scribe-purple hover:bg-scribe-purple/10"
      >
        <Save className="w-5 h-5 mr-2" />
        Save Note
      </Button>
    </div>
  );
};
