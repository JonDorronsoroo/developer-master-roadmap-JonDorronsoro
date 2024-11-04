import type { APIContext } from "astro";
import { getRecursoById, insertOpinionExterno, ProblemaBD } from "../../database/consultas";


//TODO: FALTA IMPLEMENTAR LO DE GUARDAR LA CALIFICACION EN LA BASE DE DATOS
//TODO: MUY IMPORTANTE
export async function POST(context:APIContext):Promise<Response> {
    const data = await context.request.formData();
    const formType = data.get('formType')?.toString();
    if (formType === 'escogerRecurso') {
      
        try{
        const recurso = data.get('recursoR')?.toString();
        if(recurso){
          const id = parseInt(recurso);
          
          const elegido = await getRecursoById(id);
        
        if(elegido?.interno){
          return context.redirect(`/opinar/calificarInterno?id='${id}'`);
        }else{  
          return context.redirect(`/opinar/calificarExterno?id=${id}`);
    
        }
        }else{
          return context.redirect(`/error`);
        }
        
        
        
      }catch(error){
        return context.redirect(`/error`);
      }
    
    
    }else if(formType === 'calificarInterno'){
      const idRecurso = data.get('idRecurso')?.toString();
      if(idRecurso){
        const user= data.get('user')?.toString() || 'null';
        const fecha =  new Date().toISOString().slice(0, 19).replace('T', ' ');
          const  valoracionGlobal = parseInt(data.get('valoracion')?.toString() || '0');
          const dificultad = parseInt(data.get('dificultad')?.toString() || '0');
          const topTema = data.get('topTema')?.toString() || 'null';
     
          //TODO: Try y catch es decir meter en la BD adecuadamente, fijarse bien en los parametros
          //Es que no se cuales son y me ha dado un poco de no seque ponerme a buscar 
          //Es tarde :(
    }else{
        return context.redirect(`/error`);
    }

      

        
    }else{
      
      const idRecurso =data.get('idRecurso')?.toString()
      if(idRecurso){
        const user= data.get('user')?.toString() || 'null';
      const fecha =  new Date().toISOString().slice(0, 19).replace('T', ' ');
        const  valoracionGlobal = parseInt(data.get('valoracion')?.toString() || '0');
        const dificultad = parseInt(data.get('dificultad')?.toString() || '0');
       const topTema = data.get('topTema')?.toString() || 'null';


        const n_beneficioso= parseInt(data.get('beneficioso')?.toString() || '0');
        const problematico= data.get('problematico')?.toString().toLocaleLowerCase() === "true" ? 1 : 0;
        const recomendado= data.get('recomendado')?.toString().toLocaleLowerCase() === "true" ? 1 : 0;
      const tiempo = parseFloat(data.get('horas')?.toString() || '0');
     const resolutivo = parseInt(data.get('resolutivo')?.toString() || '0');
      const problema = data.get('problema')?.toString() || 'null';
      const extra = data.get('extra')?.toString() || 'null';

     

      try{
 
          await insertOpinionExterno(user, parseInt(idRecurso), fecha,valoracionGlobal,dificultad,topTema,problematico,n_beneficioso,recomendado,tiempo,resolutivo,problema,extra)
          return new Response(JSON.stringify({ message: "Ha sido correctamente insertada tu opinión. Gracias por participar" }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
        
        }catch(e){
          if (e instanceof ProblemaBD){
            return new Response(JSON.stringify({ message: "Fallo en la consulta. Problemente ya has calificado este recurso." }), {
              status: 400,
              headers: { "Content-Type": "application/json" }
          });

          }else{
            return new Response(JSON.stringify({ message: "Fallo ageno a la BD" }), {
              status: 400,
              headers: { "Content-Type": "application/json" }
          });
          }
            
        }


    }else{
        return context.redirect(`/error`);
    }
  }


    }