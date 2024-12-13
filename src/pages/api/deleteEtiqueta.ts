import type { APIContext } from "astro";
import { deleteEtiquetaById } from "../../database/consultas";

export async function POST(context: APIContext): Promise<Response> {
    try {
        const body = await context.request.json();
        const etiquetaId = body.id;

        if (!etiquetaId) {
            return new Response(JSON.stringify({ message: "ID de etiqueta no proporcionado." }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        try {
            await deleteEtiquetaById(etiquetaId);
            return new Response(JSON.stringify({ message: "Etiqueta eliminada correctamente." }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            console.error("Error al eliminar la etiqueta:", error);
            return new Response(JSON.stringify({ message: "Error al eliminar la etiqueta." }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }
    } catch (error) {
        console.error("Error en el manejo de la solicitud POST:", error);
        return new Response(JSON.stringify({ message: "Error interno del servidor." }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
