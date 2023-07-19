import { PrismaClient } from '@prisma-second-db'
declare global {
  var prisma1: PrismaClient | undefined
}

const client = globalThis.prisma1 || new PrismaClient()
if (process.env.NODE_ENV !== "production") globalThis.prisma1 = client

export default client






// import { PrismaClient } from "@prisma/client";

// declare global {
//   var prisma: PrismaClient | undefined;
// }

// const prisma = global.prisma || new PrismaClient();

// if (process.env.NODE_ENV === "development") global.prisma = prisma;

// export default prisma;


