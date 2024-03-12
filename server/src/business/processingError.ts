export class ProcessingErrorCode {
  static readonly GENERIC_ERROR = -1;
}

export class ProcessingError extends Error {
  errorCode: number;
  constructor(
    message: string,
    errorCode: number = ProcessingErrorCode.GENERIC_ERROR
  ) {
    super(message);
    this.errorCode = errorCode;
    this.name = 'ProcessingError';
  }
}
