import { NextApiRequest, NextApiResponse } from "next";
import { UserProps } from "./types";
import { getServerSession } from "next-auth";
import prisma  from "@/lib/prisma";
export interface Session {
  user: {
    email: string;
    id: number;
    name: string;
  };
}
interface WithUsertNextApiHandler {
  (
    req: NextApiRequest,
    res: NextApiResponse,
    session: Session,
    user?: UserProps,
  ): any;
}

export async function getSession(req: NextApiRequest, res: NextApiResponse) {
  // @ts-ignore
  return (await getServerSession(req, res, authOptions)) as Session;
}
const withUserAuth =
  (
    handler: WithUsertNextApiHandler,
    {
      needUserDetails, // if the action needs the user's details
    }: {
      needUserDetails?: boolean;
    } = {},
  ) =>
  async (req: NextApiRequest, res: NextApiResponse) => {

    return res.status(401).end("Unauthorized: Login required.");


    // const session = await getSession(req, res);
    // if (!session?.user.id)
    //   return res.status(401).end("Unauthorized: Login required.");

    // if (req.method === "GET") return handler(req, res, session);

    // if (needUserDetails) {
    //   const user = (await prisma.user.findUnique({
    //     where: {
    //       id: session.user.id,
    //     },
    //     select: {
    //       id: true,
    //       name: true,
    //       email: true,
         
    //     },
    //   })) as UserProps;

    //   return handler(req, res, session, user);
    // }

    // return handler(req, res, session);
  };

export { withUserAuth };