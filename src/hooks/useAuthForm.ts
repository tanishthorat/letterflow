import { useState } from "react";

interface UseAuthFormReturn {
  email: string;
  password: string;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  error: string;
  setError: (value: string) => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
  clearError: () => void;
}

export function useAuthForm(): UseAuthFormReturn {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const clearError = () => setError("");

  return {
    email,
    password,
    setEmail,
    setPassword,
    error,
    setError,
    loading,
    setLoading,
    clearError,
  };
}
