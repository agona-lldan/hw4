// This enables module augmentation mode.
import "date-wizard";

declare module "date-wizard" {
  interface DateDetails {
    minutes: number;
    seconds: number;
    hours: number;
    year: number;
    month: number;
    date: number;
  }
  function pad(s: number): string;
}
