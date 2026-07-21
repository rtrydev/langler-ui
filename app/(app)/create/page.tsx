import { PageHeader } from "@/components/PageHeader";
import { CreateLessonWizard } from "./_components/CreateLessonWizard";

export default function CreatePage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader kicker="Create" title="Create a lesson" />
      <CreateLessonWizard />
    </div>
  );
}
