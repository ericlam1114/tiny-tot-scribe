
import { TranscriptionSection } from "@/components/TranscriptionSection";
import { NotesTemplate } from "@/components/NotesTemplate";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="absolute inset-0 bg-grid-blue-500/[0.02] -z-10" />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <header className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            PediScribe AI
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Transform your pediatric consultations with intelligent voice-to-text technology
          </p>
        </header>

        <div className="max-w-5xl mx-auto space-y-8">
          <TranscriptionSection />
          <NotesTemplate />
        </div>
      </main>
    </div>
  );
};

export default Index;
