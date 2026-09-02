import '@fastify/secure-session';

declare module '@fastify/secure-session' {
  interface SessionData {
    sessionId: string;
    // Add any other properties to store in req.session
  }
}