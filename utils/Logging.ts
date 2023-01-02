export class Logger {
  constructor(public message: string) {
    const error = new Error(message);
    console.log(error);
  }
}
