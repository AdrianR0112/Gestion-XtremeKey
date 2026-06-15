import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import FeedbackAlert from "../../components/feedback-alert";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import AuthCard from "./components/AuthCard";
import useAuth from "./hooks/useAuth";
import useAuthActions from "./hooks/useAuthActions";

export default function ForgotPasswordPage() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
const state = useAuth();
const actions = useAuthActions(state, { dispatch, navigate });

	const handleSubmit = async (event) => {
		event.preventDefault();
		await actions.recoverPassword();
	};

	return (
		<div className="min-h-screen flex items-center justify-center p-6">
			<AuthCard title="Recuperar acceso" description="Ingresa tu correo para continuar con la recuperación.">
				<FeedbackAlert message={state.error} variant="error" className="mb-3" />
				<FeedbackAlert message={state.success} variant="success" className="mb-3" />
				<form className="space-y-4" onSubmit={handleSubmit}>
					<div className="relative mt-1">
						<Mail className="size-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
						<Input
							type="email"
							value={state.recoverForm.email}
							onChange={(event) => state.setRecoverForm({ email: event.target.value })}
							required
							className="pl-9"
						/>
					</div>

					<Button type="submit" className="w-full" disabled={state.loading}>
						{state.loading ? "Enviando..." : "Enviar instrucciones"}
					</Button>
				</form>
				<div className="mt-4 grid gap-2">
					<Link to="/auth" className="text-sm text-zinc-600 hover:underline block text-center">
						Volver al acceso
					</Link>
					<Link to="/auth/change-password" className="text-sm text-zinc-600 hover:underline block text-center">
						Ya tengo sesion, cambiar contrasena
					</Link>
				</div>
			</AuthCard>
		</div>
	);
}
