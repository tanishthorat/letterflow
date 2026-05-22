import { useState } from "react";

interface UseAuthFormReturn {
  name: string;
  email: string;
  password: string;
  setName: (value: string) => void;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  error: string;
  emailError: string;
  passwordError: string;
  setError: (value: string) => void;
  setEmailError: (value: string) => void;
  setPasswordError: (value: string) => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
  clearError: () => void;
}

export function useAuthForm(): UseAuthFormReturn {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const clearError = () => setError("");

  const setEmailErrorWrapper = (value: string) => setEmailError(value);
  const setPasswordErrorWrapper = (value: string) => setPasswordError(value);

  return {
    name,
    email,
    password,
    setName,
    setEmail,
    setPassword,
    error,
    emailError,
    passwordError,
    setError,
    setEmailError: setEmailErrorWrapper,
    setPasswordError: setPasswordErrorWrapper,
    loading,
    setLoading,
    clearError,
  };
}
