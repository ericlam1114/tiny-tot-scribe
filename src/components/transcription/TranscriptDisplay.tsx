
interface TranscriptDisplayProps {
  transcript: string;
  isRecording: boolean;
}

export const TranscriptDisplay = ({ transcript, isRecording }: TranscriptDisplayProps) => {
  return (
    <div className="relative min-h-[300px] p-4 rounded-lg bg-secondary/50 border border-border">
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
  );
};
