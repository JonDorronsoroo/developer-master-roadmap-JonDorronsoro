import { crearGrafico } from "./crearGrafico";
import { createComponent, createControl, createLabel, createTextArea } from "./estructuraJson";

// TODO: Add more colors and conditions
// TODO: Adaptarlo para cada uno de las posibilidades
/**
 * ! TENER EN CUENTA
 * * IMPORTANTE LOS COLORES NO ESTAN EN HEXADECIMAL #, estan en DECIMAL!!!
 * * pagina para hacer los cambios https://www.mathsisfun.com/hexadecimal-decimal-colors.html
 * */

const COLOR_GRIS= '8421504';
const COLOR_NEGRO= '0';
const COLOR_VERDE= '248890';
const COLOR_LKS = '16275712';
const COLOR_BLANCO= '16777215';
const COLOR_ROJO = '16711680';
const COLOR_AMARILLO = '16776960';

function extructuraCorrectaJson(json: any): boolean{

    return json && json.mockup && json.mockup.controls && json.mockup.controls.control;
}

//SEGUIR CON ESTO
// TODO : Corregir para que funcione correctamente
// TODO: Que los markdown se rellene corrcetamente tambien
// Meter de todo en la pase de datos
//TODO: Empezar con el esquema de Bea

//Menor x, -> izquierda
//Menor y-> arriba


function primerNivel(json:any, listaCategoriasPrimerNivel:string[], listaCategoriasSegundoNivel:[string,string][], listaPadres: string[]){
    let limit = listaCategoriasPrimerNivel.length;
    let componentIndexPrimerNivel= 0;
    let yPrimerNivel=265
    let xPrimerNivel=100, zPrimerNivel=0;
    console.log(listaCategoriasPrimerNivel)
    let i=0
    while (limit > i ){
        //Habria que dejar solo las flechas pero mientras esto
        const categoria = listaCategoriasPrimerNivel[i];
        const textArea = createTextArea(COLOR_AMARILLO);
        const label = createLabel("25", categoria); //Tamño letra, texto

        const control0 = createControl("0","200","400", textArea, "TextArea", "325", "0", "0", "0", "50");
        
        const control1= createControl("1","25","100", label,"Label","88","24","11","1")
        const componentes = createComponent(componentIndexPrimerNivel.toString(), "70", "46", "200", categoria, [control0, control1],"121", xPrimerNivel.toString(), yPrimerNivel.toString(),  "100");
        componentIndexPrimerNivel++;
        yPrimerNivel+=320
        json.mockup.controls.control[json.mockup.controls.control.length] = componentes;
        if(listaPadres.includes(categoria)){
           //json = segundoNivel(json, categoria, listaCategoriasSegundoNivel, yPrimerNivel-190, xPrimerNivel-100);
        }
        i++;
        if(componentIndexPrimerNivel%2!=0){
            xPrimerNivel=1200;
            //yPrimerNivel=yPrimerNivel- 100;
        }else{
            xPrimerNivel=600;
            yPrimerNivel+=100
            console.log(yPrimerNivel)
          
        }  
        
       // x+=200;
        
    }

    return json;
}


function segundoNivel(json:any, padre:string, listaCategoriasSegundoNivel:[string,string][], ySegundoNivel:number, xSegundoNivel:number){
    //let limit = listaCategoriasSegundoNivel.length;
    let componentIndexSegundoNivel= 0;
    let  zSegundoNivel=0;
    let i=0;
    let listaHijos = listaCategoriasSegundoNivel.filter((categoriaPadre) =>categoriaPadre[1] == padre).map((categoriaPadre) => categoriaPadre[0]);

    let limit = listaHijos?.length ?? 0 ;
    while (limit > i){
        //Habria que dejar solo las flechas pero mientras esto
       // createControl(1,2,3,4,5)
        const categoria = listaHijos[i];
        const textArea = createTextArea(COLOR_BLANCO);
        const control0 = createControl("0","200","400", textArea, "TextArea", "325", "0", "0", "0", "50");
        const label = createLabel("20", categoria);
        const control1= createControl("1","25","100", label,"Label","88","50","11","1")
        const componentes = createComponent(componentIndexSegundoNivel.toString(), "70", "46", "200", categoria, [control0, control1],"121", xSegundoNivel.toString(), ySegundoNivel.toString(),  "100");
        componentIndexSegundoNivel++;
        xSegundoNivel+=350;
       // x+=200;

        json.mockup.controls.control[json.mockup.controls.control.length] = componentes;
        
        i++;;
    }


    return json;
}




//Cambia el color segun el texto
export function cambiarSegunRol(json: any, categoriasACambiar:string[]): any {
    console.log('ha pasod')
  if (!extructuraCorrectaJson(json) ){
      console.error('Invalid JSON structure. Unable to change colors.');
      return json;
  }

  console.log(json)
  const modifiedJson = JSON.parse(JSON.stringify(json));

  modifiedJson.mockup.controls.control.forEach((control: { children: { controls: { control: { properties: { text: string; color: string; }; }[]; }; }; }) => {
    if (control.children && control.children.controls) {
        // Accessing the second control element
        const innerControlLabel = control.children.controls.control[1];
        const innerControlTextArea = control.children.controls.control[0];
        //El cuadrado
        if (innerControlLabel && innerControlLabel.properties && innerControlLabel.properties.text && innerControlTextArea && innerControlTextArea.properties) {
            
            const text = innerControlLabel.properties.text;
            console.log(categoriasACambiar)
            if(!categoriasACambiar.includes(text)){
                const color = determineColorByText(text);
                innerControlTextArea.properties.color = color; //Para modificar el color del cuadrado
            }
            
            //innerControlLabel.properties.color = color; // Para modificar el color del texto
            //innerControlTextArea.properties.color = color; //Para modificar el color del cuadrado
          }
    }
});

  return modifiedJson;
}

function determineColorByText(text:string){
    return COLOR_GRIS;

}
/**
 function determineColorByText(text: string, puesto: string): string  {
    var cambiamos = false;
    var i =0;
    if(puesto.match('junior')){
        while (!cambiamos && i<= categoriaJunior.length ) {
            cambiamos = text.toLowerCase().includes(categoriaJunior[i]);
            i++;
        }
        return cambiamos ? COLOR_LKS : COLOR_GRIS;
    }else if(puesto='senior'){
        while (!cambiamos && i<= categoriaSenior.length ) {
            cambiamos = text.toLowerCase().includes(categoriaSenior[i]);
            i++;
        }
        return cambiamos ? COLOR_LKS : COLOR_GRIS;
    }else {
            return COLOR_ROJO;
    }
    
}
*/


/////////////////////////////////////////////////////////////7
