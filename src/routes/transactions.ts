import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";
import { randomUUID } from "crypto";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";

export async function transactionsRoutes(server: FastifyInstance) {
  // server.addHook("preHandler", async (req, reply) => {
  //   console.log(`[${req.method}], ${req.url}`);
  // });

  server.get(
    "/",
    {
      preHandler: [checkSessionIdExists],
    },
    async (req, res) => {
      const { sessionId } = req.cookies;

      const transactions = await knex("transactions")
        .where({ session_id: sessionId })
        .select();
      return res.send({ transactions });
    }
  );
  server.get(
    "/:id",
    {
      preHandler: checkSessionIdExists,
    },
    async (req, res) => {
      const getTransactionParamsSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = getTransactionParamsSchema.parse(req.params);
      const { sessionId } = req.cookies;

      const transaction = await knex("transactions")
        .where({ id, session_id: sessionId })
        .first();
      return res.send({ transaction });
    }
  );
  server.get(
    "/summary",
    { preHandler: checkSessionIdExists },
    async (req, res) => {
      const { sessionId } = req.cookies;
      const summary = await knex("transactions")
        .where({ session_id: sessionId })
        .sum("amount", { as: "amount" })
        .first();

      return res.send({ summary });
    }
  );
  server.post("/", async (req, res) => {
    const createTransactionsBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(["credit", "debit"]),
    });

    const { title, amount, type } = createTransactionsBodySchema.parse(
      req.body
    ); // O parse dispara erro automático

    let sessionId = req.cookies.sessionId;

    if (!sessionId) {
      sessionId = randomUUID();
      res.cookie("sessionId", sessionId, {
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      });
    }

    await knex("transactions").insert({
      id: randomUUID(),
      title,
      amount: type === "credit" ? amount : amount * -1,
      session_id: sessionId,
    });

    return res.status(201).send();
  });
}
