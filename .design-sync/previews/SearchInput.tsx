import { SearchInput } from "langler-ui";

export const Default = () => (
  <div className="w-72">
    <SearchInput aria-label="Filter by tag" placeholder="Search tags…" />
  </div>
);

export const WithValue = () => (
  <div className="w-72">
    <SearchInput aria-label="Filter by tag" defaultValue="keigo" />
  </div>
);

export const Disabled = () => (
  <div className="w-72">
    <SearchInput disabled placeholder="Search lessons…" />
  </div>
);
