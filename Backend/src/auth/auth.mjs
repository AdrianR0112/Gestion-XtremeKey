import { betterAuth } from "better-auth";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import mysql from "mysql2/promise";

import envModule from "../config/env.js";
import authOptionsModule from "./options.js";

const { env } = envModule;
const { createBetterAuthOptions } = authOptionsModule;

const authPool = mysql.createPool({
  host: env.mysqlHost,
  port: env.mysqlPort,
  user: env.mysqlUser,
  password: env.mysqlPassword,
  database: env.mysqlDatabase,
  timezone: "Z",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const auth = betterAuth(createBetterAuthOptions(authPool));

export const authHandler = toNodeHandler(auth);

export async function getSessionFromRequest(req) {
  return auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
}
