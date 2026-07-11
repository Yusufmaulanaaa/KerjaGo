// ============================================================================
// Custom Error — Bad Request (400)
// ============================================================================

export class BadRequestError extends Error {
  public statusCode: number = 400;

  constructor(message: string) {
    super(message);
    this.name = 'BadRequestError';
  }
}

// ============================================================================
// Custom Error — Not Found (404)
// ============================================================================

export class NotFoundError extends Error {
  public statusCode: number = 404;

  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}
