import { DrawingPad } from "langler-ui";

export const WithTracingGuide = () => (
  <div className="w-72">
    <DrawingPad guide="水" />
  </div>
);

export const TracePairThenFreehand = () => (
  <div className="grid w-96 grid-cols-2 gap-3">
    <DrawingPad guide="永" />
    <DrawingPad />
  </div>
);

export const BurmeseGuide = () => (
  <div className="w-72">
    <DrawingPad guide="က" />
  </div>
);
