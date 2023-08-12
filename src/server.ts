import fastify from "fastify";
import { knex } from "./database";
import { randomUUID } from "node:crypto";
import { env } from "./env";

const server = fastify();

server.get("/hello", async (req, res) => {
  const transactions = await knex("transactions")
    .where("amount", 1000)
    .select("*");

  return transactions;
});

const port = env.PORT;
server
  .listen({
    port,
  })
  .then(() => console.log("🚀 HTTP Server running"));
