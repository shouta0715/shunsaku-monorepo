"use client";

import { Button, Checkbox, Fieldset, Input } from "@package/ui";
import { useCallback, useState } from "react";
import type { PasswordOptions } from "../../lib/password";

interface PasswordGeneratorFormProps {
  onGenerate: (options: PasswordOptions) => void;
}

export function PasswordGeneratorForm({ onGenerate }: PasswordGeneratorFormProps) {
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    useUppercase: true,
    useLowercase: true,
    useNumbers: true,
    useSymbols: true,
  });

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(options);
  }, [onGenerate, options]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        type="number"
        label="パスワードの長さ"
        min={8}
        max={32}
        value={options.length}
        onChange={(e) => setOptions(prev => ({
          ...prev,
          length: parseInt(e.target.value, 10)
        }))}
      />
      
      <Fieldset legend="文字種の選択">
        <div className="space-y-4">
          <Checkbox 
            label="大文字 (A-Z)"
            checked={options.useUppercase}
            onChange={(e) => setOptions(prev => ({
              ...prev,
              useUppercase: e.target.checked
            }))}
          />
          <Checkbox 
            label="小文字 (a-z)"
            checked={options.useLowercase}
            onChange={(e) => setOptions(prev => ({
              ...prev,
              useLowercase: e.target.checked
            }))}
          />
          <Checkbox 
            label="数字 (0-9)"
            checked={options.useNumbers}
            onChange={(e) => setOptions(prev => ({
              ...prev,
              useNumbers: e.target.checked
            }))}
          />
          <Checkbox 
            label="記号 (!@#$%^&*())"
            checked={options.useSymbols}
            onChange={(e) => setOptions(prev => ({
              ...prev,
              useSymbols: e.target.checked
            }))}
          />
        </div>
      </Fieldset>
      
      <Button type="submit" variant="primary" className="w-full">
        パスワードを生成
      </Button>
    </form>
  );
}