import { crearGrafico } from "./crearGrafico";
import { createComponent, createControl, createLabel, createTextArea } from "./estructuraJson";

// Constantes de colores
const COLOR_GRIS = '8421504';
const COLOR_NEGRO = '0';
const COLOR_VERDE = '248890';
const COLOR_LKS = '16275712';
const COLOR_BLANCO = '16777215';
const COLOR_ROJO = '16711680';
const COLOR_AMARILLO = '16776960';

function extructuraCorrectaJson(json: any): boolean {
    return json && json.mockup && json.mockup.controls && json.mockup.controls.control;
}

// Función para calcular el ancho del texto dinámicamente
const getTextWidth = (text: string, fontSize: number): number => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (context) {
        context.font = `${fontSize}px Arial`;
        return context.measureText(text).width;
    }
    return 0;
};

function primerNivel(json: any, listaCategoriasPrimerNivel: string[], listaCategoriasSegundoNivel: [string, string][], listaPadres: string[]) {
    let limit = listaCategoriasPrimerNivel.length;
    let componentIndexPrimerNivel = 0;
    let yPrimerNivel = 200;
    let xPrimerNivel = 100;
    const maxWidth = 2400; // Usar más del espacio horizontal disponible
    const horizontalSpacing = 800; // Incrementar espaciado horizontal
    const verticalSpacing = 400; // Incrementar espaciado vertical

    console.log(listaCategoriasPrimerNivel);
    let i = 0;
    while (limit > i) {
        const categoria = listaCategoriasPrimerNivel[i];
        const textArea = createTextArea(COLOR_AMARILLO);
        const label = createLabel("25", categoria); // Tamaño letra, texto

        const control0 = createControl("0", "200", "400", textArea, "TextArea", "325", "0", "0", "0", "50");
        const control1 = createControl("1", "25", "100", label, "Label", "88", "24", "11", "1");

        const componentes = createComponent(
            componentIndexPrimerNivel.toString(),
            "70",
            "46",
            "200",
            categoria,
            [control0, control1],
            "121",
            xPrimerNivel.toString(),
            yPrimerNivel.toString(),
            "100"
        );

        console.log(`Categoría: ${categoria}, x: ${xPrimerNivel}, y: ${yPrimerNivel}`);

        componentIndexPrimerNivel++;
        xPrimerNivel += horizontalSpacing; // Espaciado horizontal

        if (xPrimerNivel > maxWidth) {
            // Cambiar a una nueva fila si excede el ancho
            xPrimerNivel = 100; // Reinicia a la primera columna
            yPrimerNivel += verticalSpacing; // Incrementa la posición vertical
        }

        json.mockup.controls.control[json.mockup.controls.control.length] = componentes;
        i++;
    }

    return json;
}

function segundoNivel(json: any, padre: string, listaCategoriasSegundoNivel: [string, string][], ySegundoNivel: number, xSegundoNivel: number) {
    let componentIndexSegundoNivel = 0;
    const maxWidth = 2400; // Usar más del espacio horizontal disponible
    const horizontalSpacing = 700; // Incrementar espaciado horizontal
    const verticalSpacing = 500; // Incrementar espaciado vertical

    const listaHijos = listaCategoriasSegundoNivel.filter((categoriaPadre) => categoriaPadre[1] == padre).map((categoriaPadre) => categoriaPadre[0]);
    let limit = listaHijos?.length ?? 0;
    let i = 0;

    while (limit > i) {
        const categoria = listaHijos[i];
        const textArea = createTextArea(COLOR_BLANCO);
        const control0 = createControl("0", "200", "400", textArea, "TextArea", "325", "0", "0", "0", "50");
        const label = createLabel("20", categoria);
        const control1 = createControl("1", "25", "100", label, "Label", "88", "50", "11", "1");

        const componentes = createComponent(
            componentIndexSegundoNivel.toString(),
            "70",
            "46",
            "200",
            categoria,
            [control0, control1],
            "121",
            xSegundoNivel.toString(),
            ySegundoNivel.toString(),
            "100"
        );

        console.log(`Categoría: ${categoria}, x: ${xSegundoNivel}, y: ${ySegundoNivel}`);

        componentIndexSegundoNivel++;
        xSegundoNivel += horizontalSpacing; // Espaciado horizontal

        if (xSegundoNivel > maxWidth) {
            // Cambiar a una nueva fila
            xSegundoNivel = 100; // Reinicia a la primera columna
            ySegundoNivel += verticalSpacing; // Incrementa la posición vertical
        }

        json.mockup.controls.control[json.mockup.controls.control.length] = componentes;
        i++;
    }

    return json;
}

export function cambiarSegunRol(json: any, categoriasACambiar: string[]): any {
    console.log('ha pasado');
    if (!extructuraCorrectaJson(json)) {
        console.error('Invalid JSON structure. Unable to change colors.');
        return json;
    }

    const modifiedJson = JSON.parse(JSON.stringify(json));

    modifiedJson.mockup.controls.control.forEach((control: { children: { controls: { control: { properties: { text: string; color: string; }; }[]; }; }; }) => {
        if (control.children && control.children.controls) {
            const innerControlLabel = control.children.controls.control[1];
            const innerControlTextArea = control.children.controls.control[0];

            if (innerControlLabel && innerControlLabel.properties && innerControlLabel.properties.text && innerControlTextArea && innerControlTextArea.properties) {
                const text = innerControlLabel.properties.text;
                console.log(categoriasACambiar);
                if (!categoriasACambiar.includes(text)) {
                    const color = determineColorByText(text);
                    innerControlTextArea.properties.color = color; // Modificar el color del cuadrado
                }
            }
        }
    });

    return modifiedJson;
}

function determineColorByText(text: string): string {
    return COLOR_GRIS;
}
