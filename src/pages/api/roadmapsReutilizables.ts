import type { APIContext } from "astro";
import { getElementoReutilizable } from "../../database/consultas";

export async function GET(context: APIContext) {
    const { searchParams } = new URL(context.request.url);

    // Obtener el parámetro 'conocimientos' de la URL
    const conocimientos = searchParams.get("conocimientos"); // Ejemplo: "Git,Gestión de proyectos"

    console.log("KONOZIMINETOK", conocimientos);

    if (!conocimientos) {
        return new Response(
            JSON.stringify({ error: "No se proporcionaron conocimientos." }),
            {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }

    try {
        // Dividir los conocimientos en una lista
        const conocimientosList = conocimientos.split(",").map((item) => item.trim());
        console.log("Conocimientos procesados:", conocimientosList);

        // Realizar la consulta para cada conocimiento
        const roadmapsPromises = conocimientosList.map((conocimiento) =>
            getElementoReutilizable(conocimiento)
        );

        // Resolver todas las promesas y aplanar los resultados
        const results = await Promise.all(roadmapsPromises);
        const roadmaps = results.flat();

        console.log("Roadmaps obtenidos:", roadmaps);

        // Devolver los roadmaps como respuesta JSON
        return new Response(JSON.stringify(roadmaps), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Error al obtener roadmaps por conocimiento:", error);

        return new Response(
            JSON.stringify({ error: "Error al obtener los roadmaps reutilizables." }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }
}
