import type { APIContext } from "astro";
import { assignRoadmap } from "../../database/consultas";

export async function POST(context: APIContext) {
    try {
        console.log("Solicitud recibida en /api/asignarRoadmap");

        const { request } = context;
        const body = await request.json();
        console.log("Datos recibidos:", body);

        const { id_roadmap, id_newcomer, id_mentor } = body;

        if (!id_roadmap || !id_newcomer || !id_mentor) {
            console.error("Datos faltantes en la solicitud.");
            return new Response(
                JSON.stringify({ message: "Todos los campos son requeridos." }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        const result = await assignRoadmap(id_roadmap, id_newcomer, id_mentor);

        if (!result.affectedRows) {
            console.error("No se pudo asignar el roadmap.");
            return new Response(
                JSON.stringify({ message: "No se pudo asignar el roadmap. Intenta nuevamente." }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        console.log("Roadmap asignado exitosamente:", result);

        return new Response(
            JSON.stringify({ message: "Roadmap asignado exitosamente." }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error en la API:", error);
        return new Response(
            JSON.stringify({ message: "Error procesando la solicitud." }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
