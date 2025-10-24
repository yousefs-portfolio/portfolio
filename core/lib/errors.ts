export type ErrorCode = 'BAD_REQUEST' | 'NOT_FOUND' | 'UNAUTHORIZED';

export class UseCaseError extends Error {
  constructor(public readonly code: ErrorCode, message: string) {
    super(message);
  }
}
