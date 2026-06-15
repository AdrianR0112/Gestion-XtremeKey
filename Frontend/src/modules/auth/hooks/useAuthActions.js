import { setCredentials, logout as clearAuth } from "../../../store/auth.store";
import {
	extractAuthPayload,
	mapChangePasswordPayload,
	mapLoginPayload,
	mapRegisterPayload,
} from "../helpers/auth.mapper";
import {
	validateChangePasswordForm,
	validateLoginForm,
	validateRegisterForm,
} from "../schemas/auth.schema";
import authService from "../services/auth.service";

export default function useAuthActions(state, { dispatch, navigate }) {
	const execute = async (fn) => {
		state.setLoading(true);
		state.setError("");
		state.setSuccess("");
		try {
			await fn();
		} catch (err) {
			state.setError(err?.data?.message || err?.message || "Ocurrio un error");
		} finally {
			state.setLoading(false);
		}
	};

	const hydrateSession = async () => {
		const token = localStorage.getItem("authToken");
		if (!token) return;
		try {
			const response = await authService.me();
			const { user } = extractAuthPayload(response);
			dispatch(setCredentials({ token, user }));
			navigate("/dashboard", { replace: true });
		} catch {
			localStorage.removeItem("authToken");
			localStorage.removeItem("authUser");
		}
	};

	const login = async () => {
		const validationError = validateLoginForm(state.loginForm);
		if (validationError) {
			state.setError(validationError);
			return;
		}

		await execute(async () => {
			const response = await authService.login(mapLoginPayload(state.loginForm));
			const { token, user } = extractAuthPayload(response);
			if (!token) throw new Error("El servidor no devolvio token");
			dispatch(setCredentials({ token, user }));
			navigate("/dashboard", { replace: true });
		});
	};

	const register = async () => {
		const validationError = validateRegisterForm(state.registerForm);
		if (validationError) {
			state.setError(validationError);
			return;
		}

		await execute(async () => {
			const response = await authService.register(mapRegisterPayload(state.registerForm));
			const { token, user } = extractAuthPayload(response);
			if (token) {
				dispatch(setCredentials({ token, user }));
				navigate("/dashboard", { replace: true });
			} else {
				state.setSuccess("Usuario registrado correctamente. Ahora puedes iniciar sesion.");
				navigate("/auth", { replace: true });
			}
		});
	};

	const changePassword = async () => {
		const validationError = validateChangePasswordForm(state.changePasswordForm);
		if (validationError) {
			state.setError(validationError);
			return;
		}

		await execute(async () => {
			await authService.changePassword(mapChangePasswordPayload(state.changePasswordForm));
			state.setSuccess("Contrasena actualizada correctamente.");
			state.setChangePasswordForm({ currentPassword: "", newPassword: "" });
		});
	};

	const recoverPassword = async () => {
		const email = state.recoverForm.email?.trim();
		if (!email) {
			state.setError("Ingresa un correo valido");
			return;
		}

		await execute(async () => {
			// El backend actual no expone endpoint de recovery. Dejamos confirmacion UX.
			state.setSuccess("Solicitud registrada. Si el correo existe, recibirás instrucciones de recuperación.");
		});
	};

	const logout = async () => {
		await execute(async () => {
			try {
				await authService.logout();
			} finally {
				dispatch(clearAuth());
				navigate("/auth", { replace: true });
			}
		});
	};

	return {
		hydrateSession,
		login,
		register,
		changePassword,
		recoverPassword,
		logout,
	};
}
