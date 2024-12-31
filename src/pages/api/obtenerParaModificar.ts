import type { APIContext } from "astro";
import {
    getComponentesCategoriaPrimerNivelSoloRoadmap,
    categoriasNivel2PorPadre,
    categoriasNivel3PorPadre,
    getComponentesCategoriaSegundoNivel,
    getComponentesCategoriaTercerNivel,
    getEtiquetasByRoadmapId,
    getElementoReutilizable // Importar la nueva función
} from "../../database/consultas";

export async function GET(context: APIContext) {
    const { searchParams } = new URL(context.request.url);

    // Obtener los parámetros desde la URL
    const roadmap = searchParams.get("roadmap");
    const categoriaNivel1 = searchParams.get("categoriaNivel1");
    const categoriaNivel2 = searchParams.get("categoriaNivel2");

    console.log("Iniciando procesamiento de API:");
    console.log("Parámetros recibidos - Roadmap:", roadmap, "Categoría Nivel 1:", categoriaNivel1, "Categoría Nivel 2:", categoriaNivel2);

    // Validar el parámetro 'roadmap'
    if (!roadmap) {
        console.error("El parámetro 'roadmap' es necesario.");
        return new Response(
            JSON.stringify({ message: "El parámetro 'roadmap' es necesario." }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    try {
        // Obtener etiquetas y convertir a un array si no lo son
        console.log(`Obteniendo etiquetas para el roadmap con ID: ${roadmap}`);
        const etiquetas = await getEtiquetasByRoadmapId(roadmap);
        console.log("Etiquetas obtenidas (crudas):", etiquetas);

        const elementosReutilizables = [];
        if (etiquetas && typeof etiquetas === "object") {
            const etiquetasArray = Object.values(etiquetas); // Convertir a array de valores
            console.log("Etiquetas convertidas a array:", etiquetasArray);

            for (const etiqueta of etiquetasArray) {
                if (etiqueta && typeof etiqueta.valorEtiqueta === "string") {
                    console.log(`Obteniendo elementos reutilizables para la etiqueta: ${etiqueta.valorEtiqueta}`);

                    try {
                        const elementos = await getElementoReutilizable(etiqueta.valorEtiqueta);
                        console.log(
                            `Elementos reutilizables obtenidos para la etiqueta '${etiqueta.valorEtiqueta}':`,
                            elementos
                        );

                        // Verificar que los elementos sean un array antes de usarlos
                        if (Array.isArray(elementos)) {
                            elementosReutilizables.push(...elementos);
                        } else {
                            console.warn(
                                `Los datos obtenidos no son un array para la etiqueta '${etiqueta.valorEtiqueta}':`,
                                elementos
                            );
                        }
                    } catch (error) {
                        console.error(
                            `Error al obtener elementos reutilizables para la etiqueta '${etiqueta.valorEtiqueta}':`,
                            error
                        );
                    }
                } else {
                    console.warn(
                        "Etiqueta no tiene un campo 'valorEtiqueta' válido o el formato es incorrecto:",
                        etiqueta
                    );
                }
            }
        } else {
            console.warn("Etiquetas no es un array ni un objeto con la estructura esperada.");
        }

        console.log("Todos los elementos reutilizables obtenidos:", elementosReutilizables);

        // Obtener categorías de nivel 1
        if (!categoriaNivel1 && !categoriaNivel2) {
            console.log("Obteniendo categorías de nivel 1...");
            const categoriasNivel1 = await getComponentesCategoriaPrimerNivelSoloRoadmap(roadmap);
            console.log("Categorías de nivel 1 obtenidas:", categoriasNivel1);

            if (!Array.isArray(categoriasNivel1) || categoriasNivel1.length === 0) {
                console.warn("No se encontraron categorías de nivel 1.");
                return new Response(
                    JSON.stringify({ message: "No se encontraron categorías de nivel 1." }),
                    { status: 404, headers: { "Content-Type": "application/json" } }
                );
            }

            console.log("Devolviendo categorías de nivel 1 y elementos reutilizables...");
            return new Response(
                JSON.stringify({
                    categoriasNivel1,
                    elementosReutilizables,
                }),
                {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }
        // Obtener categorías generales y asociadas de nivel 2
        if (categoriaNivel1 && !categoriaNivel2) {
            console.log(`Obteniendo categorías generales y asociadas de nivel 2 para la categoría: ${categoriaNivel1}`);

            const categoriasNivel2Generales = await categoriasNivel2PorPadre(categoriaNivel1);
            const categoriasNivel2Asociadas = await getComponentesCategoriaSegundoNivel(roadmap);

            console.log("Categorías Generales de Nivel 2:", categoriasNivel2Generales);
            console.log("Categorías Asociadas de Nivel 2:", categoriasNivel2Asociadas);

            return new Response(JSON.stringify({
                generales: categoriasNivel2Generales,
                asociadas: categoriasNivel2Asociadas,
            }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Obtener categorías generales y asociadas de nivel 3
        if (categoriaNivel2 && categoriaNivel1) {
            console.log(`Obteniendo categorías generales y asociadas de nivel 3 para la categoría: ${categoriaNivel2} y roadmap ${roadmap}`);

            const categoriasNivel3Generales = await categoriasNivel3PorPadre(categoriaNivel2);
            const categoriasNivel3Asociadas = await getComponentesCategoriaTercerNivel(roadmap, categoriaNivel1);

            console.log("Generales de Nivel 3:", categoriasNivel3Generales);
            console.log("Asociadas de Nivel 3:", categoriasNivel3Asociadas);

            return new Response(
                JSON.stringify({ generales: categoriasNivel3Generales, asociadas: categoriasNivel3Asociadas }),
                { status: 200, headers: { "Content-Type": "application/json" } }
            );
        }

        console.error("Faltan parámetros necesarios para procesar la solicitud.");
        return new Response(
            JSON.stringify({ message: "Parámetros insuficientes para procesar la solicitud." }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );

    } catch (error) {
        console.error("Error en el procesamiento de la API:", error);
        const errorMessage = error instanceof Error ? error.message : "Error desconocido";

        return new Response(
            JSON.stringify({ message: errorMessage || "Error interno del servidor." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
