import type { APIContext } from "astro";
import { insertResource, insertRelacionRecursoCategoria, getRecursoIdByTitle, getEtiquetaIdPorTipoYValor, insertRecursoEtiqueta } from "../../database/consultas";

export async function POST(context: APIContext): Promise<Response> {
    const data = await context.request.formData();

    const titulo = data.get("titulo")?.toString();
    const descripcion = data.get("descripcion")?.toString();
    const enlace = data.get("enlaceFichero")?.toString();
    const interno = data.get("internoExterno")?.toString() === "true";
    const categoria = data.get("categoria")?.toString();
    const recursoRelacion = data.get("recursoRelacion")?.toString();
    const etiquetas = JSON.parse(data.get("etiquetas")?.toString() || "[]"); // Parsear etiquetas seleccionadas
    console.log("enlacea", enlace);
    // Validar que los campos obligatorios estén presentes
    if (!titulo || !enlace || !categoria) {
        return new Response(
            JSON.stringify({ message: "Falta algún campo, por favor rellena los necesarios" }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    try {
        let idRecurso: number;

        if (!descripcion) {
            // Insertar recurso sin relación
            idRecurso = await insertResource(titulo, enlace, interno, "");
        } else {
            // Obtener ID del recurso relacionado e insertar con la relación
            //nst idRelacion = await getRecursoIdByTitle(recursoRelacion);
            idRecurso = await insertResource(titulo, enlace, interno, descripcion);
        }

        // Insertar relación con la categoría
        if (idRecurso) {
            await insertRelacionRecursoCategoria(idRecurso, categoria);

            // Insertar etiquetas asociadas al recurso
            // Insertar etiquetas asociadas al recurso
            for (const etiqueta of etiquetas) {
                const [tipo, valorEtiqueta] = etiqueta.split(': ');// Asegúrate de que las etiquetas tengan estas propiedades
                console.log("tipueeee", tipo);
                console.log("valorieeee", valorEtiqueta);
                try {
                    const etiquetaId = await getEtiquetaIdPorTipoYValor(tipo, parseInt(valorEtiqueta, 10));
                    if (etiquetaId) {
                        console.log("Insertando etiqueta con id:", etiquetaId);
                        await insertRecursoEtiqueta(idRecurso, etiquetaId); // Usar nombre y etiquetaId
                    } else {
                        console.warn("Etiqueta no encontrada en la base de datos:", etiqueta);
                    }
                } catch (error) {
                    console.error("Error al insertar etiqueta con tipo y valor:", etiqueta, error);
                }
            }

            return new Response(
                JSON.stringify({ message: "El recurso ha sido correctamente insertado con sus etiquetas" }),
                {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }
            );
        } else {
            throw new Error("No se pudo obtener el ID del recurso después de insertarlo");
        }
    } catch (error) {
        console.error(error);

        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return new Response(
            JSON.stringify({
                message: "Ha ocurrido algún fallo al insertar el recurso, probablemente título repetido",
                error: errorMessage,
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
