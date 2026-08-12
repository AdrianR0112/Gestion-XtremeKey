const { getPool } = require('../../config/database');

const BASE_SELECT = `
  SELECT
    nueva.Id_Dve AS Id_Dve,
    anterior.Id_Dve AS Id_Dve_Ant,
    nueva.Id_Ven AS Id_Ven_Nue,
    anterior.Id_Ven AS Id_Ven_Ant,
    ventaNueva.Cod_Ven AS Cod_Ven_Nue,
    ventaAnterior.Cod_Ven AS Cod_Ven_Ant,
    ventaNueva.Fec_Ven AS Fec_Ven_Nue,
    ventaAnterior.Fec_Ven AS Fec_Ven_Ant,
    ventaNueva.Id_Cli,
    c.Nom_Cli,
    c.Ape_Cli,
    nueva.Id_Prd,
    nueva.Id_Var,
    p.Nom_Prd,
    vr.Nom_Var,
    anterior.Can_Dve AS Can_Dve_Ant,
    nueva.Can_Dve AS Can_Dve_Nue,
    anterior.Pre_Uni_Dve AS Pre_Uni_Dve_Ant,
    nueva.Pre_Uni_Dve AS Pre_Uni_Dve_Nue,
    anterior.Des_Uni_Dve AS Des_Uni_Dve_Ant,
    nueva.Des_Uni_Dve AS Des_Uni_Dve_Nue,
    anterior.Fec_Ini_Dve AS Fec_Ini_Dve_Ant,
    anterior.Fec_Fin_Dve AS Fec_Fin_Dve_Ant,
    nueva.Fec_Ini_Dve AS Fec_Ini_Dve_Nue,
    nueva.Fec_Fin_Dve AS Fec_Fin_Dve_Nue,
    nueva.Not_Dve,
    nueva.Id_Sus,
    nueva.Est_Dve,
    nueva.Fec_Cre,
    nueva.Fec_Mod
  FROM detalle_ventas nueva
  INNER JOIN detalle_ventas anterior ON anterior.Id_Dve = nueva.Id_Dve_Ant
  INNER JOIN ventas ventaNueva ON ventaNueva.Id_Ven = nueva.Id_Ven
  INNER JOIN ventas ventaAnterior ON ventaAnterior.Id_Ven = anterior.Id_Ven
  LEFT JOIN clientes c ON c.Id_Cli = ventaNueva.Id_Cli
  LEFT JOIN productos p ON p.Id_Prd = nueva.Id_Prd
  LEFT JOIN variantes_productos vr ON vr.Id_Var = nueva.Id_Var
  WHERE ventaNueva.Est_Ven = 'completada'
`;

function resolvePool(connection) {
  return connection || getPool();
}

async function findAll(connection) {
  const pool = resolvePool(connection);
  const [rows] = await pool.query(`${BASE_SELECT} ORDER BY nueva.Fec_Cre DESC, nueva.Id_Dve DESC`);
  return rows;
}

module.exports = { findAll };
