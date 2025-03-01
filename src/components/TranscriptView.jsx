
export const TranscriptView = ({ transcript, isRecording, onGenerateSoap, isGenerating }) => {
  return (
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
        {transcript ? (
          <div className="flex flex-col gap-4">
            <p>{transcript}</p>
            <div>
              <button
                onClick={onGenerateSoap}
                disabled={isGenerating}
                className="inline-flex items-center px-4 py-2 rounded-md bg-scribe-purple text-white hover:bg-scribe-purple-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  "Generate SOAP Note"
                )}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-scribe-gray italic">
            {isRecording
              ? "Listening... Speak clearly into your microphone."
              : "Click 'Start Recording' to begin transcription."}
          </p>
        )}
      </div>
    </div>
  );
};
