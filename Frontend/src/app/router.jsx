import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import LoginPage from "../modules/auth";
import ForgotPasswordPage from "../modules/auth/ForgotPasswordPage";
import ChangePasswordPage from "../modules/auth/ChangePasswordPage";
import DashboardPage from "../modules/dashboard";
import ReportesPage from "../modules/reportes";
import ConfiguracionPage from "../modules/configuracion";
import UsuariosPage from "../modules/usuarios";
import ClientesPage from "../modules/clientes";
import ProveedoresPage from "../modules/proveedores";
import CategoriasPage from "../modules/categorias";
import ProductosPage from "../modules/productos";
import VariantesPage from "../modules/variantes";
import CuentasPage from "../modules/cuentas";
import KeysPage from "../modules/keys";
import VentasPage from "../modules/ventas";
import { VentasCreatePage } from "../modules/ventas";
import ComprasPage from "../modules/compras";
import { ComprasCreatePage } from "../modules/compras";
import DetalleComprasPage from "../modules/detalle-compras";
import GastosPage from "../modules/gastos";
import CalendarioPage from "../modules/calendario";
import RenovacionesPage from "../modules/renovaciones";
import RevendedoresPage from "../modules/revendedores";
import TareasPage from "../modules/tareas";
import PlantillasPage from "../modules/plantillas";

function PrivateRoute({ children }) {
  const location = useLocation();
  const authUser = useSelector((state) => state?.auth?.user);
  const hasSession = Boolean(authUser || localStorage.getItem("authUser"));

  if (!hasSession) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return children;
}

export default function Router() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/auth" element={<LoginPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/change-password" element={<ChangePasswordPage />} />
      </Route>

      <Route
        path="/"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="reportes" element={<ReportesPage />} />
        <Route path="configuracion" element={<ConfiguracionPage />} />
        <Route path="staff" element={<UsuariosPage />} />
        <Route path="clientes" element={<ClientesPage />} />
        <Route path="proveedores" element={<ProveedoresPage />} />
        <Route path="categorias" element={<CategoriasPage />} />
        <Route path="productos" element={<ProductosPage />} />
        <Route path="variantes" element={<VariantesPage />} />
        <Route path="cuentas" element={<CuentasPage />} />
        <Route path="keys" element={<KeysPage />} />
        <Route path="ventas" element={<VentasPage />} />
        <Route path="ventas/nueva" element={<VentasCreatePage />} />
        <Route path="compras" element={<ComprasPage />} />
        <Route path="compras/nueva" element={<ComprasCreatePage />} />
        <Route path="detalle-compras" element={<DetalleComprasPage />} />
        <Route path="gastos" element={<GastosPage />} />
        <Route path="calendario" element={<CalendarioPage />} />
        <Route path="renovaciones" element={<RenovacionesPage />} />
        <Route path="revendedores" element={<RevendedoresPage />} />
        <Route path="tareas" element={<TareasPage />} />
        <Route path="plantillas" element={<PlantillasPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
