import type { APIContext } from "astro";
import { getRoadmapsAsignadosByMentor } from "../../database/consultas";

export async function GET(context: APIContext) {
    const { searchParams } = new URL(context.request.url);

    // Obtener el parámetro 'idMentor' de la query string
    const idMentor = searchParams.get("idMentor");

    console.log("ID del mentor recibido (query param):", idMentor);

    // Validar que se haya proporcionado el parámetro idMentor
    if (!idMentor) {
        return new Response(
            JSON.stringify({ message: "El parámetro 'idMentor' es necesario." }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    try {
        // Llamar a la consulta con el ID del mentor proporcionado
        const roadmapsAsignados = await getRoadmapsAsignadosByMentor(idMentor);

        // Verificar si se encontraron roadmaps
        if (!Array.isArray(roadmapsAsignados) || roadmapsAsignados.length === 0) {
            console.warn("No se encontraron roadmaps asignados para el mentor proporcionado.");
            return new Response(
                JSON.stringify({ message: "No se encontraron roadmaps asignados." }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        // Retornar los resultados
        return new Response(JSON.stringify(roadmapsAsignados), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error obteniendo roadmaps asignados:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        return new Response(
            JSON.stringify({ message: errorMessage || "Error desconocido." }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}