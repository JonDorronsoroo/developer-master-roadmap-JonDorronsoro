// src/pages/api/etiquetas.js

import type { APIContext } from "astro";
import { getEtiquetas } from "../../database/consultas";

export async function GET(context: APIContext) {
    try {
        const etiquetas = await getEtiquetas();
        return new Response(JSON.stringify(etiquetas), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error obteniendo etiquetas:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return new Response(JSON.stringify({ message: errorMessage }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
