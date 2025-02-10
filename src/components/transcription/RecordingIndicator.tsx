
interface RecordingIndicatorProps {
  isRecording: boolean;
}

export const RecordingIndicator = ({ isRecording }: RecordingIndicatorProps) => {
  if (!isRecording) return null;

  return (
    <div className="absolute top-4 right-4">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-destructive animate-pulse" />
        <span className="text-sm text-muted-foreground">Recording...</span>
      </div>
    </div>
  );
};
