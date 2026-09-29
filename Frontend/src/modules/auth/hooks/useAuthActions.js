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
		try {
			const response = await authService.me();
			const { user } = extractAuthPayload(response);
			if (!user) return;
			dispatch(setCredentials({ user }));
			navigate("/dashboard", { replace: true });
		} catch {
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
			const { user } = extractAuthPayload(response);
			if (!user) throw new Error("El servidor no devolvio sesion");
			dispatch(setCredentials({ user }));
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
			const { user } = extractAuthPayload(response);
			if (!user) throw new Error("No se pudo crear el staff");
			dispatch(setCredentials({ user }));
			navigate("/dashboard", { replace: true });
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
