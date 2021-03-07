export default class ServerError extends Error {
  private status: Status;

  constructor(status: Status, message: string) {
    super(message);
    this.status = status;
  }

  getStatus() {
    return this.status;
  }
}

type Status = 400| 404 | 500 | 401 | 404 | 409;
