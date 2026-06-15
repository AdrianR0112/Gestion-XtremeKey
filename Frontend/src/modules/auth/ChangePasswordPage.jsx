import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import FeedbackAlert from "../../components/feedback-alert";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import AuthCard from "./components/AuthCard";
import useAuth from "./hooks/useAuth";
import useAuthActions from "./hooks/useAuthActions";

export default function ChangePasswordPage() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const state = useAuth();
	const actions = useAuthActions(state, { dispatch, navigate });

	return (
		<div className="min-h-screen flex items-center justify-center p-6">
			<AuthCard title="Cambiar contrasena" description="Actualiza tu credencial de acceso.">
				<FeedbackAlert message={state.error} variant="error" className="mb-3" />
				<FeedbackAlert message={state.success} variant="success" className="mb-3" />
				<form
					className="space-y-4"
					onSubmit={(event) => {
						event.preventDefault();
						actions.changePassword();
					}}
				>
					<div className="space-y-2">
						<Label>Contrasena actual</Label>
						<Input
							type="password"
							value={state.changePasswordForm.currentPassword}
							onChange={(event) =>
								state.setChangePasswordForm((prev) => ({ ...prev, currentPassword: event.target.value }))
							}
							required
						/>
					</div>
					<div className="space-y-2">
						<Label>Nueva contrasena</Label>
						<Input
							type="password"
							value={state.changePasswordForm.newPassword}
							onChange={(event) =>
								state.setChangePasswordForm((prev) => ({ ...prev, newPassword: event.target.value }))
							}
							required
						/>
					</div>
					<Button type="submit" className="w-full" disabled={state.loading}>
						{state.loading ? "Actualizando..." : "Actualizar contrasena"}
					</Button>
				</form>
				<div className="mt-4">
					<Link to="/dashboard" className="text-sm text-zinc-600 hover:underline block text-center">
						Volver al dashboard
					</Link>
				</div>
			</AuthCard>
		</div>
	);
}
