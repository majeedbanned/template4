import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import prisma from "@/lib/prisma"

export async function POST(
  request: Request, 
) {
  const body = await request.json();
  const { 
    email,
    // name,
    password,
   } = body;

   const hashedPassword = await bcrypt.hash(password, 12);
//console.log(hashedPassword)
   const user = await prisma.user.create({
    data: {
      email,
    //   name,
      hashedPassword,
    }
  });

  return NextResponse.json({...user,
    id:user.id.toString()
});
}