# Plantillas de Importación de Clientes

## Descripción

Este directorio contiene plantillas de ejemplo para importar clientes en lote mediante el endpoint `POST /api/v1/clientes/import`.

## Formatos soportados

- **CSV** (.csv)
- **XLSX** (.xlsx)

## Estructura de cabeceras

Las cabeceras deben coincidir exactamente con los nombres de campo. El orden no importa. El archivo debe incluir al menos la cabecera `Tel_Cli` (requerido).

### Campos disponibles

| Campo | Tipo | Requerido | Notas |
|-------|------|-----------|-------|
| `Nom_Cli` | string | No | Nombre del cliente |
| `Ape_Cli` | string | No | Apellido del cliente |
| `Tel_Cli` | string | **Sí** | Teléfono, debe ser único en la BD |
| `Ema_Cli` | email | No | Correo electrónico |
| `Pai_Cli` | string | No | País (default: `Ecuador`) |
| `Doc_Cli` | string | No | Documento de identidad |
| `Cat_Cli` | enum | No | Categoría: `nuevo`, `ocasional`, `frecuente`, `vip` |
| `Pre_Con_Cli` | enum | No | Preferencia contacto: `whatsapp`, `email`, `instagram`, `messenger`, `telegram` |
| `Ace_Not_Tel_Cli` | boolean/tinyint | No | Aceptar notificaciones por teléfono (1/0 o true/false) |
| `Ace_Not_Cor_Cli` | boolean/tinyint | No | Aceptar notificaciones por correo (1/0 o true/false) |
| `Not_Cli` | text | No | Notas |
| `Est_Cli` | enum | No | Estado: `activo`, `inactivo`, `suspendido` (default: `activo`) |

## Ejemplo CSV

```csv
Nom_Cli,Ape_Cli,Tel_Cli,Ema_Cli,Pai_Cli,Doc_Cli,Cat_Cli,Pre_Con_Cli,Ace_Not_Tel_Cli,Ace_Not_Cor_Cli,Not_Cli,Est_Cli
Juan,Pérez,0998765432,juan@correo.com,Ecuador,1234567890,nuevo,whatsapp,1,0,Cliente preferente,activo
María,González,0997654321,maria@correo.com,Ecuador,0987654321,ocasional,email,1,1,Cliente corporativo,activo
Carlos,Rodríguez,0996543210,carlos@correo.com,Ecuador,1122334455,frecuente,telegram,0,1,,activo
```

## Validaciones

- **Tel_Cli es obligatorio**: Sin teléfono, la fila se marca como inválida.
- **Email válido**: Si se incluye `Ema_Cli`, debe ser un email con formato válido.
- **Enums**: Si incluyes valores, deben ser exactos (`nuevo`, `ocasional`, `frecuente`, `vip` para `Cat_Cli`, etc.).
- **Booleanos**: Acepta 1/0, true/false, sí/no en mayúsculas o minúsculas.
- **Duplicados**: Si un `Tel_Cli` ya existe en BD o aparece dos veces en el archivo, se omite.

## Respuesta de importación

Después de hacer POST a `/api/v1/clientes/import` con tu archivo:

```json
{
  "ok": true,
  "message": "Clientes importados correctamente.",
  "data": {
    "summary": {
      "totalRows": 6,
      "inserted": 5,
      "duplicates": 0,
      "invalid": 1
    },
    "results": [
      {
        "row": 2,
        "status": "inserted",
        "Id_Cli": 15,
        "Tel_Cli": "0998765432"
      },
      {
        "row": 3,
        "status": "inserted",
        "Id_Cli": 16,
        "Tel_Cli": "0997654321"
      },
      {
        "row": 7,
        "status": "invalid",
        "errors": ["Ema_Cli must be a valid email"]
      }
    ]
  }
}
```

### Campos de resultado

- `row`: Número de fila en el archivo (comenzando en 2 porque la fila 1 es cabecera).
- `status`: `inserted`, `duplicate`, o `invalid`.
- `Id_Cli` y `Tel_Cli`: Se incluyen si la inserción fue exitosa.
- `errors`: Array de mensajes de error si el estado es `invalid`.

## Cómo usar

1. Descarga la plantilla `clientes-importacion-ejemplo.csv` o crea tu propio archivo con las cabeceras necesarias.
2. Completa las filas con los datos de tus clientes.
3. Asegúrate de que **todos los `Tel_Cli` sean únicos** (no hay duplicados).
4. Envía el archivo por POST:

```bash
curl -X POST http://localhost:3000/api/v1/clientes/import \
  -H "Authorization: Bearer <tu_token>" \
  -F "file=@clientes-importacion-ejemplo.csv"
```

O con Postman:
- Method: POST
- URL: `http://localhost:3000/api/v1/clientes/import`
- Headers: `Authorization: Bearer <tu_token>`
- Body: form-data, key `file`, type `File`, selecciona tu CSV o XLSX.

## Notas

- El endpoint está protegido; necesitas un JWT válido con rol `admin` o `vendedor`.
- Los espacios en blanco al inicio y final se recortan automáticamente.
- Los campos omitidos se asignan con valores por defecto según el esquema.
- Puedes incluir solo las cabeceras que necesites (mínimo `Tel_Cli`).
