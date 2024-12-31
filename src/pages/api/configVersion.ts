import type { APIContext } from "astro";
import {
    insertNuevoRoadmap,
    insertStep,
    getMaxVersionByRoadmap,
} from "../../database/consultas";

export async function POST(context: APIContext): Promise<Response> {
    try {
        const data = await context.request.formData();

        // Log: Datos crudos recibidos
        console.log("Datos crudos recibidos:", Object.fromEntries(data.entries()));

        // Obtención de los datos enviados desde el frontend
        const titulo = data.get("titulo")?.toString().trim() ?? null;
        const descripcion = data.get("descripcion")?.toString().trim() ?? null;
        const categoriasNivel1Raw = data.get("selectedCategoriasNivel1")?.toString() ?? null;
        const categoriasNivel2Raw = data.get("selectedCategoriasNivel2")?.toString() ?? null;
        const categoriasNivel3Raw = data.get("selectedCategoriasNivel3")?.toString() ?? null;

        if (!titulo || !descripcion) {
            return new Response(
                JSON.stringify({ error: "El título y la descripción son obligatorios." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Parsear las categorías enviadas
        const tryParseJson = (jsonString: string | null): string[] => {
            try {
                return jsonString ? JSON.parse(jsonString) : [];
            } catch (error) {
                console.error("Error al parsear JSON:", error);
                throw new Error("Datos JSON mal formateados");
            }
        };

        const categoriasNivel1 = tryParseJson(categoriasNivel1Raw);
        const categoriasNivel2 = tryParseJson(categoriasNivel2Raw);
        const categoriasNivel3 = tryParseJson(categoriasNivel3Raw);

        // Obtener la versión actual del roadmap y calcular la nueva versión
        const currentVersion = await getMaxVersionByRoadmap(titulo);
        const newVersion = currentVersion + 1;

        // Crear un nuevo roadmap con la misma identificación pero versión diferente
        await insertNuevoRoadmap(titulo, descripcion, null, newVersion);

        // Insertar los steps asociados al roadmap
        let stepNumber = 1;

        // Categorías de nivel 1
        for (const categoriaNivel1 of categoriasNivel1) {
            await insertStep(stepNumber.toString(), titulo, categoriaNivel1, null);
            stepNumber++;
        }

        // Categorías de nivel 2
        for (const categoriaNivel2 of categoriasNivel2) {
            await insertStep(stepNumber.toString(), titulo, categoriaNivel2, null);
            stepNumber++;
        }

        // Categorías de nivel 3
        for (const categoriaNivel3 of categoriasNivel3) {
            await insertStep(stepNumber.toString(), titulo, categoriaNivel3, null);
            stepNumber++;
        }

        return new Response(
            JSON.stringify({ message: "El roadmap y sus pasos han sido insertados correctamente." }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Error al procesar la solicitud:", error);

        return new Response(
            JSON.stringify({
                error: error instanceof Error ? error.message : "Error desconocido",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
