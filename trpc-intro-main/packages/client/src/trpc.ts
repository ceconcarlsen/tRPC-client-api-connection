import { createReactQueryHooks } from "@trpc/react";
import { AppRouter } from "api-server"; //AppRouter exposed from my api-server

export const trpc = createReactQueryHooks<AppRouter>();
