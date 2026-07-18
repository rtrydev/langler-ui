import { Suspense } from "react";
import { PrintableWorksheet } from "./_components/PrintableWorksheet";

export default function PrintLessonPage() {
  return <Suspense fallback={<p>Preparing worksheet…</p>}><PrintableWorksheet /></Suspense>;
}
