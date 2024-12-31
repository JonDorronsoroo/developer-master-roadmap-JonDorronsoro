import type { APIContext } from "astro";
import { promises as fs } from "fs"; // Importar fs/promises de Node.js

export async function GET(context: APIContext) {
    const { searchParams } = new URL(context.request.url);

    const idRoadmap = searchParams.get("idRoadmap");

    if (!idRoadmap) {
        return new Response(
            JSON.stringify({ error: "No se proporcionó un ID de roadmap." }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    try {
        const filePath = `./public/svg/roadmap_${idRoadmap}.svg`;

        // Verificar si el archivo existe
        await fs.access(filePath);

        // Leer el contenido del archivo SVG
        const svgContent = await fs.readFile(filePath, "utf-8");

        // Devolver el archivo como respuesta
        return new Response(svgContent, {
            status: 200,
            headers: {
                "Content-Type": "image/svg+xml",
                "Content-Disposition": `attachment; filename=roadmap_${idRoadmap}.svg`,
            },
        });
    } catch (err) {
        console.error("Error al acceder al archivo:", err);

        return new Response(
            JSON.stringify({ error: "El archivo SVG no existe o no pudo ser accedido." }),
            {
                status: 404,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
