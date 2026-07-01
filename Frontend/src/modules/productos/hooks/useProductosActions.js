import { productosService } from '../services/productos.service';
import { buildProductoFormData, mapProductoFromApi } from '../helpers/producto.mapper';
import { PRODUCTO_INICIAL, validateProductoForm } from '../schemas/producto.schema';

export default function useProductosActions(state) {
    const {
        form,
        setForm,
        setSelectedId,
        cargarProductos,
        setLoading,
        setSaving,
        setError,
        setSuccess,
        setSheetOpen,
        setSheetMode,
    } = state;

    const abrirCrear = () => {
        setForm(PRODUCTO_INICIAL);
        setSelectedId(null);
        setSheetMode('create');
        setSheetOpen(true);
    };

    const abrirEditar = (producto) => {
        setSelectedId(producto.Id_Prd);
        setForm(mapProductoFromApi(producto));
        setSheetMode('edit');
        setSheetOpen(true);
    };

    const eliminarImagenProducto = async (productoId) => {
        if (!productoId) return false;

        try {
            setSaving(true);
            const updated = await productosService.removeImage(productoId);
            setForm(mapProductoFromApi(updated));
            await cargarProductos();
            setError(null);
            setSuccess('Imagen eliminada correctamente.');
            setTimeout(() => setSuccess(null), 3000);
            return true;
        } catch (err) {
            const backendErrors = Array.isArray(err?.data?.errors) ? err.data.errors.join(', ') : null;
            setError(backendErrors || err?.data?.message || err?.message || 'Error al eliminar la imagen del producto.');
            console.error('Error eliminando imagen de producto:', err);
            return false;
        } finally {
            setSaving(false);
        }
    };

    const guardarProducto = async (event) => {
        event?.preventDefault();

        const errors = validateProductoForm(form);
        if (Object.keys(errors).length > 0) {
            setError('Por favor completa los campos requeridos.');
            return false;
        }

        try {
            setSaving(true);
            const payload = buildProductoFormData(form);

            if (form.Id_Prd) {
                await productosService.update(form.Id_Prd, payload);
                setSuccess('Producto actualizado correctamente.');
            } else {
                await productosService.create(payload);
                setSuccess('Producto creado correctamente.');
            }

            await cargarProductos();
            setSheetOpen(false);
            setForm(PRODUCTO_INICIAL);
            setSelectedId(null);
            setError(null);

            setTimeout(() => setSuccess(null), 3000);
            return true;
        } catch (err) {
            const backendErrors = Array.isArray(err?.data?.errors) ? err.data.errors.join(', ') : null;
            setError(backendErrors || err?.data?.message || err?.message || 'Error al guardar producto.');
            console.error('Error guardando producto:', err);
            return false;
        } finally {
            setSaving(false);
        }
    };

    const confirmarEliminacion = async () => {
        if (!state.selectedId) return false;
        try {
            setLoading(true);
            await productosService.remove(state.selectedId);
            setSuccess('Producto eliminado correctamente.');
            await cargarProductos();
            setSelectedId(null);
            setError(null);
            setTimeout(() => setSuccess(null), 3000);
            return true;
        } catch (err) {
            setError(err?.message || 'Error al eliminar producto.');
            console.error('Error eliminando producto:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        abrirCrear,
        abrirEditar,
        eliminarImagenProducto,
        guardarProducto,
        confirmarEliminacion,
    };
}
