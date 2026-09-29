const PLACEHOLDER = /{{\s*([\w.-]+)\s*}}/g;

// "Cuenta:" / "Plan:" sin nada detras. La etiqueta se limita a 30 caracteres
// para no confundir una frase larga que acabe en dos puntos con una etiqueta.
const ETIQUETA_SIN_VALOR = /^\s*[^:{}]{1,30}:\s*$/;

/**
 * Sustituye {{variable}} por su valor. Una variable inexistente o vacia se
 * resuelve a cadena vacia.
 *
 * Si al hacerlo una linea queda como una etiqueta suelta ("Cuenta:"), se
 * elimina: las plantillas de WhatsApp se escriben como fichas de datos y una
 * etiqueta sin valor se le enviaria al cliente tal cual. Solo se descartan
 * lineas que llevaban placeholder, para no borrar texto escrito a proposito.
 */
function renderPlantilla(cuerpo, variables = {}) {
  const lineas = String(cuerpo || '').split('\n');

  const renderizadas = lineas.map((linea) => {
    const teniaPlaceholder = PLACEHOLDER.test(linea);
    PLACEHOLDER.lastIndex = 0;

    const resultado = linea.replace(PLACEHOLDER, (_match, key) => {
      const value = variables[key];
      return value === undefined || value === null ? '' : String(value);
    });

    if (teniaPlaceholder && ETIQUETA_SIN_VALOR.test(resultado)) return null;
    return resultado;
  });

  return renderizadas.filter((linea) => linea !== null).join('\n');
}

module.exports = { renderPlantilla };
