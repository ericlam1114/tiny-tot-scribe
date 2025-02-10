
import { TranscriptionSection } from "@/components/TranscriptionSection";
import { NotesTemplate } from "@/components/NotesTemplate";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-background to-secondary/50 p-6">
      <main className="container mx-auto space-y-6">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-2">
            MedAssist
          </h1>
          <p className="text-muted-foreground text-lg">
            Intelligent Voice-to-Text for Healthcare Professionals
          </p>
        </header>

        <TranscriptionSection />
        <NotesTemplate />
      </main>
    </div>
  );
};

export default Index;
