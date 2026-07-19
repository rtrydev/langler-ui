import { GlyphTile } from "langler-ui";

export const Basic = () => (
  <div className="flex items-start gap-3">
    <GlyphTile className="w-24 font-jp-serif text-5xl">水</GlyphTile>
    <GlyphTile className="w-24 font-jp-serif text-5xl" selected>
      火
    </GlyphTile>
    <GlyphTile className="w-24 font-myanmar text-5xl">က</GlyphTile>
  </div>
);

export const WritingPractice = () => (
  <div className="flex items-start gap-3">
    <GlyphTile guides className="w-24 font-jp-serif text-6xl">
      永
    </GlyphTile>
    <GlyphTile guides ghost className="w-24 font-jp-serif text-6xl">
      永
    </GlyphTile>
    <GlyphTile guides dashed className="w-24 font-jp-serif text-6xl" />
  </div>
);

export const StrokeOrder = () => (
  <div className="flex items-start gap-2">
    <GlyphTile index={1} className="w-16 font-jp-serif text-3xl">
      一
    </GlyphTile>
    <GlyphTile index={2} className="w-16 font-jp-serif text-3xl">
      二
    </GlyphTile>
    <GlyphTile index={3} className="w-16 font-jp-serif text-3xl">
      三
    </GlyphTile>
  </div>
);
