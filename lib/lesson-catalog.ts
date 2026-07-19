export type LanguageCode = "ja" | "my" | "pl";

export type LanguageTone = "vermilion" | "gold" | "crimson";

export type LanguageOption = {
  code: LanguageCode;
  nativeName: string;
  englishName: string;
  tone: LanguageTone;
  levelSystem: "JLPT" | "CEFR";
  levels: string[];
};

export const LANGUAGES: LanguageOption[] = [
  {
    code: "ja",
    nativeName: "日本語",
    englishName: "Japanese",
    tone: "vermilion",
    levelSystem: "JLPT",
    levels: ["N5", "N4", "N3", "N2", "N1"],
  },
  {
    code: "my",
    nativeName: "မြန်မာ",
    englishName: "Burmese",
    tone: "gold",
    levelSystem: "CEFR",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
  },
  {
    code: "pl",
    nativeName: "Polski",
    englishName: "Polish",
    tone: "crimson",
    levelSystem: "CEFR",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
  },
];

export function languageOption(code: string): LanguageOption | undefined {
  return LANGUAGES.find((language) => language.code === code);
}

export function levelLabel(code: string, level: string): string {
  const option = languageOption(code);
  return option ? `${option.levelSystem} ${level}` : level;
}

const LEVEL_DESCRIPTORS: Record<string, string> = {
  N5: "beginner",
  N4: "upper-beginner",
  N3: "intermediate",
  N2: "upper-intermediate",
  N1: "advanced",
  A1: "beginner",
  A2: "elementary",
  B1: "intermediate",
  B2: "upper-intermediate",
  C1: "advanced",
  C2: "proficient",
};

export function levelDescriptor(level: string): string {
  return LEVEL_DESCRIPTORS[level] ?? "";
}

export type ExerciseTypeCode =
  | "cloze"
  | "translation"
  | "ordering"
  | "matching"
  | "multiple_choice"
  | "reading"
  | "writing_prompt"
  | "script_practice";

export type ExerciseTypeOption = {
  code: ExerciseTypeCode;
  label: string;
  grading: "auto" | "self";
};

export const EXERCISE_TYPES: ExerciseTypeOption[] = [
  { code: "multiple_choice", label: "Multiple choice", grading: "auto" },
  { code: "matching", label: "Matching", grading: "auto" },
  { code: "cloze", label: "Cloze", grading: "auto" },
  { code: "ordering", label: "Ordering", grading: "auto" },
  { code: "reading", label: "Reading", grading: "auto" },
  { code: "script_practice", label: "Script practice", grading: "self" },
  { code: "translation", label: "Translation", grading: "self" },
  { code: "writing_prompt", label: "Writing prompt", grading: "self" },
];

export function exerciseTypeLabel(code: string): string {
  return EXERCISE_TYPES.find((type) => type.code === code)?.label ?? code;
}

export const LESSON_LENGTHS = [
  { code: "short", label: "Short" },
  { code: "standard", label: "Standard" },
  { code: "long", label: "Long" },
] as const;

export type LessonLengthCode = (typeof LESSON_LENGTHS)[number]["code"];
