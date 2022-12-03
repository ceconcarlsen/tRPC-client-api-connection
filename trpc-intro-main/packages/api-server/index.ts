import express from "express";
import * as trpc from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import { z } from "zod";

const port = 8080;
const app = express();
app.use(cors());

interface ChatMessage {
  user: string;
  message: string;
}

const messages: ChatMessage[] = [
  { user: "user 1", message: "hello" },
  { user: "user 2", message: "Hi" },
];

const AppRouter = trpc
  .router()
  .query("hello", {
    resolve() {
      return "Hello World II";
    },
  })
  .query("getMessages", {
    input: z.number().default(10),
    resolve({ input }) {
      return messages.slice(-input); //get last 10 messages by default (defined by zod)
    },
  })
  .mutation("addMessage", {
    input: z.object({
      user: z.string(),
      message: z.string(),
    }),
    resolve({ input }) {
      messages.push(input);
      return input;
    },
  });

export type AppRouter = typeof AppRouter; //exposing types to client (react-app)

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: AppRouter,
    createContext: () => null, //could be used to auth from header info
  })
);

app.listen(port, () => {
  console.log(`api-server listening at http://localhost:${port}`);
});
