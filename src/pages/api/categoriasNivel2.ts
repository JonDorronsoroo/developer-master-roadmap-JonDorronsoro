import type { APIContext } from "astro";
import { categoriasNivel2segunEtiquetas } from "../../database/consultas";

// La función GET es la que será llamada desde el frontend para obtener las categorías según rol, dificultad y categorías de nivel 1
export async function GET(context: APIContext) {
    // Obtener los parámetros de la URL
    const { searchParams } = new URL(context.request.url);
    const roles = searchParams.get("roles"); // Coma-separado: "Junior,Senior"
    const dificultades = searchParams.get("dificultades"); // Coma-separado: "1,2"
    const categoriasNivel1 = searchParams.get("categoriasNivel1"); // Coma-separado: "Git,DevOps"

    if (!roles || !dificultades || !categoriasNivel1) {
        return new Response(
            JSON.stringify({ message: "Roles, dificultades y categorías de nivel 1 son necesarios" }),
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
        const categoriasNivel1Array = categoriasNivel1.split(","); // ["Git", "DevOps"]

        // Llamar a la consulta con los valores de roles, dificultades y categorías de nivel 1
        const categorias2 = await categoriasNivel2segunEtiquetas(rolesArray, dificultadesArray, categoriasNivel1Array);

        // Devolver las categorías de nivel 2 filtradas
        return new Response(JSON.stringify(categorias2), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error(
            "Error obteniendo categorías de nivel 2 según roles, dificultades y categorías de nivel 1:",
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
