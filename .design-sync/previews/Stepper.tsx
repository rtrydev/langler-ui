import { Stepper } from "langler-ui";

const steps = ["Parameters", "Prompt", "Import"];

export const FirstStep = () => (
  <Stepper className="w-[480px]" current={0} steps={steps} />
);

export const MidWizard = () => (
  <Stepper
    className="w-[480px]"
    current={1}
    onStepSelect={() => undefined}
    steps={steps}
  />
);

export const LastStep = () => (
  <Stepper
    className="w-[480px]"
    current={2}
    onStepSelect={() => undefined}
    steps={steps}
  />
);
