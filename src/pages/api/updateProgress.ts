import type { APIContext } from "astro";
import { updateStepProgressInDB } from "../../database/consultas";

export async function POST(context: APIContext) {
    try {
        const { roadmapId, completedSteps } = await context.request.json();

        // Validar los datos
        if (!roadmapId || !Array.isArray(completedSteps)) {
            console.error("Datos inválidos recibidos:", { roadmapId, completedSteps });
            return new Response(JSON.stringify({ message: "Datos inválidos" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        console.log("Datos válidos recibidos:", {
            roadmapId,
            completedSteps,
        });

        const isCompleted = await updateStepProgressInDB(roadmapId, completedSteps);

        console.log("Resultado de la actualización en la base de datos:", { isCompleted });

        return new Response(
            JSON.stringify({
                message: "Progreso actualizado correctamente",
                completed: isCompleted,
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error al actualizar el progreso:", error);
        return new Response(
            JSON.stringify({ message: "Error interno del servidor" }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
