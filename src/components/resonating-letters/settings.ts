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
      clipPath: "polygon(0% 0%, 40% 0%, 40% 100%, 0% 100%)",
    },
    {
      margin: 10,
      clipPath: "polygon(40% 0%, 75% 0%, 85% 100%, 30% 100%)",
    },
    {
      margin: 30,
      clipPath: "polygon(65% 0%, 100% 0%, 100% 100%, 75% 100%)",
    },
  ],
};

export const SETTINGS_REGULAR_LEFT: Settings = {
  slices: [
    {
      margin: 0,
      clipPath: "polygon(-50% -50%, 50% 0%, 30% 100%, 0% 100%)",
    },
    {
      margin: 10,
      clipPath: "polygon(40% 0%, 50% 0%, 65% 100%, 20% 100%)",
    },
    {
      margin: 45,
      clipPath: "polygon(10% 0%, 100% 0%, 100% 100%, 25% 100%)",
    },
  ],
};
