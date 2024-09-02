"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { changeUserPassword } from "./actions"; // Import the server action

export default function ChangePassword({ user }: { user: any }): JSX.Element {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("رمز عبور جدید و تایید آن یکسان نیستند");
      return;
    }

    if (!newPassword) {
      setMessage("رمز عبور جدید نمی تواند خالی باشد");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const userId = "user-id-from-session";

      await changeUserPassword(userId, currentPassword, newPassword, user);
      setMessage("رمز عبور با موفقیت تغییر کرد");
      setLoading(false);
      // router.push("/profile"); // Optionally navigate to profile after success
    } catch (error: any) {
      setMessage(error.message || "خطایی رخ داده است");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">تغییر رمز عبور</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">رمز عبور فعلی</label>
        <Input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full"
          disabled={loading}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">رمز عبور جدید</label>
        <Input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full"
          disabled={loading}
        />
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          تایید رمز عبور جدید
        </label>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full"
          disabled={loading}
        />
      </div>
      <Button
        className="w-full"
        variant={"default"}
        onClick={handleChangePassword}
        disabled={loading}
      >
        {loading ? "در حال تغییر..." : "تغییر رمز عبور"}
      </Button>
      {message && (
        <p className="mt-4 text-center text-sm text-red-600">{message}</p>
      )}
    </div>
  );
}
