import type { APIContext } from "astro";
import { categoriasNivel2segunEtiquetas } from "../../database/consultas";

export async function GET(context: APIContext) {
    const { searchParams } = new URL(context.request.url);

    // Obtener los parámetros de la URL
    const roles = searchParams.get("roles");
    const dificultades = searchParams.get("dificultades");
    const categoriaNivel1 = searchParams.get("categoriaNivel1"); // Solo una categoría de nivel 1

    // Validar que todos los parámetros estén presentes
    if (!roles || !dificultades || !categoriaNivel1) {
        return new Response(
            JSON.stringify({
                message: "Se requieren los parámetros 'roles', 'dificultades' y 'categoriaNivel1'.",
            }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    try {
        // Procesar los parámetros en arrays
        const rolesArray = roles.split(",").map((role) => role.trim()).filter(Boolean);
        const dificultadesArray = dificultades.split(",").map((d) => d.trim()).filter(Boolean);

        // Verificar que los arrays no estén vacíos
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

        console.log("Parámetros recibidos:");
        console.log("Roles:", rolesArray);
        console.log("Dificultades:", dificultadesArray);
        console.log("Categoría de nivel 1:", categoriaNivel1);

        // Llamar a la consulta de la base de datos con los parámetros procesados
        const categorias2 = await categoriasNivel2segunEtiquetas(
            rolesArray,
            dificultadesArray,
            categoriaNivel1 // Categoría de nivel 1
        );

        // Verificar si la consulta devolvió resultados
        if (!Array.isArray(categorias2) || categorias2.length === 0) {
            return new Response(
                JSON.stringify({
                    message: "No se encontraron categorías de nivel 2 para los parámetros proporcionados.",
                }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        console.log("Categorías de nivel 2 encontradas:", categorias2);

        // Devolver las categorías de nivel 2
        return new Response(JSON.stringify(categorias2), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error(
            "Error obteniendo categorías de nivel 2 según roles, dificultades y categoría de nivel 1:",
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
