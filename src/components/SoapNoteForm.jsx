
import { Textarea } from "@/components/ui/textarea";

export const SoapNoteForm = ({ soapNote, onSoapChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2 text-scribe-purple-dark">
          Subjective
        </h3>
        <Textarea
          value={soapNote.subjective}
          onChange={(e) => onSoapChange("subjective")(e)}
          placeholder="Patient's symptoms, concerns, and history..."
          className="min-h-[100px]"
        />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2 text-scribe-purple-dark">
          Objective
        </h3>
        <Textarea
          value={soapNote.objective}
          onChange={(e) => onSoapChange("objective")(e)}
          placeholder="Physical examination findings, vital signs, lab results..."
          className="min-h-[100px]"
        />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2 text-scribe-purple-dark">
          Assessment
        </h3>
        <Textarea
          value={soapNote.assessment}
          onChange={(e) => onSoapChange("assessment")(e)}
          placeholder="Diagnosis, differential diagnoses, clinical reasoning..."
          className="min-h-[100px]"
        />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2 text-scribe-purple-dark">
          Plan
        </h3>
        <Textarea
          value={soapNote.plan}
          onChange={(e) => onSoapChange("plan")(e)}
          placeholder="Treatment plan, medications, follow-up..."
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
};
