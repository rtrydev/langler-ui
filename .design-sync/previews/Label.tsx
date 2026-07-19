import { Input, Label, Select } from "langler-ui";

export const WithInput = () => (
  <div className="w-72">
    <Label htmlFor="topic">Topic</Label>
    <Input id="topic" placeholder="e.g. Ordering food at an izakaya" />
  </div>
);

export const WithSelect = () => (
  <div className="w-72">
    <Label htmlFor="token-expiry">Expires</Label>
    <Select className="w-full" id="token-expiry" defaultValue="30d">
      <option value="7d">7 days</option>
      <option value="30d">30 days</option>
      <option value="90d">90 days</option>
    </Select>
  </div>
);

export const WizardSection = () => (
  <div className="w-72">
    <Label className="mb-2.5 block text-[13px] font-semibold">
      Level
      <span className="ml-2 font-normal text-ink-3">from your placement</span>
    </Label>
    <p className="text-sm text-ink-2">A2 · Elementary Polish</p>
  </div>
);
