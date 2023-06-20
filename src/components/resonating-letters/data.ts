export const POSSIBLE_LOWERCASE_OPTIONS = [
  "a",
  "á",
  "à",
  "ä",
  "â",
  "e",
  "é",
  "è",
  "ë",
  "ê",
  "i",
  "í",
  "ì",
  "ï",
  "î",
  "o",
  "ó",
  "ò",
  "ö",
  "ô",
  "u",
  "ú",
  "ù",
  "ü",
  "û",
  "b",
  "c",
  "d",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  "m",
  "n",
  "p",
  "q",
  "r",
  "s",
  "t",
  "v",
  "w",
  "x",
  "y",
  "z",
];

interface Settings {
  slices: {
    margin: number;
    clipPath?: string;
  }[];
}

export const SETTINGS_REGULAR_RIGHT: Settings = {
  slices: [
    {
      margin: 0,
      clipPath: "polygon(-50% -50%, 50% 0%, 30% 100%, 0% 100%)",
    },
    {
      margin: 13,
      clipPath: "polygon(40% 0%, 50% 0%, 65% 100%, 20% 100%)",
    },
    {
      margin: 55,
      clipPath: "polygon(10% 0%, 100% 0%, 100% 100%, 25% 100%)",
    },
  ],
};
