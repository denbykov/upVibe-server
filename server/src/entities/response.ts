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
  public payload: object;
  public code?: number;

  constructor(httpCode: Code, payload: object = {}, code?: number) {
    this.httpCode = httpCode;
    this.payload = payload;
    this.code = code;
  }
}

export { Response };
