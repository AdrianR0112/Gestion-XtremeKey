import { useState, useEffect, useMemo } from 'react';
import { productosService } from '../services/productos.service';
import categoriasService from '../../categorias/services/categorias.service';
import { mapProductoFromApi } from '../helpers/producto.mapper';
import { mapVariantFromApi } from '../../variantes/helpers/variant.mapper';
import { variantesService } from '../../variantes/services/variantes.service';
import { PRODUCTO_INICIAL, isProductoFormValid } from '../schemas/producto.schema';

export default function useProductos() {
    const [productos, setProductos] = useState([]);
    const [variantes, setVariantes] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [form, setForm] = useState(PRODUCTO_INICIAL);
    const [searchTerm, setSearchTerm] = useState('');
    const [estadoFilter, setEstadoFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [sheetMode, setSheetMode] = useState('create');

    const cargarProductos = async () => {
        try {
            setLoading(true);
            const response = await productosService.list();
            const data = Array.isArray(response) ? response : [];
            setProductos(data.map(mapProductoFromApi));
            setError(null);
        } catch (err) {
            setError(err?.message || 'Error al cargar productos');
            console.error('Error cargando productos:', err);
        } finally {
            setLoading(false);
        }
    };

    const cargarCategorias = async () => {
        try {
            const response = await categoriasService.list();
            const data = Array.isArray(response) ? response : [];
            setCategorias(data);
        } catch (err) {
            console.error('Error cargando categorias:', err);
            setCategorias([]);
        }
    };

    const cargarVariantes = async () => {
        try {
            const response = await variantesService.list();
            const data = Array.isArray(response) ? response : [];
            setVariantes(data.map(mapVariantFromApi));
        } catch (err) {
            console.error('Error cargando variantes:', err);
            setVariantes([]);
        }
    };

    useEffect(() => {
        cargarProductos();
        cargarCategorias();
        cargarVariantes();
    }, []);

    const categoriasActivas = useMemo(() => {
        return categorias.filter((cat) => cat?.Est_Cat === 'activo');
    }, [categorias]);

    const productosFiltrados = useMemo(() => {
        return productos.filter((prod) => {
            const matchSearch =
                !searchTerm ||
                prod.Nom_Prd?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                prod.Cod_Prd?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                prod.Des_Cor_Prd?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchEstado = !estadoFilter || prod.Est_Prd === estadoFilter;

            return matchSearch && matchEstado;
        });
    }, [productos, searchTerm, estadoFilter]);

    const productoSeleccionado = useMemo(() => {
        return productos.find((p) => p.Id_Prd === selectedId) || null;
    }, [productos, selectedId]);

    const variantesPorProducto = useMemo(() => {
        return variantes.reduce((acc, variante) => {
            const idProducto = Number(variante?.Id_Prd);
            if (!idProducto) return acc;

            if (!acc[idProducto]) {
                acc[idProducto] = [];
            }

            acc[idProducto].push(variante);
            return acc;
        }, {});
    }, [variantes]);

    const formValido = isProductoFormValid(form);

    return {
        productos,
        variantes,
        variantesPorProducto,
        productosFiltrados,
        productoSeleccionado,
        selectedId,
        setSelectedId,
        form,
        setForm,
        searchTerm,
        setSearchTerm,
        estadoFilter,
        setEstadoFilter,
        loading,
        setLoading,
        saving,
        setSaving,
        error,
        setError,
        success,
        setSuccess,
        cargarProductos,
        formValido,
        sheetOpen,
        setSheetOpen,
        sheetMode,
        setSheetMode,
        categorias,
        categoriasActivas,
        cargarVariantes,
    };
}
