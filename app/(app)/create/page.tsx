import { Heading } from "@/components/ui/Heading";
import { CreateLessonWizard } from "./_components/CreateLessonWizard";

export default function CreatePage() {
  return (
    <div>
      <Heading as="h1" className="mb-6" size="lg">
        Create a lesson
      </Heading>
      <CreateLessonWizard />
    </div>
  );
}
