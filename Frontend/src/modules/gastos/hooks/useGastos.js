import { useEffect, useMemo, useState } from "react";
import gastosService from "../services/gastos.service";
import proveedoresService from "../../proveedores/services/proveedores.service";
import comprasService from "../../compras/services/compras.service";
import { createGastoForm } from "../schemas/gasto.schema";
import { mapGastoFromApi, buildProveedorMap, buildCompraMap, filterGastos } from "../helpers/gasto.mapper";
import useGastosActions from "./useGastosActions";

export default function useGastos() {
const [gastos, setGastos] = useState([]);
const [proveedores, setProveedores] = useState([]);
const [compras, setCompras] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");
const [gastoSheetOpen, setGastoSheetOpen] = useState(false);
const [gastoForm, setGastoForm] = useState(createGastoForm());
const [searchTerm, setSearchTerm] = useState("");
const [categoriaFilter, setCategoriaFilter] = useState("");

const proveedorMap = useMemo(() => buildProveedorMap(proveedores), [proveedores]);
const compraMap = useMemo(() => buildCompraMap(compras), [compras]);
const gastosFiltrados = useMemo(
() => filterGastos(gastos, searchTerm, categoriaFilter, proveedorMap),
[gastos, searchTerm, categoriaFilter, proveedorMap]
);

const cargarTodo = async () => {
try {
setLoading(true);
setError("");
const [gastosResp, proveedoresResp, comprasResp] = await Promise.all([
gastosService.list(),
proveedoresService.list(),
comprasService.list(),
]);

const gastosData = Array.isArray(gastosResp) ? gastosResp : gastosResp?.data || [];
const proveedoresData = Array.isArray(proveedoresResp) ? proveedoresResp : proveedoresResp?.data || [];
const comprasData = Array.isArray(comprasResp) ? comprasResp : comprasResp?.data || [];

setGastos(gastosData.map(mapGastoFromApi));
setProveedores(proveedoresData);
setCompras(comprasData);
} catch (err) {
setError(err?.message || "Error al cargar datos");
} finally {
setLoading(false);
}
};

useEffect(() => {
cargarTodo();
}, []);

const actions = useGastosActions({
setGastos,
setProveedores,
setGastoForm,
setGastoSheetOpen,
setError,
setSuccess,
gastos,
gastoForm,
});

return {
gastos,
proveedores,
compras,
loading,
error,
success,
gastoSheetOpen,
setGastoSheetOpen,
gastoForm,
setGastoForm,
searchTerm,
setSearchTerm,
categoriaFilter,
setCategoriaFilter,
proveedorMap,
compraMap,
gastosFiltrados,
cargarTodo,
...actions,
};
}
