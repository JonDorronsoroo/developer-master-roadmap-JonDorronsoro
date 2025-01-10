import type { APIContext } from "astro";
import {
    insertCategoria,
    insertCategoriaRol,
    insertCategoriaEtiqueta,
    getEtiquetaIdPorTipoYValor
} from "../../database/consultas";

export async function POST(context: APIContext): Promise<Response> {
    try {
        const data = await context.request.formData();

        const titulo = data.get("titulo")?.toString();
        const descripcion = data.get("descripcion")?.toString();
        const categoriaPadre = data.get("categoriaPadre")?.toString();
        const rolCategoria = data.getAll("rolCategoria").map(item => item.toString());
        const etiquetas = JSON.parse(data.get("etiquetas")?.toString() || "[]");

        // Logs para verificar los datos obtenidos
        console.log("Datos obtenidos del front:");
        console.log("Título:", titulo);
        console.log("Descripción:", descripcion);
        console.log("Categoría Padre:", categoriaPadre);
        console.log("Roles de la Categoría:", rolCategoria);
        console.log("Etiquetas seleccionadas:", etiquetas);

        if (titulo && descripcion && categoriaPadre) {
            try {
                console.log("Intentando insertar categoría...");
                const nombre = await insertCategoria(titulo, descripcion, categoriaPadre);
                console.log("Categoría insertada con éxito:", nombre);

                // Inserción de roles asociados
                if (rolCategoria.length > 0) {
                    console.log("Insertando roles de la categoría...");
                    for (const rol of rolCategoria) {
                        console.log("Insertando rol:", rol);
                        await insertCategoriaRol(nombre, rol);
                    }
                }

                // Inserción de etiquetas asociadas
                if (etiquetas.length > 0) {
                    console.log("Insertando etiquetas de la categoría...");
                    console.log(etiquetas);
                    for (const etiqueta of etiquetas) {
                        const [tipo, valorEtiqueta] = etiqueta.split(': ');
                        try {
                            // Verifica si el valorEtiqueta es un número o una cadena
                            const etiquetaId = await getEtiquetaIdPorTipoYValor(tipo, isNaN(valorEtiqueta) ? valorEtiqueta : parseInt(valorEtiqueta, 10));

                            if (etiquetaId) {
                                console.log("Insertando etiqueta con id:", etiquetaId);
                                await insertCategoriaEtiqueta(nombre, etiquetaId); // Usar nombre y etiquetaId
                            } else {
                                console.warn("Etiqueta no encontrada en la base de datos:", etiqueta);
                            }
                        } catch (error) {
                            console.error("Error al insertar etiqueta con tipo y valor:", etiqueta, error);
                        }
                    }

                }

                return new Response(JSON.stringify({ message: "Categoría insertada correctamente" }), {
                    status: 200,
                    headers: { "Content-Type": "application/json" }
                });
            } catch (error) {
                console.error("Error al insertar categoría, roles o etiquetas:", error);
                const errorMessage = error instanceof Error ? error.message : "Unknown error";
                return new Response(JSON.stringify({ message: "Error al insertar la categoría", error: errorMessage }), {
                    status: 500,
                    headers: { "Content-Type": "application/json" }
                });
            }
        } else {
            console.warn("Campos faltantes detectados");
            return new Response(JSON.stringify({ message: "Falta algún campo, por favor rellena los necesarios" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }
    } catch (globalError) {
        console.error("Error general en la API:", globalError);
        return new Response(JSON.stringify({ message: "Error interno en el servidor" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
