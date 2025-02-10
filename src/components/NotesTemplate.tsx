
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export const NotesTemplate = () => {
  const sections = [
    { title: "Chief Complaint", key: "complaint" },
    { title: "History of Present Illness", key: "history" },
    { title: "Past Medical History", key: "medical" },
    { title: "Physical Examination", key: "examination" },
    { title: "Assessment", key: "assessment" },
    { title: "Plan", key: "plan" },
  ];

  return (
    <Card className="p-6 w-full max-w-4xl mx-auto mt-6 bg-white/80 backdrop-blur-sm shadow-lg border border-scribe-purple/20">
      <h2 className="text-2xl font-semibold text-scribe-purple-dark mb-4">Templates</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section) => (
          <Button
            key={section.key}
            variant="outline"
            className="h-auto p-4 justify-between hover:bg-scribe-purple/5 border-scribe-purple/20 group"
          >
            <span className="text-left">
              <span className="block font-medium text-scribe-purple-dark">
                {section.title}
              </span>
              <span className="text-sm text-scribe-gray">
                Click to add section
              </span>
            </span>
            <ChevronRight className="w-5 h-5 text-scribe-purple opacity-50 group-hover:opacity-100 transition-opacity" />
          </Button>
        ))}
      </div>
    </Card>
  );
};
