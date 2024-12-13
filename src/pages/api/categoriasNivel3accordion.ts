import type { APIContext } from "astro";
import { categoriasNivel3segunEtiquetas } from "../../database/consultas";

// La función GET será llamada desde el frontend para obtener las categorías de nivel 3
export async function GET(context: APIContext) {
    const { searchParams } = new URL(context.request.url);

    // Obtener los parámetros de la URL
    const roles = searchParams.get("roles"); // Ejemplo: "Junior,Senior"
    const dificultades = searchParams.get("dificultades"); // Ejemplo: "1,2"
    const categoriaNivel2 = searchParams.get("categoriaNivel2"); // Ejemplo: "Git"

    // Validar que todos los parámetros estén presentes
    if (!roles || !dificultades || !categoriaNivel2) {
        return new Response(
            JSON.stringify({
                message: "Roles, dificultades y categoría de nivel 2 son necesarios.",
            }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    try {
        // Convertir los parámetros roles y dificultades a arrays
        const rolesArray = roles.split(",").map((role) => role.trim()).filter(Boolean);
        const dificultadesArray = dificultades.split(",").map((d) => d.trim()).filter(Boolean);

        // Validar que roles y dificultades no estén vacíos
        if (rolesArray.length === 0 || dificultadesArray.length === 0) {
            return new Response(
                JSON.stringify({
                    message: "Los parámetros 'roles' y 'dificultades' no pueden estar vacíos.",
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        // Llamar a la consulta para obtener las categorías de nivel 3
        const categorias3 = await categoriasNivel3segunEtiquetas(
            rolesArray,
            dificultadesArray,
            categoriaNivel2 // Solo una categoría de nivel 2
        );

        // Verificar si se encontraron categorías
        if (!Array.isArray(categorias3) || categorias3.length === 0) {
            return new Response(
                JSON.stringify({
                    message: "No se encontraron categorías de nivel 3 para los parámetros proporcionados.",
                }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        // Devolver las categorías de nivel 3
        return new Response(JSON.stringify(categorias3), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error(
            "Error obteniendo categorías de nivel 3 según roles, dificultades y categoría de nivel 2:",
            error
        );
        const errorMessage =
            error instanceof Error ? error.message : "Error desconocido";

        return new Response(JSON.stringify({ message: errorMessage }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
