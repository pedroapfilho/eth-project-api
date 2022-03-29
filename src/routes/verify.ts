import { FastifyReply, FastifyRequest } from "fastify";
import { SiweMessage } from "siwe";

const verify = async (
  {
    body,
    session,
  }: FastifyRequest<{ Body: { message: string; signature: string } }>,
  reply: FastifyReply
) => {
  const siweMessage = new SiweMessage(body.message);

  try {
    const fields = await siweMessage.validate(body.signature);

    // This acts like a login/signup flow, so if the user doesn't already
    // exists, we create a new one.
    //
    // const user = await db.user.findFirst({
    //   where: {
    //     address: fields.address,
    //   },
    // });

    // if (!user) {
    //   await db.user.create({
    //     data: {
    //       address: fields.address,
    //     },
    //   });
    // }

    session.siwe = fields;

    reply.send(true);
  } catch {
    reply.send(false);
  }
};

export default verify;
