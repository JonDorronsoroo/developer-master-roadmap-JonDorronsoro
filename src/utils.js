export function setUpEditorFormHandle(idForm) {
    const form = document.getElementById(idForm)

    form.addEventListener('formdata', (event) => {
        const content = document.getElementById('content');
        console.log('EDITOR')
        event.formData.append('content', content.innerHTML);
    });
}


export function updateOptionsVisibility(inputId, dropdownId, hiddenInputId) {
    const inputElement = document.getElementById(inputId);
    const hiddenInput = document.getElementById(hiddenInputId);

    if (!inputElement || !hiddenInput) {
        console.error("Elementos no encontrados:", { inputId, hiddenInputId });
        return;
    }

    const searchText = inputElement.value.toLowerCase();
    const dropdownOptions = document.querySelectorAll(`#${dropdownId} li`);

    dropdownOptions.forEach(option => {
        const optionText = option.textContent?.toLowerCase();
        option.style.display = (searchText === '' || optionText.includes(searchText)) ? '' : 'none';
    });

    if (searchText === '') {
        hiddenInput.value = ''; // Solo se asigna si hiddenInput existe
        dropdownOptions.forEach(option => {
            option.style.display = '';
        });
    }
}


export function setupDropdown(inputId, dropdownId, hiddenInputId) {
    const inputBox = document.getElementById(inputId);
    const dropdown = document.getElementById(dropdownId);
    const hiddenInput = document.getElementById(hiddenInputId);

    inputBox?.addEventListener('click', function () {
        dropdown.style.display = 'block';
        updateOptionsVisibility(inputId, dropdownId);
    });

    inputBox?.addEventListener('input', function (event) {
        updateOptionsVisibility(inputId, dropdownId);
    });

    document.addEventListener('click', function (event) {
        if (!dropdown.contains(event.target) && event.target !== inputBox) {
            dropdown.style.display = 'none';
        }
    });

    dropdown.addEventListener('click', function (event) {
        const selectedOption = event.target;
        if (selectedOption.tagName === 'LI') {
            const value = selectedOption.getAttribute('value');
            if (value) {

                if (value.toString().split('.')[1]) {
                    console.log(value)
                    const values = value.toString().split('.')
                    inputBox.value = values[1];
                    hiddenInput.value = values[0];
                    dropdown.style.display = 'none';
                } else {
                    inputBox.value = value;
                    hiddenInput.value = value;
                    dropdown.style.display = 'none';
                }


            }
        }
    });
}

/*
export async function handleFormSubmit(event, apiUrl, formId) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const response = await fetch(apiUrl, { method: 'POST', body: formData });
    const result = await response.json();

    const correctMessageElement = document.getElementById('correct-message');
    const errorMessageElement = document.getElementById('error-message');




    if (response.ok) {
        if (formId == 'roadmapForm') {
            document.getElementById('checkboxList').innerHTML = '';
            document.getElementById('checkboxListSegundo').innerHTML = '';
            document.getElementById('checkboxListTercero').innerHTML = '';
        }
        correctMessageElement.textContent = result.message;
        errorMessageElement.textContent = '';
        correctMessageElement.classList.add('show');
        errorMessageElement.classList.remove('show');
        form.reset()

    } else {
        errorMessageElement.textContent = result.message || 'Error';
        correctMessageElement.textContent = '';
        errorMessageElement.classList.add('show');
        correctMessageElement.classList.remove('show');
    }
}

*/


export function setupFormSubmission(formId, apiUrl) {
    const form = document.getElementById(formId);
    form?.addEventListener('submit', function (event) {
        handleFormSubmit(event, apiUrl, formId);
    });
}

export async function handleFormSubmit(event, apiUrl) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    // Logs para depurar
    console.log("Antes de agregar categorías:");
    formData.forEach((value, key) => console.log(`${key}:`, value));

    // Extraer y agregar categorías
    const ordenCategorias = [];
    document.querySelectorAll('#ordenCategorias li').forEach((item, index) => {
        ordenCategorias.push({
            id: item.getAttribute('data-id'), // ID de la categoría o roadmap
            orden: index + 1, // Orden
            tipo: item.getAttribute('data-prefijo')?.trim().replace(':', '') || "Sin tipo" // Tipo (Categoría o Roadmap reutilizable)
        });
    });
    formData.append('ordenCategorias', JSON.stringify(ordenCategorias));

    const selectedCategoriasNivel2 = [];
    document.querySelectorAll('#selectedCategoriasNivel2 div').forEach((item) => {
        selectedCategoriasNivel2.push({ name: item.textContent.trim() });
    });
    formData.append('selectedCategoriasNivel2', JSON.stringify(selectedCategoriasNivel2));

    const selectedCategoriasNivel3 = [];
    document.querySelectorAll('#selectedCategoriasNivel3 div').forEach((item) => {
        selectedCategoriasNivel3.push({ name: item.textContent.trim() });
    });
    formData.append('selectedCategoriasNivel3', JSON.stringify(selectedCategoriasNivel3));

    // Logs para verificar datos
    console.log("Datos enviados:");
    formData.forEach((value, key) => console.log(`${key}:`, value));

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            body: formData,
        });

        // Intenta parsear el JSON de la respuesta
        const result = await response.json();
        console.log("Respuesta de la API:", result);

        if (response.ok) {
            // Si la respuesta fue exitosa (código 200-299)
            alert("Formulario enviado con éxito");
        } else {
            // Si la respuesta no fue exitosa (código 400 o 500)
            const errorMessage = result.error || "Error desconocido"; // Ajusta según el campo devuelto por tu backend
            alert("Error en la solicitud: " + errorMessage);
        }
    } catch (error) {
        // Si ocurre un error al realizar la llamada o al procesar la respuesta
        console.error("Error al enviar los datos:", error);
        alert("Error al enviar el formulario. Inténtalo de nuevo.");
    }

}





// utils.js
export async function cargarEtiquetas() {
    const dropdownOptions = document.getElementById("dropdown-options");
    const dropdown = document.getElementById("custom-dropdown");
    dropdown.style.display = "block"; // Mostrar dropdown

    try {
        const response = await fetch(`/api/etiquetas`);
        if (response.ok) {
            const etiquetas = await response.json();
            console.log("Etiquetas obtenidas:", etiquetas); // Ver si la respuesta tiene las etiquetas

            dropdownOptions.innerHTML = ""; // Limpia el contenido previo

            etiquetas.forEach((etiqueta) => {
                const li = document.createElement("li");
                li.style.padding = "5px";
                li.style.listStyleType = "none";

                // Crea un contenedor para alinear el checkbox y el texto
                const label = document.createElement("label");
                label.className = "checkbox-label"; // Clase para estilos
                label.htmlFor = `etiqueta-${etiqueta.tipo}-${etiqueta.valorEtiqueta}`;

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.value = `${etiqueta.tipo}:${etiqueta.valorEtiqueta}`;
                checkbox.id = `etiqueta-${etiqueta.tipo}-${etiqueta.valorEtiqueta}`;
                checkbox.addEventListener("change", handleEtiquetaSelection);

                const textNode = document.createTextNode(`${etiqueta.tipo}: ${etiqueta.valorEtiqueta}`);

                // Añade checkbox y texto al label
                label.appendChild(checkbox);
                label.appendChild(textNode);

                // Añade el label al li
                li.appendChild(label);

                // Agrega el elemento a la lista del dropdown
                dropdownOptions.appendChild(li);
            });


        } else {
            console.error("Error al obtener etiquetas:", response.statusText);
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
}

function handleEtiquetaSelection(event) {
    const selectedEtiquetasContainer =
        document.getElementById("selectedEtiquetas");
    const checkbox = event.target;
    const etiquetaValue = checkbox.value; // Tipo:valor

    // Separar tipo y valor
    const [tipo, valor] = etiquetaValue.split(":");
    console.log(tipo);
    console.log(valor);

    // Si la etiqueta está seleccionada
    if (checkbox.checked) {
        const etiquetaDiv = document.createElement("div");
        etiquetaDiv.className = "etiqueta-selection";
        etiquetaDiv.id = `selected-${etiquetaValue}`;

        const etiquetaLabel = document.createElement("span");
        etiquetaLabel.textContent = `${tipo}: ${valor}`; // Mostramos tipo y valor juntos
        console.log(etiquetaLabel);
        etiquetaDiv.appendChild(etiquetaLabel);
        selectedEtiquetasContainer.appendChild(etiquetaDiv);
        console.log(selectedEtiquetasContainer);

        // Actualizar el valor del campo oculto
        const selectedEtiquetas = Array.from(
            selectedEtiquetasContainer.getElementsByClassName(
                "etiqueta-selection",
            ),
        ).map((div) =>
            div.id.replace("selected-", "").split(":").join("-"),
        ); // Crear valor para el campo hidden
        document.getElementById("selectedEtiquetas").value =
            selectedEtiquetas.join(",");
    } else {
        // Si la etiqueta se deselecciona
        const etiquetaDiv = document.getElementById(
            `selected-${etiquetaValue}`,
        );
        if (etiquetaDiv) {
            selectedEtiquetasContainer.removeChild(etiquetaDiv);

            // Actualizar el valor del campo oculto
            const selectedEtiquetas = Array.from(
                selectedEtiquetasContainer.getElementsByClassName(
                    "etiqueta-selection",
                ),
            ).map((div) =>
                div.id.replace("selected-", "").split(":").join("-"),
            );
            document.getElementById("selectedEtiquetas").value =
                selectedEtiquetas.join(",");
        }
    }
    updateCategoriasNivel1();
    updateRoadmapsReutilizables();
    updateCategoriasNivel11()

}

async function updateCategoriasNivel1() {
    console.log("Actualizando categorías de nivel 1");

    const selectedEtiquetas = Array.from(
        document.getElementsByClassName("etiqueta-selection")
    ).map((div) => div.id.replace("selected-", ""));

    const roles = selectedEtiquetas
        .filter((etiqueta) => etiqueta.startsWith("Rol:"))
        .map((etiqueta) => etiqueta.split(":")[1]);

    const dificultades = selectedEtiquetas
        .filter((etiqueta) => etiqueta.startsWith("Dificultad:"))
        .map((etiqueta) => etiqueta.split(":")[1]);

    console.log("Roles seleccionados:", roles);
    console.log("Dificultades seleccionadas:", dificultades);

    if (roles.length > 0 && dificultades.length > 0) {
        try {
            const response = await fetch(
                `/api/categoriasNivel1?roles=${roles.join(",")}&dificultades=${dificultades.join(",")}`
            );

            const text = await response.text(); // Obtenemos el texto de la respuesta
            console.log("Respuesta de la API:", text);

            const categorias = JSON.parse(text); // Convertimos a JSON
            console.log("Categorías de nivel 1 filtradas:", categorias);

            if (!Array.isArray(categorias)) {
                console.error("La respuesta no es un array:", categorias);
                return;
            }

            if (categorias.length === 0) {
                console.warn("No se encontraron categorías para los parámetros proporcionados.");
                return;
            }

            // Referencia al input de búsqueda
            const inputBox = document.getElementById("input-box-nivel1");

            // Evento para filtrar las opciones al escribir en el input
            inputBox.addEventListener("input", (event) => {
                const query = event.target.value.toLowerCase(); // Texto ingresado por el usuario
                const filteredCategorias = categorias.filter((categoria) =>
                    categoria.idNombre.toLowerCase().includes(query)
                );

                renderDropdownOptions(filteredCategorias); // Renderizar categorías filtradas
            });

            // Inicializar dropdown con todas las categorías
            renderDropdownOptions(categorias);

        } catch (error) {
            console.error("Error al cargar las categorías de nivel 1:", error);
        }
    } else {
        console.warn("No se encontraron roles o dificultades seleccionados. No se puede actualizar.");
    }
}







// Función para renderizar las opciones en el dropdown
function renderDropdownOptions(categorias) {
    const dropdownOptions = document.getElementById("dropdown-options1");
    dropdownOptions.innerHTML = ""; // Limpiar las opciones existentes

    categorias.forEach((categoria) => {
        const li = document.createElement("li");
        li.style.padding = "5px"; // Espaciado alrededor del elemento
        li.style.listStyleType = "none"; // Elimina el marcador de lista predeterminado

        // Crea el contenedor para checkbox y texto
        const label = document.createElement("label");
        label.className = "checkbox-label"; // Clase CSS para alinear correctamente
        label.htmlFor = `categoria-${categoria.idNombre}`;

        // Crea el checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = categoria.idNombre;
        checkbox.id = `categoria-${categoria.idNombre}`;
        checkbox.addEventListener("change", handleCategoria1Selection);

        // Texto de la categoría
        const textNode = document.createTextNode(categoria.idNombre);

        // Añade el checkbox y el texto al label
        label.appendChild(checkbox);
        label.appendChild(textNode);

        // Añade el label al elemento de la lista
        li.appendChild(label);

        // Agrega el elemento a la lista del dropdown
        dropdownOptions.appendChild(li);
    });
}




function handleCategoria1Selection(event) {
    const selectedCategoriasNivel1Container = document.getElementById("selectedCategoriasNivel1");
    const checkbox = event.target;
    const categoria1Value = checkbox.value; // Valor de la categoría

    // Si la categoría está seleccionada
    if (checkbox.checked) {
        const Categoria1Div = document.createElement("div");
        Categoria1Div.className = "categoria1-selection";
        Categoria1Div.id = `selected-${categoria1Value}`;

        const category1Label = document.createElement("span");
        category1Label.textContent = checkbox.nextSibling.textContent; // Toma el texto del label asociado al checkbox
        Categoria1Div.appendChild(category1Label);

        selectedCategoriasNivel1Container.appendChild(Categoria1Div); // Añadir al contenedor
        console.log("Categoría seleccionada añadida:", Categoria1Div);

        // Actualizar el valor del campo oculto
        const selectedCategoria1 = Array.from(
            selectedCategoriasNivel1Container.getElementsByClassName("categoria1-selection")
        ).map((div) => div.id.replace("selected-", "")); // Crear valor para el campo hidden

        document.getElementById("selectedEtiquetas").value = selectedCategoria1.join(",");
    } else {
        // Si la categoría se deselecciona
        const categoria1Div = document.getElementById(`selected-${categoria1Value}`);
        if (categoria1Div) {
            selectedCategoriasNivel1Container.removeChild(categoria1Div); // Eliminar del contenedor

            // Actualizar el valor del campo oculto
            const selectedCategoria1 = Array.from(
                selectedCategoriasNivel1Container.getElementsByClassName("categoria1-selection")
            ).map((div) => div.id.replace("selected-", ""));

            document.getElementById("selectedEtiquetas").value = selectedCategoria1.join(",");
        }
    }

    updateCategoriasNivel2();
    updateCategoriasNivel1Accordion();


}

function updateCategoriasNivel1Accordion() {
    console.log("Actualizando acordeón con las categorías seleccionadas de nivel 1...");

    // Obtener roles y dificultades seleccionados desde el DOM
    const selectedEtiquetas = Array.from(
        document.getElementsByClassName("etiqueta-selection")
    ).map((div) => div.id.replace("selected-", ""));

    const roles = selectedEtiquetas
        .filter((etiqueta) => etiqueta.startsWith("Rol:"))
        .map((etiqueta) => etiqueta.split(":")[1]);

    const dificultades = selectedEtiquetas
        .filter((etiqueta) => etiqueta.startsWith("Dificultad:"))
        .map((etiqueta) => etiqueta.split(":")[1]);

    if (roles.length === 0 || dificultades.length === 0) {
        console.warn("No se encontraron roles o dificultades seleccionados. No se puede actualizar.");
        return;
    }

    // Obtener las categorías de nivel 1 seleccionadas
    const selectedCategoriasNivel1Container = document.getElementById("selectedCategoriasNivel1");
    const selectedCategorias = Array.from(
        selectedCategoriasNivel1Container.getElementsByClassName("categoria1-selection")
    ).map((categoriaDiv) => ({
        id: categoriaDiv.id.replace("selected-", ""),
        nombre: categoriaDiv.textContent.trim(),
    }));

    const accordionContainer = document.getElementById("nivel1Accordion");
    accordionContainer.innerHTML = "";

    if (selectedCategorias.length === 0) {
        console.warn("No hay categorías seleccionadas para mostrar en el acordeón.");
        return;
    }

    selectedCategorias.forEach((categoria) => {
        const item = document.createElement("div");
        item.className = "accordion-item";

        const header = document.createElement("div");
        header.className = "accordion-header";
        header.style.display = "flex";
        header.style.alignItems = "center";
        header.style.justifyContent = "space-between";

        const text = document.createElement("span");
        text.textContent = categoria.nombre;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "categoria-checkbox";
        checkbox.id = `checkbox-${categoria.id}`;
        checkbox.name = "categoriasNivel1";
        checkbox.value = categoria.id;

        header.appendChild(text);
        header.appendChild(checkbox);

        const content = document.createElement("div");
        content.className = "accordion-content";

        // Llamar a updateCategoriasNivel2 al expandir el acordeón
        header.addEventListener("click", async () => {
            const isActive = item.classList.toggle("active");

            if (isActive) {
                console.log(`Cargando categorías de nivel 2 para: ${categoria.nombre}`);
                await updateCategoriasNivel2(
                    { idNombre: categoria.nombre },
                    content,
                    roles,
                    dificultades
                );

                content.style.maxHeight = `${content.scrollHeight}px`;
            } else {
                content.style.maxHeight = "0px";
            }
        });

        item.appendChild(header);
        item.appendChild(content);
        accordionContainer.appendChild(item);
    });

    console.log("Acordeón actualizado con las categorías seleccionadas.");
}



async function updateCategoriasNivel2(categoriaNivel1, contentContainer, roles, dificultades) {
    console.log(`Cargando categorías de nivel 2 para la categoría de nivel 1: ${categoriaNivel1.idNombre}`);



    if (!contentContainer) {
        console.error("El contenedor de contenido no existe en el DOM.");
        return;
    }

    try {
        const queryParams = new URLSearchParams({
            roles: roles.join(","),
            dificultades: dificultades.join(","),
            categoriaNivel1: categoriaNivel1.idNombre,
        });

        const response = await fetch(`/api/categoriasNivel2accordion?${queryParams}`);
        if (!response.ok) {
            throw new Error(`Error en la respuesta de la API: ${response.statusText}`);
        }

        const subcategorias = await response.json();
        contentContainer.innerHTML = ""; // Limpia el contenido previo

        if (!Array.isArray(subcategorias) || subcategorias.length === 0) {
            console.warn("No se encontraron subcategorías para el nivel 2.");
            return;
        }

        const subAccordion = document.createElement("div");
        subAccordion.className = "accordion-container";

        subcategorias.forEach((subcategoria) => {
            const subItem = document.createElement("div");
            subItem.className = "accordion-item";

            // Contenedor del encabezado con checkbox
            const subHeader = document.createElement("div");
            subHeader.className = "accordion-header";
            subHeader.style.display = "flex";
            subHeader.style.alignItems = "center";
            subHeader.style.justifyContent = "space-between";

            const text = document.createElement("span");
            text.textContent = subcategoria.idNombre;

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.className = "categoria2-checkbox";
            checkbox.id = `checkbox-${subcategoria.idNombre}`;
            checkbox.name = "categoriasNivel2";
            checkbox.value = subcategoria.idNombre;



            subHeader.appendChild(text);
            subHeader.appendChild(checkbox);

            const subContent = document.createElement("div");
            subContent.className = "accordion-content";

            // Expandir/colapsar y cargar categorías de nivel 3
            subHeader.addEventListener("click", async (event) => {
                event.stopPropagation(); // Evita que el evento se propague

                const isActive = subItem.classList.toggle("active");

                if (isActive) {
                    // Llamar a la función para cargar categorías de nivel 3
                    await updateCategoriasNivel3(subcategoria, subContent, roles, dificultades);

                    // Expandir el contenido del subacordeón
                    subContent.style.maxHeight = `${subContent.scrollHeight}px`;

                    // Ajustar dinámicamente el contenedor padre después de expandir
                    setTimeout(() => {
                        contentContainer.style.maxHeight = `${contentContainer.scrollHeight}px`;
                    }, 20); // Da tiempo a la transición del acordeón hijo
                } else {
                    // Colapsar el contenido del subacordeón
                    subContent.style.maxHeight = "0px";

                    // Ajustar dinámicamente el contenedor padre después de colapsar
                    setTimeout(() => {
                        contentContainer.style.maxHeight = `${contentContainer.scrollHeight}px`;
                    }, 50); // Da tiempo a la transición del acordeón hijo
                }
            });

            subItem.appendChild(subHeader);
            subItem.appendChild(subContent);
            subAccordion.appendChild(subItem);
        });

        contentContainer.appendChild(subAccordion);
        contentContainer.style.maxHeight = `${contentContainer.scrollHeight}px`; // Ajustar altura al final

        //console.log("Categorías seleccionadas en array (nivel 2):", selectedCategoriasNivel2);
    } catch (error) {
        console.error("Error al cargar las categorías de nivel 2:", error);
        contentContainer.innerHTML = "";
    }
}







async function updateCategoriasNivel3(categoriaNivel2, contentContainer, roles, dificultades) {
    console.log(`Cargando categorías de nivel 3 para la categoría de nivel 2: ${categoriaNivel2.idNombre}`);

    // Ahora es un array para almacenar las categorías seleccionadas

    if (!contentContainer) {
        console.error("El contenedor de contenido no existe en el DOM.");
        return;
    }

    try {
        const queryParams = new URLSearchParams({
            roles: roles.join(","),
            dificultades: dificultades.join(","),
            categoriaNivel2: categoriaNivel2.idNombre,
        });

        const response = await fetch(`/api/categoriasNivel3accordion?${queryParams}`);
        if (!response.ok) {
            throw new Error(`Error en la respuesta de la API: ${response.statusText}`);
        }

        const subcategorias = await response.json();
        contentContainer.innerHTML = ""; // Limpia el contenido previo

        if (!Array.isArray(subcategorias) || subcategorias.length === 0) {
            console.warn("No se encontraron subcategorías para el nivel 3.");
            return;
        }

        const subAccordion = document.createElement("div");
        subAccordion.className = "accordion-container";

        subcategorias.forEach((subcategoria) => {
            const subItem = document.createElement("div");
            subItem.className = "accordion-item";

            // Contenedor del encabezado con checkbox
            const subHeader = document.createElement("div");
            subHeader.className = "accordion-header";
            subHeader.style.display = "flex";
            subHeader.style.alignItems = "center";
            subHeader.style.justifyContent = "space-between";

            const text = document.createElement("span");
            text.textContent = subcategoria.idNombre;

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.className = "categoria3-checkbox";
            checkbox.id = `checkbox-${subcategoria.idNombre}`;
            checkbox.name = "categoriasNivel3";
            checkbox.value = subcategoria.idNombre;



            subHeader.appendChild(text);
            subHeader.appendChild(checkbox);

            const subContent = document.createElement("div");
            subContent.className = "accordion-content";

            // Lógica de expansión/contracción del contenido
            subHeader.addEventListener("click", () => {
                const isActive = subItem.classList.toggle("active");
                subContent.style.maxHeight = isActive ? `${subContent.scrollHeight}px` : "0px";

                // Ajustar la altura del contenedor padre
                contentContainer.style.maxHeight = `${contentContainer.scrollHeight}px`;
            });

            subItem.appendChild(subHeader);
            subItem.appendChild(subContent);
            subAccordion.appendChild(subItem);
        });

        contentContainer.appendChild(subAccordion);
        contentContainer.style.maxHeight = `${contentContainer.scrollHeight}px`; // Ajustar altura del contenedor al final

        //console.log("Categorías seleccionadas en array (nivel 3):", selectedCategoriasNivel3);
    } catch (error) {
        console.error("Error al cargar las categorías de nivel 3:", error);
        contentContainer.innerHTML = "";
    }
}

async function updateRoadmapsReutilizables() {
    console.log("Actualizando roadmaps reutilizables");

    // Extraer las etiquetas seleccionadas
    const selectedEtiquetas = Array.from(
        document.getElementsByClassName("etiqueta-selection")
    ).map((div) => div.id.replace("selected-", ""));

    // Filtrar por tipo de etiqueta
    const roles = selectedEtiquetas
        .filter((etiqueta) => etiqueta.startsWith("Rol:"))
        .map((etiqueta) => etiqueta.split(":")[1]);

    const dificultades = selectedEtiquetas
        .filter((etiqueta) => etiqueta.startsWith("Dificultad:"))
        .map((etiqueta) => etiqueta.split(":")[1]);

    const conocimientos = selectedEtiquetas
        .filter((etiqueta) => etiqueta.startsWith("Conocimiento del Roadmap:"))
        .map((etiqueta) => etiqueta.split(":")[1]);

    console.log("Roles seleccionados:", roles);
    console.log("Dificultades seleccionadas:", dificultades);
    console.log("Conocimientos seleccionados:", conocimientos);

    if (roles.length > 0 && dificultades.length > 0 && conocimientos.length > 0) {
        try {
            // Llamar a la API con las etiquetas como parámetros
            const response = await fetch(
                `/api/roadmapsReutilizables?roles=${roles.join(",")}&dificultades=${dificultades.join(",")}&conocimientos=${conocimientos.join(",")}`
            );
            const roadmaps = await response.json();

            console.log("Roadmaps reutilizables filtrados:", roadmaps);

            if (!Array.isArray(roadmaps) || roadmaps.length === 0) {
                console.warn("No se encontraron roadmaps reutilizables.");
                return;
            }

            // Actualizar las opciones en el dropdown
            const dropdownOptions = document.getElementById("dropdown-optionsroadmapsReutilizables");
            dropdownOptions.innerHTML = ""; // Limpiar opciones existentes

            roadmaps.forEach((roadmap) => {
                console.log("Detalles del roadmap:", roadmap);

                if (!roadmap.idRoadmap) {
                    console.warn("El roadmap no tiene un idRoadmap válido:", roadmap);
                    return;
                }

                // Crear el elemento de lista
                const li = document.createElement("li");
                li.style.padding = "5px";
                li.style.listStyleType = "none";

                // Crear el checkbox
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.id = `checkbox-${roadmap.idRoadmap}`;
                checkbox.value = roadmap.idRoadmap;
                checkbox.style.marginRight = "10px";

                // Añadir evento para manejar la selección
                checkbox.addEventListener("change", handleElementosSelection);

                // Crear el enlace
                const link = document.createElement("a");
                link.href = `/${encodeURIComponent(roadmap.idRoadmap)}`;
                link.textContent = roadmap.idRoadmap;
                link.style.textDecoration = "none";
                link.style.color = "inherit";
                link.target = "_blank";
                link.rel = "noopener noreferrer";

                // Añadir el checkbox y el enlace al elemento de lista
                li.appendChild(checkbox);
                li.appendChild(link);

                // Añadir el elemento de lista al dropdown
                dropdownOptions.appendChild(li);
            });

            console.log(
                "Contenido de 'roadmapsReutilizables' después de agregar opciones:",
                dropdownOptions.innerHTML
            );
        } catch (error) {
            console.error("Error al cargar los roadmaps reutilizables:", error);
        }
    } else {
        console.warn("Faltan categorías seleccionadas. No se puede actualizar.");
    }
}





function handleElementosSelection(event) {
    const selectedElementosContainer = document.getElementById("selectedCRoadmapsReutilizables");
    const checkbox = event.target;
    const elementoValue = checkbox.value; // Valor del elemento reutilizable

    if (checkbox.checked) {
        const elementoDiv = document.createElement("div");
        elementoDiv.className = "roadmap-selection"; // Cambia a 'roadmap-selection'
        elementoDiv.id = `selected-${elementoValue}`;
        elementoDiv.style.display = "flex";
        elementoDiv.style.alignItems = "center";

        const elementoLabel = document.createElement("span");
        elementoLabel.textContent = elementoValue;
        elementoLabel.style.marginRight = "10px";

        elementoDiv.appendChild(elementoLabel);
        selectedElementosContainer.appendChild(elementoDiv);
        console.log("Elemento seleccionado añadido:", elementoValue);
    } else {
        const elementoDiv = document.getElementById(`selected-${elementoValue}`);
        if (elementoDiv) {
            selectedElementosContainer.removeChild(elementoDiv);
            console.log("Elemento deseleccionado eliminado:", elementoValue);
        }
    }
}

