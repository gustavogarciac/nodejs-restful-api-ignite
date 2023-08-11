import fastify from "fastify";
import "dotenv/config.js";
import { knex } from "./database";

const server = fastify();

server.get("/hello", async (req, res) => {
  const tables = await knex("sqlite_schema").select("*");
  return tables;
});

const port = Number(process.env.PORT) || 3333;
server
  .listen({
    port,
  })
  .then(() => console.log("🚀 HTTP Server running"));
