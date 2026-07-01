"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { authApi } from "@/modules/auth/auth.api";
import type { AuthFormData } from "@/modules/auth/auth.types";
import { validateAuthForm } from "@/modules/auth/auth.validators";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [errors, setErrors] = useState<Partial<Record<keyof AuthFormData, string>>>({});
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState<AuthFormData>({ email: "", password: "" });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateAuthForm(form);
    setErrors(nextErrors);
    setSubmitError("");

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      const user = await authApi.login(form);
      login(user);
      router.push("/dashboard");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "No se pudo iniciar sesion.");
    }
  }

  return (
    <div className="page-shell flex justify-center">
      <Card className="w-full max-w-md space-y-6">
        <div className="space-y-2">
          <h1 className="section-title text-3xl font-semibold text-slate-950">Iniciar sesion</h1>
          <p className="text-sm text-slate-600">Accede al dashboard del cliente y a tus licencias.</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {submitError ? <p className="text-sm text-red-600">{submitError}</p> : null}
          <div className="space-y-2">
            <Input onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="Correo" type="email" value={form.email} />
            {errors.email ? <p className="text-xs text-red-600">{errors.email}</p> : null}
          </div>
          <div className="space-y-2">
            <Input onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Contrasena" type="password" value={form.password} />
            {errors.password ? <p className="text-xs text-red-600">{errors.password}</p> : null}
          </div>
          <Button className="w-full" type="submit">
            Entrar
          </Button>
        </form>
        <p className="text-sm text-slate-600">
          No tienes cuenta? <Link className="font-medium text-cyan-700" href="/registro">Registrate</Link>
        </p>
      </Card>
    </div>
  );
}
