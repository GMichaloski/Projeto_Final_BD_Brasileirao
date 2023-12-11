import Fastify from "fastify";
import routes from "./routes.js";

const fastify = Fastify({
  logger: true,
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
