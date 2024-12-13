import type { APIContext } from "astro";
import { categoriasNivel1segunEtiquetas } from "../../database/consultas";

export async function GET(context: APIContext) {
    const { searchParams } = new URL(context.request.url);

    const roles = searchParams.get("roles"); // Ejemplo: "Junior,Senior"
    const dificultades = searchParams.get("dificultades"); // Ejemplo: "1,2"

    console.log("Roles recibidos (query param):", roles);
    console.log("Dificultades recibidas (query param):", dificultades);

    if (!roles || !dificultades || roles.split(",").length === 0 || dificultades.split(",").length === 0) {
        return new Response(
            JSON.stringify({ message: "Roles y dificultades son necesarios" }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    try {
        const rolesArray = roles.split(",");
        const dificultadesArray = dificultades.split(",");

        console.log("Roles convertidos a array:", rolesArray);
        console.log("Dificultades convertidas a array:", dificultadesArray);

        const categorias = await categoriasNivel1segunEtiquetas(rolesArray, dificultadesArray);

        // Asegúrate de que `categorias` sea siempre un array
        if (!Array.isArray(categorias) || categorias.length === 0) {
            console.warn("No se encontraron categorías para los parámetros proporcionados.");
            return new Response(
                JSON.stringify({ message: "No se encontraron categorías." }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        return new Response(JSON.stringify(categorias), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error obteniendo categorías según roles y dificultades:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        return new Response(
            JSON.stringify({ message: errorMessage || "Error desconocido" }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
