import { Select } from "langler-ui";

export const Filters = () => (
  <div className="flex flex-wrap gap-3">
    <Select aria-label="Filter by level" defaultValue="N4">
      <option value="">All levels</option>
      <option value="N5">N5</option>
      <option value="N4">N4</option>
      <option value="N3">N3</option>
      <option value="N2">N2</option>
      <option value="N1">N1</option>
    </Select>
    <Select aria-label="Filter by topic" defaultValue="">
      <option value="">All topics</option>
      <option value="travel">Travel</option>
      <option value="food">Food & dining</option>
      <option value="work">Work & office</option>
    </Select>
  </div>
);

export const FullWidth = () => (
  <div className="w-72">
    <Select className="w-full" defaultValue="30d">
      <option value="7d">7 days</option>
      <option value="30d">30 days</option>
      <option value="90d">90 days</option>
      <option value="never">Never expires</option>
    </Select>
  </div>
);

export const Disabled = () => (
  <Select disabled defaultValue="pl">
    <option value="pl">Polish</option>
  </Select>
);
