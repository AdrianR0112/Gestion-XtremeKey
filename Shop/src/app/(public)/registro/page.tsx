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

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [errors, setErrors] = useState<Partial<Record<keyof AuthFormData, string>>>({});
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState<AuthFormData>({ name: "", email: "", password: "" });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateAuthForm(form, true);
    setErrors(nextErrors);
    setSubmitError("");

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      const user = await authApi.register(form);
      login(user);
      router.push("/dashboard");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "No se pudo crear la cuenta.");
    }
  }

  return (
    <div className="page-shell flex justify-center">
      <Card className="w-full max-w-md space-y-6">
        <div className="space-y-2">
          <h1 className="section-title text-3xl font-semibold text-slate-950">Crear cuenta</h1>
          <p className="text-sm text-slate-600">Crea tu cuenta de cliente para acceder a tus compras y licencias.</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {submitError ? <p className="text-sm text-red-600">{submitError}</p> : null}
          <div className="space-y-2">
            <Input onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Nombre" value={form.name} />
            {errors.name ? <p className="text-xs text-red-600">{errors.name}</p> : null}
          </div>
          <div className="space-y-2">
            <Input onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="Correo" type="email" value={form.email} />
            {errors.email ? <p className="text-xs text-red-600">{errors.email}</p> : null}
          </div>
          <div className="space-y-2">
            <Input onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Contrasena" type="password" value={form.password} />
            {errors.password ? <p className="text-xs text-red-600">{errors.password}</p> : null}
          </div>
          <Button className="w-full" type="submit">
            Registrarme
          </Button>
        </form>
        <p className="text-sm text-slate-600">
          Ya tienes cuenta? <Link className="font-medium text-cyan-700" href="/login">Inicia sesion</Link>
        </p>
      </Card>
    </div>
  );
}
