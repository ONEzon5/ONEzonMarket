import "express-session";

declare module "express-session" {
  interface SessionData {
    user?: {
      id: string;
      username: string;
    };
  }
}

declare global {
  namespace Express {
    interface Request {
      sessionID: string;
    }
  }
}

export {};