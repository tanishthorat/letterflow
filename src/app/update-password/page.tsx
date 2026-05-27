import { Suspense } from "react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { UpdatePasswordForm } from "@/components/auth/update-password-form";

export const metadata = {
  title: "Update Password | Letterflow",
  description: "Update your Letterflow password",
};

export default function UpdatePasswordPage() {
  return (
    <AuthLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <UpdatePasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
