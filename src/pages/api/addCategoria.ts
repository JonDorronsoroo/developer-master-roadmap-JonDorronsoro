import type { APIContext } from "astro";
import { insertCategoria, insertCategoriaRol } from "../../database/consultas";




export async function POST(context: APIContext): Promise<Response> {
    const data = await context.request.formData();

    const titulo = data.get("titulo")?.toString();
    const descripcion = data.get("descripcion")?.toString();
    const categoriaPadre = data.get("categoriaPadre")?.toString();
    const rolCategoria = data.getAll("rolCategoria").map(item => item.toString());
    const editorContent = data.get('content');

    console.log(editorContent); 


    if (titulo && descripcion && categoriaPadre) {
        try {
           
           const nombre =  await insertCategoria(titulo, descripcion, categoriaPadre);
            if(rolCategoria.length>0){
                rolCategoria.map(async (rol)=>
             await insertCategoriaRol(nombre, rol)   

                )
            }
            return new Response(JSON.stringify({ message: "Ha sido correctamente insertado" }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        } catch (error) {
            console.log(error)
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            return new Response(JSON.stringify({ message: "Ya existe una categoría con ese título", error: errorMessage }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }
    }else if(titulo && descripcion){
        try {
            const nombre= await insertCategoria(titulo, descripcion, 'Global');
            if(rolCategoria){
                rolCategoria.map(async (rol)=>
                    await insertCategoriaRol(nombre, rol)   
       
                       )
                    }
            return new Response(JSON.stringify({ message: "Ha sido correctamente insertado una GLOBAL" }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        } catch (error) {
            console.log(error)

            const errorMessage = error instanceof Error ? 
            error.message : "Unknown error";
            return new Response(JSON.stringify({ message: "Ya existe una categoría con ese título", error: errorMessage }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }
    
    } else {
        return new Response(JSON.stringify({ message: "Falta algún campo, por favor rellena los necesarios" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }

    
}


