import type { APIContext } from "astro";
import {
    insertNuevoRoadmap,
    insertStep,
    insertEtiquetaConocimientoBase,
    insertEsquemaRoadmapEtiqueta,
    existsEtiquetaConocimientoBase,
    getEtiquetaId,
    getComponentesCategoriaTercerNivel,
    getComponentesCategoriaSegundoNivel,
    getComponentesCategoriaPrimerNivel,
    insertElementoReutilizable,
    getIdElementoReutilizable

} from "../../database/consultas";

export async function POST(context: APIContext): Promise<Response> {
    try {
        const data = await context.request.formData();

        const titulo = data.get("titulo")?.toString().trim() ?? null;
        const descripcion = data.get("descripcion")?.toString().trim() ?? null;
        const ordenCategoriasRaw = data.get("ordenCategorias")?.toString() ?? null;
        const categoriasNivel2Raw = data.get("selectedCategoriasNivel2")?.toString() ?? null;
        const categoriasNivel3Raw = data.get("selectedCategoriasNivel3")?.toString() ?? null;

        if (!titulo || !descripcion || !ordenCategoriasRaw) {
            return new Response(
                JSON.stringify({ message: "El título, descripción y orden de categorías son obligatorios." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        let ordenCategorias: Array<{ id: string; orden: number; tipo: string }> = [];
        let categoriasNivel2: Array<{ name: string }> = [];
        let categoriasNivel3: Array<{ name: string }> = [];

        try {
            ordenCategorias = JSON.parse(ordenCategoriasRaw);
            categoriasNivel2 = categoriasNivel2Raw ? JSON.parse(categoriasNivel2Raw) : [];
            categoriasNivel3 = categoriasNivel3Raw ? JSON.parse(categoriasNivel3Raw) : [];
        } catch (error) {
            console.error("Error inesperado:", error);

            const errorMessage =
                error instanceof Error
                    ? error.message // Si es un Error, accede a su mensaje
                    : "Ocurrió un error desconocido"; // Mensaje genérico para errores no estándar

            return new Response(
                JSON.stringify({
                    message: "Error inesperado al procesar el roadmap.",
                    error: errorMessage,
                }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }


        console.log("Categorias ordenadas (parsed):", ordenCategorias);

        // Insertar el nuevo roadmap
        try {
            const idRoadmap = await insertNuevoRoadmap(titulo, descripcion, "");
            // Continuar con el proceso si el roadmap es nuevo
        } catch (error) {
            console.log("Error capturado:", error);
            if (error && error.toString() === "Error: Roadmap duplicado") {
                return new Response(
                    JSON.stringify({ error: "El roadmap con este título ya existe. Por favor, usa otro título." }),
                    { status: 400, headers: { "Content-Type": "application/json" } }
                );
            }

            console.error("Error inesperado:", error);
            return new Response(
                JSON.stringify({ error: "Error interno del servidor" }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }



        // Procesar las categorías y roadmaps reutilizables
        for (const categoria of ordenCategorias) {
            if (!categoria || typeof categoria.orden === "undefined" || !categoria.id || !categoria.tipo) {
                console.warn("Categoría o roadmap reutilizable inválido:", categoria);
                continue;
            }

            if (categoria.tipo === "Categoría") {
                console.log("hemen algea ba", categoria);
                // Insertar categorías estándar
                await insertStep(categoria.orden.toString(), titulo, categoria.id, null);
                const etiquetaExiste = await existsEtiquetaConocimientoBase(categoria.id);

                let idEtiqueta: number;
                if (!etiquetaExiste) {
                    idEtiqueta = await insertEtiquetaConocimientoBase(categoria.id);
                } else {
                    idEtiqueta = await getEtiquetaId(categoria.id);
                }
                await insertEsquemaRoadmapEtiqueta(titulo, idEtiqueta);
                const idElementoReutilizable = await insertElementoReutilizable(titulo, idEtiqueta);



            } else if (categoria.tipo === "Roadmap reutilizable") {
                console.log("Reutilizable detectado:", categoria);
                //const idElemento = await getIdElementoReutilizable(categoria.id);
                await insertStep(categoria.orden.toString(), titulo, null, categoria.id);

            }
        }
        let ordenNivel2 = ordenCategorias.length + 1;
        for (const nivel2 of categoriasNivel2) {
            if (!nivel2 || !nivel2.name) {
                console.warn("Categoría de nivel 2 inválida:", nivel2);
                continue;
            }
            console.log("Insertando categoría de nivel 2 recibida:", nivel2.name);
            await insertStep("", titulo, nivel2.name, null);
            ordenNivel2++;
        }

        // Insertar categorías de nivel 3 recibidas directamente
        let ordenNivel3 = ordenNivel2;
        for (const nivel3 of categoriasNivel3) {
            if (!nivel3 || !nivel3.name) {
                console.warn("Categoría de nivel 3 inválida:", nivel3);
                continue;
            }
            console.log("Insertando categoría de nivel 3 recibida:", nivel3.name);
            await insertStep("", titulo, nivel3.name, null);
            ordenNivel3++;
        }

        return new Response(
            JSON.stringify({ message: "El roadmap y sus pasos han sido insertados correctamente." }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Error inesperado:", error);

        const errorMessage =
            error instanceof Error
                ? error.message // Si es un Error, accede a su mensaje
                : "Ocurrió un error desconocido"; // Mensaje genérico para errores no estándar

        return new Response(
            JSON.stringify({
                message: "Error inesperado al procesar el roadmap.",
                error: errorMessage,
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
