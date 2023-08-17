import { server } from "./app";
import { env } from "./env";

const port = env.PORT;
server
  .listen({
    port,
  })
  .then(() => console.log("🚀 HTTP Server running"));
