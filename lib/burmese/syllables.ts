export function segmentBurmeseSyllables(value: string): string[] {
  const characters = Array.from(value);
  if (characters.length === 0) return [];
  const breaks = [0];
  for (let index = 1; index < characters.length; index += 1) {
    const current = characters[index].codePointAt(0)!;
    const previous = characters[index - 1].codePointAt(0)!;
    const next = characters[index + 1]?.codePointAt(0);
    if (isConsonant(current)) {
      if (previous === 0x1039 || next === 0x103a) continue;
      breaks.push(index);
    } else if (isInitial(current)) {
      breaks.push(index);
    } else if (!isAttached(current)) {
      breaks.push(index);
      if (index + 1 < characters.length) breaks.push(index + 1);
    }
  }
  breaks.push(characters.length);
  return [...new Set(breaks)].sort((left, right) => left - right).flatMap((start, index, all) => {
    const end = all[index + 1];
    return end === undefined || start === end ? [] : [characters.slice(start, end).join("")];
  });
}

function isConsonant(value: number): boolean {
  return value >= 0x1000 && value <= 0x1021;
}

function isAttached(value: number): boolean {
  return value >= 0x102b && value <= 0x103e || value >= 0x1056 && value <= 0x1059 || value >= 0x105e && value <= 0x1060 || value >= 0x1062 && value <= 0x1064 || value >= 0x1067 && value <= 0x106d || value >= 0x1071 && value <= 0x1074 || value >= 0x1082 && value <= 0x108d || value === 0x108f || value >= 0x109a && value <= 0x109d;
}

function isInitial(value: number): boolean {
  return value >= 0x1023 && value <= 0x102a || value >= 0x1040 && value <= 0x1055 || value >= 0x105a && value <= 0x105d || value === 0x1061 || value >= 0x1065 && value <= 0x1070 || value >= 0x1075 && value <= 0x1081 || value === 0x108e || value >= 0x1090 && value <= 0x1099 || value >= 0x109e && value <= 0x109f;
}
