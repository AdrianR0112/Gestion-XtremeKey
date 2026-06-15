import { useState, useMemo } from "react";
import { createDetalleInitialValues, getTodayDateInputValue, toDateInputValue } from "../utils/constants";

export function useDetalles(detallesIniciales = []) {
	const [detallesTemporales, setDetallesTemporales] = useState(detallesIniciales);
	const [detalleFormOpen, setDetalleFormOpen] = useState(false);
	const [detalleForm, setDetalleForm] = useState(createDetalleInitialValues);
	const [detalleEditandoIdx, setDetalleEditandoIdx] = useState(null);

	const detalleSubtotal = useMemo(() => {
		const can = Number(detalleForm.Can_Dve || 0);
		const pre = Number(detalleForm.Pre_Uni_Dve || 0);
		const des = Number(detalleForm.Des_Uni_Dve || 0);
		return Number((can * (pre - des)).toFixed(2));
	}, [detalleForm.Can_Dve, detalleForm.Des_Uni_Dve, detalleForm.Pre_Uni_Dve]);

	const totalesDetalles = useMemo(() => {
		const subtotal = detallesTemporales.reduce((sum, det) => sum + (det.Sub_Tot_Dve || 0), 0);
		return { subtotal: Number(subtotal.toFixed(2)) };
	}, [detallesTemporales]);

	const abrirCrearDetalle = () => {
		setDetalleEditandoIdx(null);
		setDetalleForm(createDetalleInitialValues());
		setDetalleFormOpen(true);
	};

	const abrirEditarDetalle = (idx) => {
		setDetalleEditandoIdx(idx);
		const detalle = detallesTemporales[idx];
		const today = getTodayDateInputValue();
		setDetalleForm({
			Id_Prd: detalle.Id_Prd ? String(detalle.Id_Prd) : "",
			Id_Var: detalle.Id_Var ? String(detalle.Id_Var) : "",
			Id_Cue: detalle.Id_Cue ? String(detalle.Id_Cue) : "",
			Id_Key: detalle.Id_Key ? String(detalle.Id_Key) : "",
			Can_Dve: detalle.Can_Dve ?? 1,
			Pre_Uni_Dve: detalle.Pre_Uni_Dve ?? "",
			Des_Uni_Dve: detalle.Des_Uni_Dve ?? 0,
			Fec_Ini_Dve: detalle.Fec_Ini_Dve && detalle.Fec_Ini_Dve.toString().trim() ? toDateInputValue(detalle.Fec_Ini_Dve) : today,
			Fec_Fin_Dve: detalle.Fec_Fin_Dve && detalle.Fec_Fin_Dve.toString().trim() ? toDateInputValue(detalle.Fec_Fin_Dve) : today,
			Cor_Cue: detalle.Cor_Cue || "",
			Con_Cue: detalle.Con_Cue || "",
			Not_Dve: detalle.Not_Dve || "",
			Est_Dve: detalle.Est_Dve || "activo",
		});
		setDetalleFormOpen(true);
	};

	const guardarDetalle = (toNullableInteger, toNullableString) => {
		if (detalleForm.Pre_Uni_Dve === "" || Number(detalleForm.Pre_Uni_Dve) < 0 || Number(detalleForm.Can_Dve || 0) < 1 || detalleSubtotal < 0) {
			return false;
		}

		if (new Date(`${detalleForm.Fec_Fin_Dve}T00:00:00`) < new Date(`${detalleForm.Fec_Ini_Dve}T00:00:00`)) {
			return false;
		}

		const fechaInicio = detalleForm.Fec_Ini_Dve || getTodayDateInputValue();
		const detalleData = {
			Id_Prd: toNullableInteger(detalleForm.Id_Prd),
			Id_Var: toNullableInteger(detalleForm.Id_Var),
			Id_Cue: toNullableInteger(detalleForm.Id_Cue),
			Id_Key: toNullableInteger(detalleForm.Id_Key),
			Can_Dve: Number(detalleForm.Can_Dve || 1),
			Pre_Uni_Dve: Number(detalleForm.Pre_Uni_Dve || 0),
			Des_Uni_Dve: Number(detalleForm.Des_Uni_Dve || 0),
			Sub_Tot_Dve: Number(detalleSubtotal),
			Fec_Ini_Dve: fechaInicio,
			Fec_Fin_Dve: detalleForm.Fec_Fin_Dve || fechaInicio,
			Cor_Cue: toNullableString(detalleForm.Cor_Cue),
			Con_Cue: toNullableString(detalleForm.Con_Cue),
			Not_Dve: toNullableString(detalleForm.Not_Dve),
			Est_Dve: detalleForm.Est_Dve || "activo",
		};

		if (detalleEditandoIdx !== null) {
			const updated = [...detallesTemporales];
			updated[detalleEditandoIdx] = detalleData;
			setDetallesTemporales(updated);
		} else {
			setDetallesTemporales([...detallesTemporales, detalleData]);
		}

		setDetalleFormOpen(false);
		setDetalleForm(createDetalleInitialValues());
		setDetalleEditandoIdx(null);
		return true;
	};

	const eliminarDetalle = (idx) => {
		setDetallesTemporales(detallesTemporales.filter((_, i) => i !== idx));
	};

	const resetear = () => {
		setDetallesTemporales([]);
		setDetalleFormOpen(false);
		setDetalleForm(createDetalleInitialValues());
		setDetalleEditandoIdx(null);
	};

	const cargar = (detalles) => {
		setDetallesTemporales(detalles);
		setDetalleFormOpen(false);
		setDetalleForm(createDetalleInitialValues());
		setDetalleEditandoIdx(null);
	};

	return {
		detallesTemporales,
		setDetallesTemporales,
		detalleFormOpen,
		setDetalleFormOpen,
		detalleForm,
		setDetalleForm,
		detalleEditandoIdx,
		setDetalleEditandoIdx,
		detalleSubtotal,
		totalesDetalles,
		abrirCrearDetalle,
		abrirEditarDetalle,
		guardarDetalle,
		eliminarDetalle,
		resetear,
		cargar,
	};
}
