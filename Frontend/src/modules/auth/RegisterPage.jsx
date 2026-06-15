import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import FeedbackAlert from "../../components/feedback-alert";
import AuthCard from "./components/AuthCard";
import AuthForm from "./components/AuthForm";
import useAuth from "./hooks/useAuth";
import useAuthActions from "./hooks/useAuthActions";

export default function RegisterPage() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const state = useAuth();
	const actions = useAuthActions(state, { dispatch, navigate });

	return (
		<div className="min-h-screen flex items-center justify-center p-6">
			<AuthCard title="Crear cuenta" description="Registra un usuario para acceder al sistema.">
				<FeedbackAlert message={state.error} variant="error" className="mb-3" />
				<FeedbackAlert message={state.success} variant="success" className="mb-3" />
				<AuthForm
					mode="register"
					form={state.registerForm}
					setForm={state.setRegisterForm}
					loading={state.loading}
					onSubmit={(event) => {
						event.preventDefault();
						actions.register();
					}}
				/>
				<div className="mt-4">
					<Link to="/auth" className="text-sm text-zinc-600 hover:underline block text-center">
						Ya tengo cuenta
					</Link>
				</div>
			</AuthCard>
		</div>
	);
}
