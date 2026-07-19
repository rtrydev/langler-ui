import { parseNgramModel, type NgramModel } from "@/lib/burmese/segmenter";

export async function loadBurmeseSegmenter(url: string): Promise<NgramModel> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Burmese segmentation data returned ${response.status}.`);
  return parseNgramModel(await response.json());
}
