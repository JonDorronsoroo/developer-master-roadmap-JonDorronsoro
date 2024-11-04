import type { APIContext } from "astro";
import { updateUserPassWordYRol, updateUserPassWord, updateUserRol } from "../../database/consultas";



export async function POST(context: APIContext): Promise<Response> {

    const data = await context.request.formData();
    
    const password = data.get("password")?.toString();
    const repPassword = data.get("passwordRep")?.toString();
    const job = data.get('job')?.toString();
    const username = data.get('username')?.toString();


    

    if(username){

    if((!password || !repPassword ) && !job){
        
        const errorMessage ="Unknown error";
        return new Response(JSON.stringify({ message: "Las contraseñas son incorrectas y no se ha seleccionado ningún cambio de rol", error: errorMessage }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });

    }else if(password && repPassword && !job){
        
        try{
            if(password === repPassword && password.length>3){
            await updateUserPassWord(username, password)
        return new Response(JSON.stringify({ message: "Se ha guardado el cambio de contraseña" }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    }else{
        const errorMessage = "Password distintas o longitud menor a 4";
        return new Response(JSON.stringify({ message: "Las contraseñas son distintas entre sí o la longitud es menor a cuatro", error: errorMessage }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
    })
}
    }catch(error){
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
         return new Response(JSON.stringify({ message: "Ha habido un error al guardar el cambio de contraseña", error: errorMessage }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
    });

    }

    }else if(job && ((password?.length==0 || !password) || ( repPassword?.length==0 || !repPassword))){
        try{
            await updateUserRol(username, job)
            console.log()
//Bien
    return new Response(JSON.stringify({ message: "Se ha guardado el cambio de puesto correctamente" }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
    });
}catch(error){
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.log(error)
    return new Response(JSON.stringify({ message: "Ha habido un error al guardar el nuevo rol", error: errorMessage }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
    });

}
    }



    else if(password && repPassword && job){
        
        try{
            if(password === repPassword && password.length>3){
                await updateUserPassWordYRol(username, password, job)

                return new Response(JSON.stringify({ message: "Se han guardado los cambios correctamente" }), {
                    status: 200,
                    headers: { "Content-Type": "application/json" }
                });
            }else{
                const errorMessage = "Password distintas o longitud menor a 4";
                return new Response(JSON.stringify({ message: "Las contraseñas son distintas entre sí o la longitud es menor a cuatro", error: errorMessage }), {
                    status: 500,
                    headers: { "Content-Type": "application/json" }
            })

            }
        
    }catch(error){
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return new Response(JSON.stringify({ message: "Ha habido un error al guardar los cambios  o el rol seleccionado no es válido", error: errorMessage }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
    });

    }



}


    }
    
const errorMessage = "Unknown error";
return new Response(JSON.stringify({ message: "Ha habido un error al guardar los cambios el último", error: errorMessage }), {
status: 500,
headers: { "Content-Type": "application/json" }
});

    



}


