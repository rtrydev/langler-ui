import { Ruby } from "langler-ui";

export const Furigana = () => (
  <p className="font-jp text-3xl text-ink">
    <Ruby reading="みず">水</Ruby>を<Ruby reading="の">飲</Ruby>みます
  </p>
);

export const Romanization = () => (
  <div className="flex flex-col gap-3">
    <p className="font-jp text-2xl text-ink">
      <Ruby reading="tōkyō">東京</Ruby>に<Ruby reading="i">行</Ruby>きたいです
    </p>
    <p className="font-myanmar text-2xl text-ink">
      <Ruby reading="ye">ရေ</Ruby> <Ruby reading="thauk">သောက်</Ruby>
    </p>
  </div>
);

export const InSentenceCopy = () => (
  <p className="max-w-md text-sm leading-loose text-ink-2">
    In the story, the waiter asks{" "}
    <span className="font-jp text-base text-ink">
      <Ruby reading="なに">何</Ruby>に<Ruby reading="し">し</Ruby>ますか
    </span>{" "}
    — “what will you have?”
  </p>
);
