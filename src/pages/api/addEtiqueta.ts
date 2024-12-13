import type { APIContext } from "astro";
import { insertEtiqueta } from "../../database/consultas";

export async function POST(context: APIContext): Promise<Response> {
    try {
        const body = await context.request.json();

        const tipo = body.tipo?.toString();
        const valor = body.valor?.toString();

        if (!tipo || !valor) {
            return new Response(JSON.stringify({ message: "Faltan campos requeridos (tipo o valor)." }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        try {
            await insertEtiqueta(tipo, valor);
            return new Response(JSON.stringify({ message: "Etiqueta insertada correctamente." }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            if (error instanceof Error && error.message === "Etiqueta duplicada") {
                return new Response(JSON.stringify({ message: "Etiqueta duplicada. No se puede insertar el mismo tipo y valor." }), {
                    status: 409, // Conflict
                    headers: { "Content-Type": "application/json" },
                });
            }

            // Manejo de otros errores
            console.error("Error al insertar la etiqueta:", error);
            return new Response(JSON.stringify({ message: "Error al insertar la etiqueta." }), {
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
