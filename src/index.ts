import "dotenv/config";

import fastifySession from "@fastify/session";
import fastify, { FastifyReply, FastifyRequest } from "fastify";
import fastifyCookie from "fastify-cookie";
import fastifyCors from "fastify-cors";
import fastifySensible from "fastify-sensible";
import Redis from "ioredis";
import connectRedis from "connect-redis";

import {
  DEFAULT_CORS_ORIGIN,
  DEFAULT_PORT,
  DEFAULT_SECRET,
  DEFAULT_REDIS_URL,
} from "./constants";

import logout from "./routes/logout";
import me from "./routes/me";
import nonce from "./routes/nonce";
import verify from "./routes/verify";

const RedisStore = connectRedis(fastifySession as any);

const redisClient = new Redis(
  process.env.REDIS_URL || DEFAULT_REDIS_URL,
  process.env.NODE_ENV === "development"
    ? {}
    : {
        tls: { rejectUnauthorized: false },
      }
);

const app = fastify({
  logger: {
    prettyPrint:
      process.env.NODE_ENV === "development"
        ? {
            ignore: "pid,hostname",
            translateTime: "HH:MM:ss Z",
          }
        : false,
  },
});

app.register(fastifyCookie);

app.register(fastifySession, {
  cookie: {
    secure: process.env.NODE_ENV === "development" ? false : true,
  },
  cookieName: "PROJECT_NAME",
  secret: process.env.SECRET || DEFAULT_SECRET,
  store: new RedisStore({
    client: redisClient,
    url: process.env.REDIS_URL,
  }) as any,
});

app.register(fastifyCors, {
  credentials: true,
  origin: [
    process.env.CORS_ORIGIN || DEFAULT_CORS_ORIGIN,
    // VERCEL PREVIEW /project-web-[\w\d]{9}-project\.vercel\.app/,
  ],
});

app.register(fastifySensible);

app.post("/verify", verify);
app.get("/nonce", nonce);
app.get("/logout", logout);

app.get("/me", me);

app.get("/healthz", async (request: FastifyRequest, reply: FastifyReply) => {
  reply.send("OK");
});

const port = process.env.PORT || DEFAULT_PORT;

app.listen(port, "0.0.0.0", () => {
  console.log(`Server Running at ${port} 🚀`);
});
