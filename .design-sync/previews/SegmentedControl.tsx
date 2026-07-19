import { SegmentedControl } from "langler-ui";

export const LessonLength = () => (
  <SegmentedControl
    name="length"
    defaultValue="standard"
    options={[
      { value: "short", label: "Short" },
      { value: "standard", label: "Standard" },
      { value: "deep", label: "Deep dive" },
    ]}
  />
);

export const Levels = () => (
  <SegmentedControl
    name="level"
    defaultValue="N4"
    options={[
      { value: "N5", label: "N5" },
      { value: "N4", label: "N4" },
      { value: "N3", label: "N3" },
      { value: "N2", label: "N2" },
      { value: "N1", label: "N1" },
    ]}
  />
);

export const NoSelection = () => (
  <SegmentedControl
    name="furigana"
    options={[
      { value: "always", label: "Always" },
      { value: "hover", label: "Hover" },
      { value: "off", label: "Off" },
    ]}
  />
);
