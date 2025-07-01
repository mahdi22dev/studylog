import { PrismaD1HTTP } from "@prisma/adapter-d1";
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

type Env = {
  CLOUDFLARE_D1_TOKEN: string;
  CLOUDFLARE_ACCOUNT_ID: string;
  CLOUDFLARE_DATABASE_ID: string;
};

const adapter = new PrismaD1HTTP({
  CLOUDFLARE_D1_TOKEN: process.env.CLOUDFLARE_D1_TOKEN || "",
  CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID || "",
  CLOUDFLARE_DATABASE_ID: process.env.CLOUDFLARE_DATABASE_ID || "",
});
const prisma = new PrismaClient({ adapter });
export default prisma;
