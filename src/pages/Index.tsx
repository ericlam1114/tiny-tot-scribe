
import { TranscriptionSection } from "@/components/TranscriptionSection";
import { NotesTemplate } from "@/components/NotesTemplate";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-scribe-teal-light via-white to-scribe-purple-light p-6 animate-fade-in">
      <main className="container mx-auto space-y-6">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-scribe-purple-dark mb-2">
            PediScribe AI
          </h1>
          <p className="text-scribe-gray-dark text-lg">
            Intelligent Voice-to-Text for Pediatricians
          </p>
        </header>

        <TranscriptionSection />
        <NotesTemplate />
      </main>
    </div>
  );
};

export default Index;
