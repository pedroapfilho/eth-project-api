import { FastifyReply, FastifyRequest } from "fastify";
import { generateNonce } from "siwe";

const nonce = async (request: FastifyRequest, reply: FastifyReply) => {
  const nonce = generateNonce();

  reply.send(nonce);
};

export default nonce;
