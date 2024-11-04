import { updateOptionsVisibility } from "../../utils";

export function setupDropdown(inputId, dropdownId, checkBoxId) {
    const inputBox = document.getElementById(inputId);
    const dropdown = document.getElementById(dropdownId);

    inputBox?.addEventListener('click', function() {
        dropdown.style.display = 'block';
        updateOptionsVisibility(inputId, dropdownId);
    });

    inputBox?.addEventListener('input', function(event) {
        updateOptionsVisibility(inputId, dropdownId);
    });

    document.addEventListener('click', function(event) {
        if (!dropdown.contains(event.target) && event.target !== inputBox) {
            dropdown.style.display = 'none';
        }
    });

    dropdown.addEventListener('click', async function(event) {
        const selectedOption = event.target;
        if (selectedOption.tagName === 'LI') {
            const value = selectedOption.getAttribute('value');
            if (value) {
                inputBox.value = value;
                dropdown.style.display = 'none';

                addCheckbox(value, selectedOption.textContent);
                inputBox.value = '';
            }
        }
    });

    function addCheckbox(value, text) {
        const checkboxContainer = document.createElement('div');
        checkboxContainer.style.display = 'flex';
        checkboxContainer.style.alignItems = 'center'; // Asegura que los elementos estén alineados verticalmente

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = value;
        checkbox.id = `checkbox-${value}`;
        checkbox.checked = true; // Asegura que la casilla esté marcada

        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.textContent = text;

        // Crear la etiqueta para el campo de entrada numérico
        const priorityLabel = document.createElement('label');
        priorityLabel.htmlFor = `input-${value}`;
        priorityLabel.textContent = 'Prioridad (opcional)';
        priorityLabel.style.color = '#A9A9A9';
        priorityLabel.style.marginLeft = '10px'; // Estilo opcional

        // Crear el campo de entrada numérico
        const relatedInput = document.createElement('input');
        relatedInput.type = 'number';
        relatedInput.placeholder = 'Prioridad';
        relatedInput.id = `input-${value}`;
        relatedInput.name = `input-${value}`;
        relatedInput.min = 1; // Opcional: establece el valor mínimo
        relatedInput.style.marginLeft = '5px'; // Estilo opcional
       // relatedInput.style.color = '#A9A9A9'; // Establecer el tono gris para el texto

        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(label);
        checkboxContainer.appendChild(priorityLabel);
        checkboxContainer.appendChild(relatedInput);
        
        const checkboxList = document.getElementById(checkBoxId);
        checkboxList.appendChild(checkboxContainer);

        // Añadir el listener para remover el checkbox y los campos relacionados cuando se desmarque
        checkbox.addEventListener('change', function() {
            if (!checkbox.checked) {
                checkboxContainer.remove();
            }
        });
    }
}
