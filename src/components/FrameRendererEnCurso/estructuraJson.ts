interface Welcome {
    mockup: Mockup;
}
export function createGlobal( mockup: Mockup): Welcome {
    return {
        mockup
};
}

interface Mockup {
    controls:  Controls;
    measuredH: string;
    measuredW: string;
    mockupH:   string;
    mockupW:   string;
    version:   string;
}

export function createMockUp(
    controls: Controls,
    measuredH: string,
    measuredW: string,
    mockupH: string,
    mockupW: string,
    version: string
): Mockup{
    return {
        controls,
        measuredH,
        measuredW,
        mockupH,
        mockupW,
        version
    };
    
    
}

interface Controls {
    control: Control[];
}

interface Control {
    ID: string;
    h?: string;
    measuredH: string;
    measuredW: string;
    properties:  TextArea | Label | Properties | { [key: string]: string };
    typeID: string;
    w: string;
    x: string;
    y: string;
    zOrder: string;
}

export function createControl(
    ID:  string,
    measuredH: string,
    measuredW:  string,
    properties : TextArea | Label |Properties, //| Leyenda,
    typeID: "TextArea" | "Label" | "Arrow",// "Icon" | "Canvas"
    w: string,
    x: string, //CAMBIA
    y: string, //Interfiere con la inclinacion
    zOrder: string, // Para que este encima o debajo
    h?: string,
): Control {
    return {
        ID,
        h,
        measuredH,
        measuredW,
        properties,
        typeID,
        w,
        x,
        y,
        zOrder
    };
}


interface Properties {
    color:      string;
    curvature:  string;
    direction:  string;
    leftArrow:  string;
    p0:         { x: number, y: number, length?: number};
    p1:         {x: number, y: number,length?: number},
    p2:         {x: number, y: number,length?: number},
    rightArrow: string;
    shape?:      string;
    stroke?:     string;
    text?:       string;
}

export function createPropertiesFlechas(
    color: string,
    curvature: string,
    direction: string,
    leftArrow: string,
    p0: {x: number, y: number, length?: number},
    p1: {x: number, y: number, length?: number},
    p2: {x: number, y: number, length?: number},
    rightArrow: string,
    shape?: "line",
    stroke?: "dotted",
    //text?: string
): Properties {
    return {
        color,
        curvature,
        direction,
        leftArrow,
        p0,
        p1,
        p2,
        rightArrow,
        shape,
        stroke,
        //text
    }
}


interface TextArea{
    color: string;
}


export function createTextArea(color: string): TextArea {
    return {
        color
    };
}


interface Label{
    size: string;
    text: string;
}
export function createLabel(size: string, text: string): Label {
    return {
        size,
        text
    };
}

interface Children {
    controls: Controls;
}

interface Component {
    ID: string;
    children: Children;
    h: string;
    measuredH: string;
    measuredW: string;
    properties: { [key: string]: string };
    typeID: string;
    w: string;
    x: string;
    y: string;
    zOrder: string;
}

export function createComponent(
    ID: string,
    h: string,
    measuredH: string,
    measuredW: string,
    controlName: string,
    controls: Control[],
    w: string,
    x: string,
    y: string,
    zOrder: string
): Component {
    return {
        ID,
        children: {
            controls: {
                control: controls
            }
        },
        h,
        measuredH,
        measuredW,
        properties: { controlName },
        typeID: "__group__",
        w,
        x,
        y,
        zOrder
    };
}


////////////////////////////////////////////////////////////////
//LEYENDA
///////////////////////////////////////////////////////////////7
export interface Icon {
    ID:   string;
    size: string;
}

export interface Leyenda {
    size?:  string;
    text?:  string;
    color?: string;
    icon?:  Icon;
}


const COLOR_ROJO = '16711680';
const label = createLabel("20", 'Prueba');
const textArea = createTextArea(COLOR_ROJO);
const control0 = createControl("0","200","400", textArea, "TextArea", "325", "0", "0", "0", "50");
const control1= createControl("1","25","100", label,"Label","88","50","11","1")
const componentes = createComponent('0', "70", "46", "200",'Prueba', [control0, control1],"121",'0', '100',  "0");



//const propiedades= createPropertiesFlechas('16711680', '0', '0', '0', {x: 0, y: 0, length:0}, {x: 0, y: 0,length:0}, {x: 0, y: 0,length:0}, '0', '0');
//const controlFlecha = createControl("0","200","400", propiedades, "Arrow", "325", "0", "0", "0", "50");

const controls = {control: []};
const mockup = createMockUp(controls, "100", "100", "100", "100", "1.0");

//mockup.controls.control[mockup.controls.control.length] = controlFlecha;

mockup.controls.control[mockup.controls.control.length] = componentes;

//const global = createGlobal(mockup);

//console.log(global);


