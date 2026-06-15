export const mapLoginPayload = (form) => ({
	Ema_Usu: form.email.trim(),
	Pas_Usu: form.password,
});

export const mapRegisterPayload = (form) => ({
	Nom_Usu: form.firstName.trim(),
	Ape_Usu: form.lastName.trim(),
	Ema_Usu: form.email.trim(),
	Pas_Usu: form.password,
	Tel_Usu: form.phone.trim(),
	Rol_Usu: form.role,
});

export const mapChangePasswordPayload = (form) => ({
	currentPassword: form.currentPassword,
	newPassword: form.newPassword,
});

export const extractAuthPayload = (response) => {
	const payload = response?.data ?? response ?? {};
	return {
		token: payload.token || payload?.data?.token || null,
		user: payload.user || payload?.data?.user || null,
		message: payload.message || payload?.data?.message || "",
	};
};

export default {
	mapLoginPayload,
	mapRegisterPayload,
	mapChangePasswordPayload,
	extractAuthPayload,
};
