export function mapPlantillaFromApi(value = {}) {
  return {
    Id_Pla: value.Id_Pla ?? null,
    Nom_Pla: value.Nom_Pla ?? "",
    Tip_Pla: value.Tip_Pla ?? "personalizado",
    Can_Pla: value.Can_Pla ?? "email",
    Asu_Pla: value.Asu_Pla ?? "",
    Cue_Pla: value.Cue_Pla ?? "",
    Var_Pla: typeof value.Var_Pla === "string" ? parseJSON(value.Var_Pla) : value.Var_Pla ?? {},
    Est_Pla: value.Est_Pla ?? "activo",
  };
}

export function mapPlantillaPayload(form = {}) {
  let variables = form.Var_Pla;

  // Si Var_Pla es un objeto, convertir a string JSON
  if (typeof variables === "object" && variables !== null) {
    variables = JSON.stringify(variables);
  }

  return {
    Nom_Pla: form.Nom_Pla?.trim() || "",
    Tip_Pla: form.Tip_Pla || "personalizado",
    Can_Pla: form.Can_Pla || "email",
    Asu_Pla: form.Asu_Pla?.trim() || null,
    Cue_Pla: form.Cue_Pla?.trim() || "",
    Var_Pla: variables || null,
    Est_Pla: form.Est_Pla || "activo",
  };
}

function parseJSON(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return {};
  }
}

export default mapPlantillaPayload;
