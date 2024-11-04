export function setUpEditorFormHandle(idForm){
    const form =document.getElementById(idForm)

  form.addEventListener('formdata', (event)=>{
    const content = document.getElementById('content');
    console.log('EDITOR')
    event.formData.append('content',content.innerHTML );
  });
}


export function updateOptionsVisibility(inputId, dropdownId) {
    const inputElement = document.getElementById(inputId);
    const searchText = inputElement.value.toLowerCase();
    const dropdownOptions = document.querySelectorAll(`#${dropdownId} li`);

    dropdownOptions.forEach(option => {
        const optionText = option.textContent?.toLowerCase();
        option.style.display = (searchText === '' || optionText.includes(searchText)) ? '' : 'none';
    });

    if (searchText === '') {
        const hiddenInput = document.getElementById(hiddenInputId);
        hiddenInput.value=''
        dropdownOptions.forEach(option => {
            option.style.display = '';
        });
    }
}

export function setupDropdown(inputId, dropdownId, hiddenInputId) {
    const inputBox = document.getElementById(inputId);
    const dropdown = document.getElementById(dropdownId);
    const hiddenInput = document.getElementById(hiddenInputId);

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

    dropdown.addEventListener('click', function(event) {
        const selectedOption = event.target;
        if (selectedOption.tagName === 'LI') {
            const value = selectedOption.getAttribute('value');
            if (value) {
                
                if(value.toString().split('.')[1]){
                    console.log(value)
                    const values= value.toString().split('.')
                    inputBox.value = values[1];
                    hiddenInput.value = values[0];
                    dropdown.style.display = 'none';
                }else{
                    inputBox.value = value;
                hiddenInput.value = value;
                dropdown.style.display = 'none';
                }
                
                
            }
        }
    });
}

export async function handleFormSubmit(event, apiUrl, formId) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const response = await fetch(apiUrl, { method: 'POST', body: formData });
    const result = await response.json();

    const correctMessageElement = document.getElementById('correct-message');
    const errorMessageElement = document.getElementById('error-message');

    


    if (response.ok) {
        if(formId=='roadmapForm'){
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

export function setupFormSubmission(formId, apiUrl) {
    const form = document.getElementById(formId);
    form?.addEventListener('submit', function(event) {
        handleFormSubmit(event, apiUrl, formId);
    });
}
