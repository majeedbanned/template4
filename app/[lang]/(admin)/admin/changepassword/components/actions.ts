// /app/changepassword/actions.ts
"use server";
import client from "@/lib/prismadb1";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export async function changeUserPassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
  user: any
): Promise<string> {
  
  //console.log(user)

  // Find the user by ID
  const user1 = await client.store.findUnique({
    where: {
      id: Number(user.user.id),
    },
  });

  if (!user1) {
    throw new Error("User not found");
  }

  // Compare the current password with the stored password
  if (currentPassword !== user1.password) {
    throw new Error("Current password is incorrect");
  }

  // Ensure the new password is not empty
  if (!newPassword) {
    throw new Error("New password cannot be empty");
  }

  // Update the user's password in the database (no hashing)
  await client.store.update({
    where: {
      id: Number(user.user.id),
    },
    data: {
      password: newPassword, // Directly updating the new password
    },
  });

  return "Password updated successfully";
}
