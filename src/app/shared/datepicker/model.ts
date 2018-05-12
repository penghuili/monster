export enum DatepickerMode {
  Day,
  Week,
  Month
}
export interface DatepickerResult {
  mode: DatepickerMode;
  date: number;
}
