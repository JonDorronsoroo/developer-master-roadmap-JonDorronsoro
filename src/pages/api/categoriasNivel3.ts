import type { APIContext } from "astro";
import { categoriasNivel3segunEtiquetas } from "../../database/consultas";

// La función GET es la que será llamada desde el frontend para obtener las categorías según rol, dificultad y categorías de nivel 2
export async function GET(context: APIContext) {
    // Obtener los parámetros de la URL
    const { searchParams } = new URL(context.request.url);
    const roles = searchParams.get("roles"); // Coma-separado: "Junior,Senior"
    const dificultades = searchParams.get("dificultades"); // Coma-separado: "1,2"
    const categoriasNivel2 = searchParams.get("categoriasNivel2"); // Coma-separado: "CI/CD,Git"

    if (!roles || !dificultades || !categoriasNivel2) {
        return new Response(
            JSON.stringify({ message: "Roles, dificultades y categorías de nivel 2 son necesarios" }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    try {
        // Convertir los parámetros en arrays
        const rolesArray = roles.split(","); // ["Junior", "Senior"]
        const dificultadesArray = dificultades.split(","); // ["1", "2"]
        const categoriasNivel2Array = categoriasNivel2.split(","); // ["CI/CD", "Git"]

        // Llamar a la consulta con los valores de roles, dificultades y categorías de nivel 2
        const categorias3 = await categoriasNivel3segunEtiquetas(rolesArray, dificultadesArray, categoriasNivel2Array);

        // Devolver las categorías de nivel 3 filtradas
        return new Response(JSON.stringify(categorias3), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error(
            "Error obteniendo categorías de nivel 3 según roles, dificultades y categorías de nivel 2:",
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
