export interface AuthenticatedRequest extends Request {
    user: {
      email: string;
      sub: string;
    };
}
