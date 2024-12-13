import type { APIContext } from "astro";
import { getCategoriasDeRoadmap } from "../../database/consultas";

export async function GET(context: APIContext) {
    const { searchParams } = new URL(context.request.url);

    const roadmap = searchParams.get("roadmap"); // ID del roadmap

    console.log("Roadmap recibido (query param):", roadmap);

    if (!roadmap) {
        return new Response(
            JSON.stringify({ message: "El ID del roadmap es obligatorio." }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    try {
        // Llamar a la consulta para obtener las categorías
        const categorias = await getCategoriasDeRoadmap(roadmap);

        // Verificar si se encontraron categorías
        if (!Array.isArray(categorias) || categorias.length === 0) {
            console.warn(`No se encontraron categorías para el roadmap: ${roadmap}`);
            return new Response(
                JSON.stringify({ message: "No se encontraron categorías para el roadmap especificado." }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        // Retornar las categorías en formato JSON
        return new Response(JSON.stringify(categorias), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error obteniendo categorías del roadmap:", error);
        const errorMessage = error instanceof Error ? error.message : "Error desconocido";

        return new Response(
            JSON.stringify({ message: errorMessage || "Error desconocido." }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
