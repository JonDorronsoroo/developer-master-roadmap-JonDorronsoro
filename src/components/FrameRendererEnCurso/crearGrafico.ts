import { createControl, createLabel, createPropertiesFlechas, createTextArea , createComponent, createMockUp, createGlobal} from "./estructuraJson";

const COLOR_GRIS= '8421504';
const COLOR_NEGRO= '0';
const COLOR_VERDE= '248890';
const COLOR_LKS = '16275712';
const COLOR_BLANCO= '16777215';
const COLOR_ROJO = '16711680';
const COLOR_AMARILLO = '16776960';
const COLOR_AZUL = '41983';
const COLOR_NARANJA='16750848'

const centro_X=1000;
let principio_Y_primer_nivel = 0;
let principio_Y_segundo_nivel = 40;

export function crearGrafico(listaCategoriasPrimerNivel:string[],  listaCategoriasSegundoNivel:[string,string][], subTercerNivel:[string,string][]){

    const listaComponentesPrimerNivel = crearCuadrados(listaCategoriasPrimerNivel,listaCategoriasSegundoNivel, subTercerNivel,COLOR_AMARILLO);

    const controls = {control:[]}
    const mockup = createMockUp(controls, "5000","1847","5000","1847","1.0")
    mockup.controls.control=listaComponentesPrimerNivel;

    const entero = createGlobal(mockup)

    return entero
}
export function crearCuadradosSegundoNivel(listaTitulos: [string, string][], padre: string, color: string, yPrimerNivel: number, subTercerNivel: [string, string][]) {
    let listaHijos = listaTitulos.filter((categoriaPadre) => categoriaPadre[1] === padre).map((categoriaPadre) => categoriaPadre[0]);
    const limit = listaHijos.length ?? 0;
    let listaComponentes = [];
    let x = 1000;
    let listaFlechas = [];
    let listaposiciones: number[]=[];


    let i = 0;
    while (limit > i) {
        if (limit === 1) {
            x = 1000;
        } else if(limit === 2){
            x = x - 250;
        } else if(limit<4){

            x = x - 350;
        }else{
            let add= 45*limit;
            x=x-add-250
        }

        const pruebaFlechaInclinada = crearPruebaFlechaInclinada(1, yPrimerNivel+49, x)
        listaFlechas.push(pruebaFlechaInclinada)
  
        const textArea = createTextArea(color);
        const control0 = createControl("0", "200", "400", textArea, "TextArea", "325", "0", "0", "0", "50");
        const label = createLabel("20", listaHijos[i]);
        const control1 = createControl("1", "25", "100", label, "Label", "88", "50", "11", "1");
        const componente = createComponent((i * 100).toString(), "70", "46", "200", listaHijos[i], [control0, control1], "121", (x).toString(), (yPrimerNivel + 100).toString(), "100");
        listaComponentes.push(componente);
        let hijos;
        if(listaposiciones.includes(yPrimerNivel + 100)){
         hijos = crearCuadradosTercerNivel(subTercerNivel, listaHijos[i], COLOR_NARANJA, yPrimerNivel + 190, x-150);
         listaposiciones.push(yPrimerNivel + 160)
        }else{
             hijos = crearCuadradosTercerNivel(subTercerNivel, listaHijos[i], COLOR_AZUL, yPrimerNivel + 100, x-210);
             listaposiciones.push(yPrimerNivel + 100)
        }
        listaComponentes.push(...hijos);
        
        x += 700;
        i++;
        
    }

    return listaFlechas.concat(listaComponentes);
    
}

export function crearCuadradosTercerNivel(listaTitulos: [string,string][],padre:string,color:string,yPrimerNivel:number, x:number){
    let listaHijos = listaTitulos.filter((categoriaPadre)=> categoriaPadre[1]==padre).map((categoriaPadre)=> categoriaPadre[0]);
    const limit = listaHijos.length ?? 0;
    let listaComponentes= []
    let listaFlechas = [];
    let i=0;
    while (limit >i ){
        if(limit>1){
            let add=40*limit;
            x=x-add
        }

        console.log('color'+ color + 'coordenada'+ x)
        const pruebaFlechaInclinada = crearPruebaFlechaInclinadaSegundo(1, yPrimerNivel, x, color)
        listaFlechas.push(pruebaFlechaInclinada)

        const textArea = createTextArea(color);
        const control0 = createControl("0","200","400", textArea, "TextArea", "325", "0", "0", "0", "50");
        const label = createLabel("20", listaHijos[i]);
        const control1= createControl("1","25","100", label,"Label","88","50","11","1")
        const componente = createComponent((i*100).toString(), "70", "46", "200", listaHijos[i], [control0, control1],"121", (x).toString(), (yPrimerNivel+90).toString(),  "100");
        listaComponentes.push(componente);
        x+=450;
        i++;

    }
    return listaFlechas.concat(listaComponentes);
}

function crearPruebaFlechaInclinadaSegundo(i:number, y:number, x:number, color:string){
    console.log(x)
    let controlFlecha;
    if(900<x && x<1250 && color == COLOR_NARANJA ){
        console.log('pasa')
        const properties= createPropertiesFlechas(COLOR_LKS,"0","bottom","false",{x: 120 ,y:0},{x:0.5,y:0},{x:0,y:160},"false",undefined, "dotted")
         controlFlecha = createControl(i.toString(),"199",x.toString(),properties,"Arrow","223",(x+200).toString(),(y-40).toString(),"72","190") 
       
    }else if(x>1250 && color == COLOR_NARANJA){
        const properties= createPropertiesFlechas(COLOR_LKS,"0","bottom","false",{x: -100 ,y:0},{x:0.5,y:0},{x:0,y:160},"false",undefined, "dotted")
         controlFlecha = createControl(i.toString(),"199",x.toString(),properties,"Arrow","223",(x+100).toString(),(y-40).toString(),"72","190") 
       
    }else if(x<560){
        const properties= createPropertiesFlechas(COLOR_LKS,"0","bottom","false",{x: 400 ,y:0},{x:0.5,y:0},{x:0,y:80},"false",undefined, "dotted")
        controlFlecha = createControl(i.toString(),"99",(x).toString(),properties,"Arrow","223",(x).toString(),(y+40).toString(),"72","70") 
       
    
    }else if(560<x && x<720){
        const properties= createPropertiesFlechas(COLOR_AZUL,"0","bottom","false",{x: 200 ,y:0},{x:0.5,y:0},{x:0,y:90},"false",undefined, "dotted")
        controlFlecha = createControl(i.toString(),"79",x.toString(),properties,"Arrow","223",(x+90).toString(),(y+40).toString(),"72","70") 
       
    }else  {
        const properties= createPropertiesFlechas(COLOR_LKS,"0","bottom","false",{x: -100 ,y:0},{x:0.5,y:0},{x:0,y:80},"false",undefined, "dotted")
         controlFlecha = createControl(i.toString(),"79",x.toString(),properties,"Arrow","223",(x+90).toString(),(y+40).toString(),"72","70") 
       
    }
    //La y del 70 para modificar la forma de la curva
    //El 700 para que este en medio, o sea que sería mejor ajustarlo al componente
    //La x para el final, debería ser segun el segundo nivel, ajustarlo tambien
    return controlFlecha
}


function crearCuadrados(listaTitulos: string[],subcategorias:[string,string][], subTercerNivel:[string,string][],color:string){
    let listaConComponentes= [];
    let listaFlechas=[];
    const max = listaTitulos.length;
    let i=0;

    while (max>i){
        if(i%2==0){
            const flechaVerticalD = crearFlechaVerticalDerecha(i+20, principio_Y_primer_nivel+23.5);
        listaFlechas.push(flechaVerticalD);
        }else {
            const flechaVerticalI = crearFlechaVerticalIzquierda(i+20, principio_Y_primer_nivel+23.5)
            listaFlechas.push(flechaVerticalI)
        }
        //Se suma +23.5 para que pase en medio del cuadrado, ya que la posición del cuadrado + la mitad de su ancho
        const flechaHorizontalI= crearFlechaHorizontalI(i+10, principio_Y_primer_nivel+23.5);
        listaFlechas.push(flechaHorizontalI);
        const flechaHorizontalD = crearFlechaHorizontalD(i+10, principio_Y_primer_nivel+23.5)
        listaFlechas.push(flechaHorizontalD)

        const textArea = createTextArea(color)

        const texto = listaTitulos[i];
        const label = createLabel("25", texto)

        const control1= createControl("1", "25","100",label,"Label","88","24","11","1")
        const control0 = createControl("0","200","400", textArea, "TextArea", "400", "0", "0", "0", "50");
        const componente = createComponent(i.toString(), "70", "46", "200",texto, [control0, control1],"121", centro_X.toString(), principio_Y_primer_nivel.toString(),  "100");

        listaConComponentes.push(componente);

        const hijos = crearCuadradosSegundoNivel(subcategorias, texto, COLOR_BLANCO, principio_Y_primer_nivel, subTercerNivel);

        listaConComponentes.push(...hijos);
        i++;
        principio_Y_primer_nivel+=450;

    }

    return listaFlechas.concat(listaConComponentes);

}
function crearPruebaFlechaInclinada(i:number, y:number, x:number){
    let controlFlecha;
    if(560<x && x<800){
        const properties= createPropertiesFlechas(COLOR_LKS,"0","bottom","false",{x: 400 ,y:0},{x:0.5,y:0},{x:0,y:80},"false",undefined, "dotted")
        controlFlecha = createControl(i.toString(),"79",x.toString(),properties,"Arrow","223",(x+100).toString(),y.toString(),"72","70") 
       
    }else if(800<x && x<900){
        const properties= createPropertiesFlechas(COLOR_AZUL,"0","bottom","false",{x: 200 ,y:0},{x:0.5,y:0},{x:0,y:80},"false",undefined, "dotted")
        controlFlecha = createControl(i.toString(),"79",x.toString(),properties,"Arrow","223",(x+100).toString(),y.toString(),"72","70") 
       

    }else if(900<x && x<1250){
        const properties= createPropertiesFlechas(COLOR_LKS,"0","bottom","false",{x: 50 ,y:0},{x:0.5,y:0},{x:0,y:80},"false",undefined, "dotted")
         controlFlecha = createControl(i.toString(),"79",x.toString(),properties,"Arrow","223",(x+100).toString(),y.toString(),"72","70") 
       
    }else{
        const properties= createPropertiesFlechas(COLOR_AZUL,"0","bottom","false",{x: -150 ,y:0},{x:0.5,y:0},{x:0,y:80},"false",undefined, "dotted")
         controlFlecha = createControl(i.toString(),"79",x.toString(),properties,"Arrow","223",(x+100).toString(),y.toString(),"72","70") 
       
    }
    //La y del 70 para modificar la forma de la curva
    //El 700 para que este en medio, o sea que sería mejor ajustarlo al componente
    //La x para el final, debería ser segun el segundo nivel, ajustarlo tambien
    return controlFlecha
}

function crearFlechaHorizontalI(i: number, y: number){
    const properties = createPropertiesFlechas(COLOR_AZUL, "0", "bottom", "false", 
    {x:752, y:0, length:752},{x:0.5, y:0, length:0.5}, {x:0,y:4,length:4},"false","line")
    const controlFlecha = createControl(i.toString(), "4", "752", properties,"Arrow","753", "400",(y).toString(),"0","5")
    return controlFlecha;
}

function crearFlechaHorizontalD(i: number, y: number){
    const properties = createPropertiesFlechas(COLOR_AZUL, "0", "bottom", "false", 
    {x:752, y:0, length:752},{x:0.5, y:0, length:0.5}, {x:0,y:4,length:4},"false","line")
    const controlFlecha = createControl(i.toString(), "4", "752", properties,"Arrow","753", "1000",(y).toString(),"0","5")
    return controlFlecha;
}

function crearFlechaVerticalDerecha(i:number, coordenadaY:number){

    const properties= createPropertiesFlechas(COLOR_AZUL,"0","top","false",{x:0,y:0},{x:0.5,y:0},{x:2,y:451},"false","line")
    //Posicion con x e y
    const controlFlecha = createControl((i*33).toString(),"451","2",properties,"Arrow","4","1752",coordenadaY.toString(),"0","453")

    return controlFlecha;
}

function crearFlechaVerticalIzquierda(i:number, coordenadaY:number){

    const properties= createPropertiesFlechas(COLOR_AZUL,"0","top","false",{x:0,y:0},{x:0.5,y:0},{x:2,y:451},"false","line")
    //Posicion con x e y
    const controlFlecha = createControl((i*33).toString(),"451","2",properties,"Arrow","4","400",(coordenadaY+4).toString(),"0","453")
    return controlFlecha;
}





