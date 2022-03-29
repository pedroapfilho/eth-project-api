import { SiweMessage } from "siwe";

declare module "fastify" {
  interface Session {
    siwe?: SiweMessage | null;
  }
}
