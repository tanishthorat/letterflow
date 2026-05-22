import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface PasswordInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  errorAsPop?: boolean;
}

export function PasswordInput({
  label = "Password",
  placeholder = "Password",
  value,
  onChange,
  error,
  disabled = false,
  errorAsPop = false,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      {label && <Label htmlFor="password">{label}</Label>}
      <div className="relative">
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="bg-input dark:bg-input-dark border-border dark:border-border-dark"
          error={error}
          errorAsPop={errorAsPop}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full hover:bg-transparent"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4 text-muted" />
          ) : (
            <Eye className="w-4 h-4 text-muted" />
          )}
        </Button>
      </div>
      {error && !errorAsPop && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
