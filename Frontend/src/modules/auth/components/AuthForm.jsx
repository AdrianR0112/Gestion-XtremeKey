import { Lock, Mail, Phone, User } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../../../components/ui/select";

export default function AuthForm({ mode, form, setForm, loading, onSubmit }) {
	const isLogin = mode === "login";

	return (
		<form className="space-y-4" onSubmit={onSubmit}>
			{!isLogin ? (
				<div className="grid grid-cols-2 gap-3">
					<div className="relative">
						<User className="size-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
						<Input
							placeholder="Nombre"
							value={form.firstName}
							onChange={(event) => setForm((prev) => ({ ...prev, firstName: event.target.value }))}
							className="pl-9"
							required
						/>
					</div>
					<div className="relative">
						<User className="size-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
						<Input
							placeholder="Apellido"
							value={form.lastName}
							onChange={(event) => setForm((prev) => ({ ...prev, lastName: event.target.value }))}
							className="pl-9"
							required
						/>
					</div>
				</div>
			) : null}

			<div className="relative">
				<Mail className="size-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
				<Input
					type="email"
					placeholder="correo@empresa.com"
					value={form.email}
					onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
					className="pl-9"
					required
				/>
			</div>

			{!isLogin ? (
				<div className="relative">
					<Phone className="size-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
					<Input
						placeholder="Telefono"
						value={form.phone}
						onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
						className="pl-9"
						required
					/>
				</div>
			) : null}

			{!isLogin ? (
				<Select value={form.role} onValueChange={(value) => setForm((prev) => ({ ...prev, role: value }))}>
					<SelectTrigger>
						<SelectValue placeholder="Rol" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="admin">admin</SelectItem>
						<SelectItem value="vendedor">vendedor</SelectItem>
					</SelectContent>
				</Select>
			) : null}

			<div className="relative">
				<Lock className="size-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
				<Input
					type="password"
					placeholder="Contrasena"
					value={form.password}
					onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
					className="pl-9"
					required
				/>
			</div>

			<Button type="submit" className="w-full" disabled={loading}>
				{loading ? "Procesando..." : isLogin ? "Entrar" : "Registrar usuario"}
			</Button>
		</form>
	);
}
