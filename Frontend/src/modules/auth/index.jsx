import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import FeedbackAlert from "../../components/feedback-alert";
import { Button } from "../../components/ui/button";
import AuthCard from "./components/AuthCard";
import AuthForm from "./components/AuthForm";
import useAuth from "./hooks/useAuth";
import useAuthActions from "./hooks/useAuthActions";

export default function AuthPage() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const state = useAuth();
	const actions = useAuthActions(state, { dispatch, navigate });

	useEffect(() => {
		actions.hydrateSession();
	}, []);

	return (
		<div className="min-h-screen flex items-center justify-center p-6">
			<AuthCard title="Acceso al sistema" description="Inicia sesion para continuar.">
				<FeedbackAlert message={state.error} variant="error" className="mb-3" />
				<FeedbackAlert message={state.success} variant="success" className="mb-3" />
				<AuthForm
					mode="login"
					form={state.loginForm}
					setForm={state.setLoginForm}
					loading={state.loading}
					onSubmit={(event) => {
						event.preventDefault();
						actions.login();
					}}
				/>

				<div className="mt-4 grid gap-2">
					<Button type="button" variant="outline" className="w-full" onClick={() => state.setLoginForm((prev) => ({ ...prev, email: "demo@empresa.com" }))}>
						Usar demo
					</Button>
					<Link to="/auth/forgot-password" className="text-sm text-center text-zinc-600 hover:underline">
						Recuperar contrasena
					</Link>
				</div>
			</AuthCard>
		</div>
	);
}
