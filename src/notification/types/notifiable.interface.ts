export interface INotifiable {
  toMail?(): void;
  toFirebase?(): void;
}
