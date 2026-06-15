export function mapTareaFromApi(value = {}) {
  return {
    Id_Tar: value.Id_Tar ?? null,
    Tit_Tar: value.Tit_Tar ?? "",
    Des_Tar: value.Des_Tar ?? "",
    Id_Cli: value.Id_Cli ?? null,
    Id_Ven: value.Id_Ven ?? null,
    Fec_Lim_Tar: value.Fec_Lim_Tar ?? null,
    Pri_Tar: value.Pri_Tar ?? "media",
    Pro_Tar: value.Pro_Tar ?? 0,
    Est_Tar: value.Est_Tar ?? "pendiente",
    Fec_Com_Tar: value.Fec_Com_Tar ?? null,
  };
}

export function mapTareaPayload(form = {}) {
  const clienteId = form.Id_Cli === "" || form.Id_Cli === null ? null : Number(form.Id_Cli);
  const ventaId = form.Id_Ven === "" || form.Id_Ven === null ? null : Number(form.Id_Ven);
  const progress = form.Pro_Tar === "" || form.Pro_Tar === null ? 0 : Number(form.Pro_Tar);

  const payload = {
    Tit_Tar: form.Tit_Tar?.trim() || "",
    Des_Tar: form.Des_Tar?.trim() || null,
    Id_Cli: Number.isFinite(clienteId) ? clienteId : null,
    Id_Ven: Number.isFinite(ventaId) ? ventaId : null,
    Fec_Lim_Tar: form.Fec_Lim_Tar || null,
    Pri_Tar: form.Pri_Tar || "media",
    Pro_Tar: Number.isFinite(progress) ? progress : 0,
    Est_Tar: form.Est_Tar || "pendiente",
  };

  // Solo incluir Fec_Com_Tar si el estado es "completada"
  if (form.Est_Tar === "completada") {
    payload.Fec_Com_Tar = form.Fec_Com_Tar || null;
  }

  return payload;
}

export default mapTareaPayload;
