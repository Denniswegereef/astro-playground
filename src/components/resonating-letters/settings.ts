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

export const SETTINGS_REGULAR_LEFT: Settings = {
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
