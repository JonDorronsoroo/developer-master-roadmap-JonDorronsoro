import type { APIContext } from "astro";
import { updateStepProgressInDB } from "../../database/consultas";

export async function POST(context: APIContext) {
    try {
        const { roadmapId, progressPercentage } = await context.request.json();

        // Validar los datos
        if (!roadmapId || typeof progressPercentage !== "number" || progressPercentage < 0 || progressPercentage > 100) {
            console.error("Datos inválidos recibidos:", { roadmapId, progressPercentage });
            return new Response(JSON.stringify({ message: "Datos inválidos" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        console.log("Datos válidos recibidos:", { roadmapId, progressPercentage });

        // Actualizar directamente el porcentaje completado en la base de datos
        const isUpdated = await updateStepProgressInDB(roadmapId, progressPercentage);

        console.log("Resultado de la actualización en la base de datos:", { isUpdated });

        return new Response(
            JSON.stringify({
                message: "Progreso actualizado correctamente",
                updated: isUpdated,
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
