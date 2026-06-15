import { useEffect } from "react";
import FeedbackAlert from "../../components/feedback-alert";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import ConfiguracionForm from "./components/ConfiguracionForm";
import useConfiguracion from "./hooks/useConfiguracion";
import useConfiguracionActions from "./hooks/useConfiguracionActions";

export default function ConfiguracionPage() {
	const state = useConfiguracion();
	const actions = useConfiguracionActions(state);

	const {
		form,
		setForm,
		loading,
		saving,
		error,
		setError,
		success,
		configuracionSeleccionada,
		formErrors,
		formValido,
	} = state;

	const { guardarConfiguracion } = actions;

	useEffect(() => {
		if (!configuracionSeleccionada) return;
		setForm({
			Nom_Emp_Con: configuracionSeleccionada.Nom_Emp_Con || "",
			Dir_Con: configuracionSeleccionada.Dir_Con || "",
			Tel_Con: configuracionSeleccionada.Tel_Con || "",
			Ema_Con: configuracionSeleccionada.Ema_Con || "",
			Log_Con: configuracionSeleccionada.Log_Con || "",
			Mon_Con: configuracionSeleccionada.Mon_Con ?? "",
			Zon_Hor_Con: configuracionSeleccionada.Zon_Hor_Con || "",
			Imp_Con: configuracionSeleccionada.Imp_Con ?? "",
			Hab_Imp_Con: configuracionSeleccionada.Hab_Imp_Con ?? true,
		});
	}, [configuracionSeleccionada, setForm]);

	const restablecerFormulario = () => {
		if (!configuracionSeleccionada) return;
		setForm({
			Nom_Emp_Con: configuracionSeleccionada.Nom_Emp_Con || "",
			Dir_Con: configuracionSeleccionada.Dir_Con || "",
			Tel_Con: configuracionSeleccionada.Tel_Con || "",
			Ema_Con: configuracionSeleccionada.Ema_Con || "",
			Log_Con: configuracionSeleccionada.Log_Con || "",
			Mon_Con: configuracionSeleccionada.Mon_Con ?? "",
			Zon_Hor_Con: configuracionSeleccionada.Zon_Hor_Con || "",
			Imp_Con: configuracionSeleccionada.Imp_Con ?? "",
			Hab_Imp_Con: configuracionSeleccionada.Hab_Imp_Con ?? true,
		});
	};

	return (
		<div className="max-w-6xl mx-auto space-y-5">
			<div>
				<h1 className="text-2xl font-semibold">Configuracion</h1>
				<p className="text-sm text-zinc-600 dark:text-zinc-400">Parametros globales del sistema</p>
			</div>

			<FeedbackAlert message={error} variant="error" />
			<FeedbackAlert message={success} variant="success" />

			{loading ? (
				<p className="text-sm text-zinc-500">Cargando configuracion...</p>
			) : configuracionSeleccionada ? (
				<div className="space-y-3">
					<p className="text-sm text-zinc-600 dark:text-zinc-300">Edita los campos y guarda los cambios.</p>
					<ConfiguracionForm
						form={form}
						setForm={setForm}
						formErrors={formErrors}
						formValido={formValido}
						saving={saving}
						onSubmit={guardarConfiguracion}
						onCancel={restablecerFormulario}
						setError={setError}
					/>
				</div>
			) : (
				<Card>
					<CardHeader>
						<CardTitle>Configuracion</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-zinc-500">No hay configuracion disponible.</p>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
