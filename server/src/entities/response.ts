enum Code {
  Ok = 200,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  InternalServerError = 500,
}

class Response {
  public static Code = Code;
  public httpCode: Code;
  public payload: string | object;
  public code: number;
  constructor(httpCode: Code, payload: string | object = '', code: number = 0) {
    this.httpCode = httpCode;
    this.payload = payload;
    this.code = code;
  }

  public serialize() {
    if (typeof this.payload === 'string') {
      return { message: this.payload, code: this.code };
    } else {
      return { ...this.payload, code: this.code };
    }
  }
}

export { Response, Code as ResponseCode };
