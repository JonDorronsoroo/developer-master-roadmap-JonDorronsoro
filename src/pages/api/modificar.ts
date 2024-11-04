import type { APIContext } from "astro";
import { updateCategoriaNombreDescripcion, updateRecurso } from "../../database/consultas";


export async function POST(context:APIContext):Promise<Response> {
    const data = await context.request.formData();
    const formType = data.get('formType')?.toString();
    if (formType === 'escogerCategoria') {
        
        const categoria= encodeURI(data.get('categoriaS')?.toString() || '');


          return context.redirect(`/modificar/contenidoCategoria?title=${categoria}`);
    
        
        }
    else if(formType === 'escogerRecurso') {
        
        const id= data.get('recursoR')?.toString();
          return context.redirect(`/modificar/contenidoRecurso?id=${id}`);
    
        
        }else if(formType === 'escogerRoadmap') {
        
            const id= data.get('roadmapR')?.toString();
              return context.redirect(`/modificar/contenidoItinerario?id=${id}`);
        
            
            }
    else if(formType === 'contenidoCategoria'){
    try{

        const categoria = data.get('categoria');
        const descripcion = data.get('descripcion');
        const categoriaName = data.get('oldCategoria');
        if(categoria && descripcion && categoriaName){

          await updateCategoriaNombreDescripcion( categoriaName.toString() , categoria.toString(), descripcion.toString())
          return new Response(JSON.stringify({ message: "Ha sido correctamente modificado" }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
        
    }else {
        return new Response(JSON.stringify({ message: "Falta algún campo, por favor rellena los necesarios" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
            
                
        }

        
        }catch(e){
            return new Response(JSON.stringify({ message: "Falta algún campo, por favor rellena los necesarios" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }
}

else if(formType === 'contenidoRecurso'){
    try{

        const titulo = data.get('titulo')?.toString();
        const descripcion = data.get('descripcion')?.toString();
        const enlace= data.get('enlace')?.toString()
        const id= data.get('idRecurso')?.toString();
        console.log('ha pasado')
        if(titulo && descripcion && enlace && id){
          await updateRecurso(parseInt(id), titulo, enlace, descripcion);
          return new Response(JSON.stringify({ message: "Ha sido correctamente modificado" }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
        }else {
            
                return new Response(JSON.stringify({ message: "Falta algún campo, por favor rellena los necesarios" }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                });
        }

        
        }catch(e){
            console.log(e)
        }
}

    return context.redirect('/home')
    

        

    }

    