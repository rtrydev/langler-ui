import { ScaleStrip } from "langler-ui";

export const JlptEstimate = () => (
  <ScaleStrip
    className="w-96"
    items={[
      { label: "N5", struck: true },
      { label: "N4", active: true },
      { label: "N3" },
      { label: "N2" },
      { label: "N1" },
    ]}
  />
);

export const CefrPlacement = () => (
  <ScaleStrip
    className="w-96"
    items={[
      { label: "A1", struck: true },
      { label: "A2", struck: true },
      { label: "B1", active: true },
      { label: "B2" },
      { label: "C1" },
      { label: "C2" },
    ]}
  />
);

export const Untested = () => (
  <ScaleStrip
    className="w-96"
    items={[
      { label: "A1" },
      { label: "A2" },
      { label: "B1" },
      { label: "B2" },
      { label: "C1" },
      { label: "C2" },
    ]}
  />
);
