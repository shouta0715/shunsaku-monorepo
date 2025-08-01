"use client";

import { StackedLayout } from "@package/ui";
import { useState } from "react";
import { PasswordGeneratorForm } from "../components/password-generator/form";
import { PasswordResult } from "../components/password-generator/result";
import { generatePassword } from "../lib/password";

export default function Home() {
  const [password, setPassword] = useState("");

  return (
    <StackedLayout>
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <h1 className="text-2xl font-bold text-center">
            パスワードジェネレーター
          </h1>
          <PasswordGeneratorForm 
            onGenerate={(options) => {
              const newPassword = generatePassword(options);
              setPassword(newPassword);
            }}
          />
          {password && <PasswordResult password={password} />}
        </div>
      </main>
    </StackedLayout>
  );
}