import type { APIContext } from "astro";
import { insertResource, insertRelacionRecursoCategoria, getRecursoIdByTitle } from "../../database/consultas";
export async function POST(context: APIContext): Promise<Response> {
    const data = await context.request.formData();

    const titulo = data.get("titulo")?.toString();
    const enlace = data.get("enlaceFichero")?.toString();
    const interno = data.get("internoExterno")?.toString() === "true" ? true : false;
    const categoria = data.get("categoria")?.toString();


    //Opcionales
    const descripcion = data.get("descripcion")?.toString();
    const dificultad = data.get("dificultad")?.toString();
    const idioma = data.get("idioma")?.toString();
      const tipo = data.get("tipo")?.toString();
      const formato = data.get("formato")?.toString();
      const recursoRelacion = data.get("recursoRelacion")?.toString();


      let idRecurso ;
      if(titulo && enlace && interno && categoria){
        
        try{
            
            if(!recursoRelacion){
                console.log("ha pasdo")
            idRecurso = await insertResource(titulo, enlace, interno, descripcion ?? null , dificultad ?? null, tipo ?? null, formato ?? null,idioma ?? null,   null);
            }else{
                let idrelacion = await getRecursoIdByTitle(recursoRelacion)
                idRecurso = await insertResource(titulo, enlace, interno, descripcion ?? null , dificultad ?? null, tipo ?? null, formato ?? null,idioma ?? null,  idrelacion ?? null);
            }}catch(error){
                console.log(error)
            const errorMessage = error instanceof Error ? 
            error.message : "Unknown error";
                return new Response(JSON.stringify({ message: "Ha ocurrido algún fallo al insertado recurso, problemente título repetido", error: errorMessage }), {
                    status: 500,
                    headers: { "Content-Type": "application/json" }
                });
            }

            try{
            if(idRecurso){
               
                    await insertRelacionRecursoCategoria(idRecurso, categoria);
                    return new Response(JSON.stringify({ message: "Ha sido correctamente insertado" }), {
                        status: 200,
                        headers: { "Content-Type": "application/json" }
                    });
                }else{
                    

                    return new Response(JSON.stringify({ message: "Ha ocurrido algún fallo al insertado recurso" }), {
                        status: 500,
                        headers: { "Content-Type": "application/json" }
                    });
                }}catch(error){
                    console.log(error)

            const errorMessage = error instanceof Error ? 
            error.message : "Unknown error";
                    return new Response(JSON.stringify({ message: "Ha ocurrido algún fallo al insertado recurso", error: errorMessage }), {
                        status: 500,
                        headers: { "Content-Type": "application/json" }
                    });
                }

            
        
        
            
    }else {
    return new Response(JSON.stringify({ message: "Falta algún campo, por favor rellena los necesarios" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
    });
}
}

