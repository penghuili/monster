export enum Color {
  Primary,
  Accent,
  Grey,
  LightGrey,
  White,
  Error,
  Purple,
  Yellow
}
export const COLORS = {
  PRIMARY: '#000',
  WHITE: 'white',
  ACCENT: '#3ea9f5',
  GREEN: '#4CAF50',
  PURPLE: '#846ee5',
  YELLOW: '#f0c000',
  GREY: '#c7c7c7',
  GREY_LIGHT: '#f2f2f2',
  ERROR: 'red'
};

export function isColorWrong(color: string): boolean {
  const colors = ['primary', 'accent', 'green', 'purple', 'yellow', 'grey', 'white', 'error'];
  return color && !colors.find(a => a === color);
}
