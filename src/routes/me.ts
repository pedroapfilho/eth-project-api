import { FastifyReply, FastifyRequest } from "fastify";

const me = async ({ session, server }: FastifyRequest, reply: FastifyReply) => {
  if (!session.siwe) {
    throw server.httpErrors.unauthorized();
  }

  const { address } = session.siwe;

  // Here you check if the user has that address and if it's valid.
  //
  // const user = await db.user.findFirst({
  //   where: { address },
  // });

  // if (!user) {
  //   throw fastify.httpErrors.notFound();
  // }

  reply.send({ address });
};

export default me;
