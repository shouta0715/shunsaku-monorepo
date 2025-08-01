export interface PasswordOptions {
  length: number;
  useUppercase: boolean;
  useLowercase: boolean;
  useNumbers: boolean;
  useSymbols: boolean;
}

const UPPERCASE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE_CHARS = "abcdefghijklmnopqrstuvwxyz";
const NUMBER_CHARS = "0123456789";
const SYMBOL_CHARS = "!@#$%^&*()";

export function validateOptions(options: PasswordOptions): boolean {
  if (options.length < 8 || options.length > 32) return false;
  
  return (
    options.useUppercase ||
    options.useLowercase ||
    options.useNumbers ||
    options.useSymbols
  );
}

export function generatePassword(options: PasswordOptions): string {
  if (!validateOptions(options)) {
    throw new Error("Invalid password options");
  }

  let chars = "";
  if (options.useUppercase) chars += UPPERCASE_CHARS;
  if (options.useLowercase) chars += LOWERCASE_CHARS;
  if (options.useNumbers) chars += NUMBER_CHARS;
  if (options.useSymbols) chars += SYMBOL_CHARS;

  let password = "";
  const array = new Uint32Array(options.length);
  crypto.getRandomValues(array);
  
  for (let i = 0; i < options.length; i++) {
    password += chars[array[i] % chars.length];
  }

  return password;
}