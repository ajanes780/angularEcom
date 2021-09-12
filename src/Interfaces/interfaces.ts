export class HttpException extends Error {
  public status: number;
  public message: string;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
  errorMessage() {
    return { status: `${this.status}`, message: `${this.message}` };
  }
}


export class OrderItemClass {
  quantity: string;
  product: string;
}