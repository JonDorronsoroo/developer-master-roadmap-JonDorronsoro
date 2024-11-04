import type { APIContext } from "astro";
import { insertNuevoRoadmap, insertRelacionRoadmapCategoria } from "../../database/consultas";

export async function POST(context: APIContext): Promise<Response> {
    const data = await context.request.formData();    
    const titulo = data.get("titulo")?.toString();
    const descripcion = data.get("descripcion")?.toString();

    // Initialize an array to store checkbox input values
    const checkboxValues = [];

    // Iterate through the entries of the FormData object
    for (const [key, value] of data.entries()) {
        // Check if the key starts with 'input-'
        if (key.startsWith('input-')) {
            // Add the key-value pair to the checkboxValues array
            checkboxValues.push({ name: key.split('input-')[1], value: value.toString() });
        }
    }
    if(titulo && descripcion && checkboxValues){
        try {
            const resultId = await insertNuevoRoadmap(titulo, descripcion);
            if(resultId==0){
                checkboxValues.map((componente)=>{
                    if(!componente.value){
                        insertRelacionRoadmapCategoria(titulo, componente.name)
                    }else{
                        insertRelacionRoadmapCategoria(titulo, componente.name, parseInt(componente.value))
                    }
                    
                })
                return new Response(JSON.stringify({ message: "Ha sido correctamente insertado" }), {
                    status: 200,
                    headers: { "Content-Type": "application/json" }
                });
            
            }else{
                return new Response(JSON.stringify({ message: "Ha habido algún error" }), {
                    status: 300,
                    headers: { "Content-Type": "application/json" }
                });

            }
            
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            return new Response(JSON.stringify({ message: "Ya existe una categoría con ese título", error: errorMessage }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }
    }else{
   

    return new Response(JSON.stringify({ message: "Ha habido algún error" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
    });
}
}