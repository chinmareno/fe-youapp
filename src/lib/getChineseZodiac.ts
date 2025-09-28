import { lunarNewYears } from "./lunarNewYearsEnum";

const animals = [
  "Rat",
  "Ox",
  "Tiger",
  "Rabbit",
  "Dragon",
  "Snake",
  "Horse",
  "Goat",
  "Monkey",
  "Rooster",
  "Dog",
  "Pig",
];

export function getChineseZodiac(date: string | Date): string | null {
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  let year = d.getFullYear();

  const lunarNewYearStr = lunarNewYears[year];
  if (!lunarNewYearStr) return null;

  const lunarNewYear = new Date(lunarNewYearStr);

  if (d < lunarNewYear) year -= 1;

  const index = (year - 1900) % 12;
  return animals[index];
}
