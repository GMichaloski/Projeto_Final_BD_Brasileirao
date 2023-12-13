import Fastify from "fastify";
import routes from "./routes.js";
import cors from "@fastify/cors";

const fastify = Fastify({
  logger: true,
});

await fastify.register(cors, {
  origin: "*",
});

routes.forEach((route) => {
  fastify.route(route);
});

try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
