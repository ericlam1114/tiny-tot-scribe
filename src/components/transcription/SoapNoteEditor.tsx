
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

interface SoapNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

interface SoapNoteEditorProps {
  soapNote: SoapNote;
  onSoapChange: (section: keyof SoapNote, value: string) => void;
}

export const SoapNoteEditor = ({ soapNote, onSoapChange }: SoapNoteEditorProps) => {
  const sections: Array<keyof SoapNote> = ["subjective", "objective", "assessment", "plan"];

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <div key={section}>
          <h3 className="text-lg font-semibold mb-2 capitalize text-foreground">
            {section}
          </h3>
          <Textarea
            value={soapNote[section]}
            onChange={(e) => onSoapChange(section, e.target.value)}
            placeholder={`Enter ${section} information...`}
            className="min-h-[100px] bg-secondary/50"
          />
        </div>
      ))}
    </div>
  );
};
