import fastify from "fastify";
import "dotenv/config.js";
import { knex } from "./database";
import { randomUUID } from "node:crypto";

const server = fastify();

server.get("/hello", async (req, res) => {
  const transactions = await knex("transactions")
    .where("amount", 1000)
    .select("*");

  return transactions;
});

const port = Number(process.env.PORT) || 3333;
server
  .listen({
    port,
  })
  .then(() => console.log("🚀 HTTP Server running"));
