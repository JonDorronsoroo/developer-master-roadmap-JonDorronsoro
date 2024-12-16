import type { APIContext } from "astro";
import { assignRoadmap } from "../../database/consultas";

export async function POST(context: APIContext) {
    try {
        console.log("Solicitud recibida en /api/asignarRoadmap");

        const { request } = context;
        const body = await request.json();
        console.log("Datos recibidos:", body);

        const { id_roadmap, username_newcomer, id_mentor } = body;

        // Verificar que todos los campos estén presentes
        if (!id_roadmap || !username_newcomer || !id_mentor) {
            console.error("Datos faltantes en la solicitud.");
            return new Response(
                JSON.stringify({ message: "Todos los campos son requeridos." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Llamar a la función para asignar el roadmap directamente con el username
        const result = await assignRoadmap(id_roadmap, username_newcomer, id_mentor);


        // Validar si la inserción se realizó
        if (!result || typeof result !== "object" || !("affectedRows" in result) || result.affectedRows === 0) {
            console.error("No se pudo asignar el roadmap. Resultado inválido o sin filas afectadas.");
            console.log("Resultado devuelto:", result); // Depuración adicional
            return new Response(
                JSON.stringify({
                    message: "No se pudo asignar el roadmap. Intenta nuevamente.",
                }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }


        console.log("Roadmap asignado exitosamente:", result);

        return new Response(
            JSON.stringify({ message: "Roadmap asignado exitosamente." }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error: any) {
        console.error("Error en la API:", error);

        // Manejar otros errores
        return new Response(
            JSON.stringify({ message: "Error procesando la solicitud." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
