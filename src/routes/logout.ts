import { FastifyReply, FastifyRequest } from "fastify";
import { COOKIE_NAME } from "../constants";

const logout = (
  { session, sessionStore, server }: FastifyRequest,
  reply: FastifyReply
) => {
  if (session.siwe) {
    reply.removeHeader("set-cookie");
    reply.clearCookie(COOKIE_NAME);

    sessionStore.destroy(session.sessionId, (err) => {
      if (err) {
        throw server.httpErrors.internalServerError();
      }

      session.siwe = null;

      reply.send(true);
    });
  } else {
    reply.send(true);
  }
};

export default logout;
