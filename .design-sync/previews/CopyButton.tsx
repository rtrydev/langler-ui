import { CopyButton } from "langler-ui";

export const Basic = () => (
  <CopyButton text="lang_sk_9f2e7c1a">Copy</CopyButton>
);

export const Variants = () => (
  <div className="flex flex-wrap items-center gap-3">
    <CopyButton size="sm" text="Create a beginner Japanese lesson" variant="accent">
      Copy prompt
    </CopyButton>
    <CopyButton
      copiedLabel="Copied for your AI"
      text="TypeError: lesson.sections is undefined"
      variant="danger"
    >
      Copy errors for your AI
    </CopyButton>
    <CopyButton text="lang_sk_9f2e7c1a" variant="secondary">
      Copy token
    </CopyButton>
  </div>
);
