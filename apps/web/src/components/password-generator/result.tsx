"use client";

import { Button, Input } from "@package/ui";
import { useCallback } from "react";

interface PasswordResultProps {
  password: string;
}

export function PasswordResult({ password }: PasswordResultProps) {
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(password);
    } catch (error) {
      console.error("Failed to copy password:", error);
    }
  }, [password]);

  return (
    <div className="space-y-4">
      <Input
        type="text"
        value={password}
        readOnly
        className="font-mono"
      />
      
      <Button 
        variant="secondary"
        className="w-full"
        onClick={handleCopy}
      >
        クリップボードにコピー
      </Button>
    </div>
  );
}