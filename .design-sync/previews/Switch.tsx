import { Switch } from "langler-ui";

export const States = () => (
  <div className="flex flex-col gap-3">
    <Switch>Include answer key</Switch>
    <Switch defaultChecked>Furigana</Switch>
    <Switch disabled>Trace guide</Switch>
    <Switch disabled defaultChecked>
      Include reference sheet
    </Switch>
  </div>
);

export const Bare = () => (
  <div className="flex items-center gap-3">
    <Switch aria-label="Show readings" />
    <Switch aria-label="Show readings" defaultChecked />
  </div>
);
