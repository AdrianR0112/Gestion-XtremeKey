import { useState } from "react";

const loginInitial = {
	email: "",
	password: "",
};

const registerInitial = {
	firstName: "",
	lastName: "",
	email: "",
	phone: "",
	role: "vendedor",
	password: "",
};

const changeInitial = {
	currentPassword: "",
	newPassword: "",
};

const recoverInitial = {
	email: "",
};

export default function useAuth() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [loginForm, setLoginForm] = useState(loginInitial);
	const [registerForm, setRegisterForm] = useState(registerInitial);
	const [changePasswordForm, setChangePasswordForm] = useState(changeInitial);
	const [recoverForm, setRecoverForm] = useState(recoverInitial);

	return {
		loading,
		setLoading,
		error,
		setError,
		success,
		setSuccess,
		loginForm,
		setLoginForm,
		registerForm,
		setRegisterForm,
		changePasswordForm,
		setChangePasswordForm,
		recoverForm,
		setRecoverForm,
	};
}
