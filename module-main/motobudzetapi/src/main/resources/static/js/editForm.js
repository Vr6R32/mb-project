let selectedFiles = []; // Store the selected files references in an array
let descriptionContent;
let quill;


document.addEventListener('DOMContentLoaded', function () {

    window.onload = function() {
        window.scrollTo(0, 0);
    }

    createForm();
    fetchBrands();
    fetchSpecifications();
    loadFileDrop();
    fetchUserDetails();

    document.addEventListener('dragover', function (e) {
        e.preventDefault();
    });
    document.addEventListener('drop', function (e) {
        e.preventDefault();
    });
});
document.addEventListener('click', function(event) {
    let suggestionsList = document.getElementById('suggestionsList');
    if (!suggestionsList.contains(event.target)) {
        suggestionsList.style.display = 'none';
    }
});

function fetchUserDetails() {
    fetch("/api/user/details")
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            setTimeout(() => { // Dodanie opóźnienia tutaj
                let cityTextarea = document.getElementById('city');
                let cityStateSelect = document.getElementById('cityState');

                // Tworzymy nowy element option
                cityTextarea.value = data.cityName;

                let optionState = document.createElement('option');
                optionState.value = data.cityStateName; // Ustawiamy wartość na cityStateName
                optionState.textContent = data.cityStateName; // Ustawiamy tekst widoczny dla użytkownika

                // Dodajemy nowy element option do elementu select
                cityStateSelect.appendChild(optionState);

                console.log(data); // Tutaj masz dostęp do danych z
            }, 1000); // 2000ms (2 sekundy) opóźnienia
        })
        .catch(error => {
            console.error("There was a problem with the fetch operation:", error.message);
        });
}


function getUserName(){
    let userName = document.getElementById('username');
    console.log('Principal Name2:', userName.textContent);
    return userName.textContent;
}

function loadFileDrop(){
    const fileDropArea = document.getElementById('fileDropArea');

    fileDropArea.addEventListener('drop', handleFileDrop);
    fileDropArea.addEventListener('dragover', function(e) {
        e.preventDefault();
    });
}

function createDescriptionEditor() {
    let horizontalContainer = document.getElementById('half-container-horizontal');
    let editor = document.createElement('div'); // zamiast 'textarea'
    editor.id = "editor";

    let label = document.createElement('div');
    label.textContent = 'Opis Ogłoszenia:'
    label.style.marginTop = '15px';
    label.style.marginBottom = '15px';
    label.style.color = 'darkgoldenrod';
    label.style.width = '1300px';
    label.style.textAlign = 'center';
    label.style.fontSize = '18px';

    editor.style.scrollbarWidth = 'thin';
    editor.style.scrollbarColor = 'darkgoldenrod transparent';
    editor.style.WebkitScrollbar = 'thin';
    editor.style.WebkitScrollbarTrack = 'transparent';
    editor.style.WebkitScrollbarThumb = 'darkgoldenrod';
    editor.style.WebkitScrollbarThumbHover = 'goldenrod';


    // Stylizacja dla textarea
    editor.style.width = '1200px';
    editor.style.maxWidth = '100%';
    editor.style.padding = '40px';
    // editor.style.marginBottom = '10px';
    // editor.style.marginLeft = '30px';
    // editor.style.marginRight = '30px';
    editor.style.height = '700px';
    editor.style.backgroundColor = 'black';
    editor.style.borderRadius = '10px';
    // input.style.border = '0px';
    // input.style.color = 'white';
    // input.style.textAlign = 'center';
    editor.style.border = "1px solid rgba(255, 255, 255, 0.5)"; // Dodano bezpośrednio z Twojego wcześniejszego kodu
    editor.style.overflowY = 'auto'; // Dodane

    // Dodanie elementów do kontenera
    horizontalContainer.appendChild(label);
    horizontalContainer.appendChild(editor);
    horizontalContainer.appendChild(document.createElement('br'));

    const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],
        // ['blockquote', 'code-block'],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': ['white','blue','yellow','red','pink','green',] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        // ['clean']
    ];

    quill = new Quill('#editor', {
        modules: {
            toolbar: toolbarOptions
        },
        theme: 'snow'
    });

    quill.format('color', '#fff'); // Ustawienie domyślnego koloru tekstu na biały
    quill.format(0, quill.getLength(), 'color', '#fff');


}

function fetchAdvertisementDetails() {
    extractAdvertisementId();

    return fetch(`/api/advertisements/${advertisementId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error("There was an error fetching the advertisement details:", error);
        });
}

function extractAdvertisementId() {
    const urlParams = new URLSearchParams(document.location.search);
    advertisementId = urlParams.get('advertisementId');
}

function createForm() {



    const titleContainer = document.getElementById('title-container-hidden');
    const formContainer = document.getElementById('half-container-big1');
    const photoContainer = document.getElementById('half-container-big2');

    titleContainer.style.color = 'darkgoldenrod';
    titleContainer.style.textAlign = 'center';

    const title = document.createElement('h2');
    title.textContent = 'Dodaj Nowe Ogłoszenie';
    titleContainer.appendChild(title);


    // photoContainer.style.alignItems = 'center';
    // photoContainer.style.justifyContent = 'center';
    // photoContainer.style.justifySelf = 'center';
    // photoContainer.style.justifyItems = 'center';

    const form = document.createElement('form');
    form.id = 'advertisementForm';

    const formElements = [
        {label: 'Tytuł:', type: 'text', id: 'name', name: 'name', required: true},
        // { label: 'Opis ogłoszenia:', type: 'div', id: 'description', name: 'description', required: true },
        {
            label: 'Marka:',
            type: 'select',
            id: 'brand',
            name: 'brand',
            onchange: 'fetchModels(this.value)',
            required: true
        },
        {label: 'Model:', type: 'select', id: 'model', name: 'model', required: true},
        {label: 'Rodzaj paliwa:', type: 'select', id: 'fuelType', name: 'fuelType', required: true},
        {label: 'Rodzaj napędu:', type: 'select', id: 'driveType', name: 'driveType', required: true},
        {label: 'Rodzaj silnika:', type: 'select', id: 'engineType', name: 'engineType', required: true},
        {
            label: 'Rodzaj skrzyni biegów:',
            type: 'select',
            id: 'transmissionType',
            name: 'transmissionType',
            required: true
        },
        {
            label: 'Przebieg:',
            type: 'number',
            id: 'mileage',
            name: 'mileage',
            required: true,
            additionalSelect: {
                label: 'Jednostka:',
                id: 'mileageUnit',
                name: 'mileageUnit',
                options: ['KM', 'MIL']
            }
        },
        {
            label: 'Cena:', type: 'number', id: 'price', name: 'price', required: true,
            additionalSelect: {
                label: 'Jednostka:',
                id: 'priceUnit',
                name: 'priceUnit',
                options: ['PLN', 'EUR', 'USD']
            }
        },
        {
            label: 'Pojemność silnika (w cm³):',
            type: 'number',
            id: 'engineCapacity',
            name: 'engineCapacity',
            required: true
        },
        {label: 'Moc silnika (KM):', type: 'number', id: 'engineHorsePower', name: 'engineHorsePower', required: true},
        {label: 'Data produkcji:', type: 'number', id: 'productionDate', name: 'productionDate', required: true},
        {
            label: 'Data pierwszej rejestracji:',
            type: 'date',
            id: 'firstRegistrationDate',
            name: 'firstRegistrationDate',
            required: true
        },
        {
            label: 'Lokalizacja:',
            type: 'text',
            id: 'city',
            name: 'city',
            required: true,
            additionalSelect: {
                label: 'Województwo:',
                id: 'cityState',
                name: 'cityState',
                options: [
                    'DOLNOŚLĄSKIE',
                    'KUJAWSKO-POMORSKIE',
                    'LUBELSKIE',
                    'LUBUSKIE',
                    'ŁÓDZKIE',
                    'MAŁOPOLSKIE',
                    'MAZOWIECKIE',
                    'OPOLSKIE',
                    'PODKARPACKIE',
                    'PODLASKIE',
                    'POMORSKIE',
                    'ŚLĄSKIE',
                    'ŚWIĘTOKRZYSKIE',
                    'WARMIŃSKO-MAZURSKIE',
                    'WIELKOPOLSKIE',
                    'ZACHODNIOPOMORSKIE'
                ]
            }
        },
    ];

    formElements.forEach(element => {
        const label = document.createElement('label');
        label.setAttribute('for', element.id);
        label.textContent = element.label;
        // label.style.color = 'white';
        label.style.fontWeight = 'bold';

        const input = document.createElement(element.type === 'textarea' ? 'textarea' : (element.type === 'select' ? 'select' : 'input'));
        input.style.border = "1px solid rgba(255, 255, 255, 0.5)"; // Dodanie ramki o szerokości 2px, stylu 'solid' i kolorze białym
        input.type = element.type;
        input.id = element.id;
        input.name = element.name;
        if (element.required) {
            input.required = true;
        }
        if (element.type === 'select' && element.onchange) {
            input.setAttribute('onchange', element.onchange);
        }
        if (element.type === 'select') {
            input.style.textAlign = 'center';
        }


        if (element.id === 'city') {

            const inputContainer = document.createElement("div");
            inputContainer.style.position = "relative"; // Ustawiamy pozycję na "relative", aby umożliwić pozycjonowanie względem tego kontenera
            inputContainer.setAttribute('autocomplete', 'off');


            input.style.position = 'relative';
            input.setAttribute('autocomplete', 'off');

            const suggestionsList = document.createElement('ul');

            suggestionsList.style.right = '25px';
            suggestionsList.style.top = '45px';

            suggestionsList.id = 'suggestionsList';
            suggestionsList.setAttribute('autocomplete', 'off');
            suggestionsList.style.listStyleType = 'none';
            suggestionsList.style.padding = '0';
            suggestionsList.style.margin = '0';
            suggestionsList.style.position = 'absolute';
            suggestionsList.style.backgroundColor = 'black';
            suggestionsList.style.color = 'white';
            suggestionsList.style.border = '1px solid #ccc';
            suggestionsList.style.borderRadius = '5px';
            suggestionsList.style.maxHeight = '150px';
            suggestionsList.style.minWidth = '200px';
            suggestionsList.style.overflowY = 'auto';
            suggestionsList.style.display = 'none';
            suggestionsList.style.zIndex = '1000'; // Ensure it appears above other content
            // suggestionsList.style.marginTop = '200px';
            // suggestionsList.style.bottom = "-30px";
            // suggestionsList.style.top = "100%";

            suggestionsList.style.scrollbarWidth = 'thin';
            suggestionsList.style.scrollbarColor = 'darkgoldenrod transparent';
            suggestionsList.style.WebkitScrollbar = 'thin';
            suggestionsList.style.WebkitScrollbarTrack = 'transparent';
            suggestionsList.style.WebkitScrollbarThumb = 'darkgoldenrod';
            suggestionsList.style.WebkitScrollbarThumbHover = 'goldenrod';


            // Dodaj obsługę kliknięcia na propozycję miasta
            suggestionsList.addEventListener('click', function (event) {
                if (event.target && event.target.nodeName === 'LI') {
                    input.value = event.target.textContent;
                    suggestionsList.style.display = 'none';
                }
            });

            // Dodaj listę propozycji do pola miasta
            inputContainer.appendChild(input);
            inputContainer.appendChild(suggestionsList);
            form.appendChild(inputContainer);

            // Obsługa wprowadzania tekstu w polu miasta
            let timeoutId;
            const debounceDelay = 200;

            input.addEventListener("input", function () {
                // Anuluje poprzednie żądanie, jeśli istnieje
                clearTimeout(timeoutId);

                // Pobiera częściową nazwę miasta wprowadzoną przez użytkownika
                const partialCityName = input.value;

                // Ustawia nowe opóźnienie
                timeoutId = setTimeout(function () {
                    // Wykonuje żądanie do backendu REST API, przesyłając częściową nazwę miasta
                    fetch(`/api/cities?partialName=${partialCityName}`)
                        .then(response => response.json())
                        .then(data => {
                            // Aktualizuje listę propozycji miast na podstawie odpowiedzi od serwera
                            updateCitySuggestions(data); // przekazujemy listę sugestii jako drugi argument
                        })
                        .catch(error => {
                            console.error("Błąd podczas pobierania propozycji miast:", error);
                        });
                }, debounceDelay);
            });
        }


        if (element.additionalSelect) {
            const wrapper = document.createElement('div');
            wrapper.style.display = 'flex'; // Use flex layout
            wrapper.style.alignItems = 'center'; // Align items vertically centered
            wrapper.style.gap = '10px'; // Gap between items
            wrapper.style.justifyContent = 'space-between'; // Distribute space evenly between the items
            wrapper.style.width = '500px'; // Same width as other form fields


            const additionalSelectLabel = document.createElement('label');
            additionalSelectLabel.setAttribute('for', element.additionalSelect.id);
            additionalSelectLabel.textContent = element.additionalSelect.label;


            const additionalSelectInput = document.createElement('select');
            additionalSelectInput.id = element.additionalSelect.id;
            additionalSelectInput.name = element.additionalSelect.name;
            additionalSelectInput.style.width = '50px'; // Set width

            if (element.additionalSelect.id === 'cityState') {
                additionalSelectInput.style.width = '50%'; // Set width
            }

            element.additionalSelect.options.forEach(optionValue => {
                const option = document.createElement('option');
                option.value = optionValue;
                option.textContent = optionValue;
                additionalSelectInput.appendChild(option);
            });

            // Set a flex-grow property to make mileage input take up remaining width
            // input.style.flexGrow = '1';
            // For the mileage input
            input.style.flex = '1'; // This will allow it to grow and take up the remaining space

            additionalSelectInput.style.flex = 'none'; // This will prevent it from growing and it will only take up necessary space


            form.appendChild(label);
            // wrapper.appendChild(label);
            wrapper.appendChild(input);
            wrapper.appendChild(additionalSelectInput);
            form.appendChild(wrapper);
            form.appendChild(document.createElement('br'));
        } else {
            form.appendChild(label);
            form.appendChild(input);
            form.appendChild(document.createElement('br'));
        }
    });

    let horizontalContainer = document.getElementById('half-container-horizontal');

    createDescriptionEditor();

    const submitButton = document.createElement('input');
    submitButton.type = 'button';
    submitButton.value = 'Wyślij';
    submitButton.style.marginBottom = '15px';
    submitButton.onclick = submitFormWithFiles;
    submitButton.style.backgroundColor = "black";
    submitButton.style.color = "white";
    submitButton.style.border = "1px solid darkgoldenrod";
    submitButton.style.padding = "10px 20px";  // Dodane dla lepszego wyglądu przycisku
    submitButton.style.cursor = "pointer";     // Zmienia kursor na dłoń, gdy najedziesz na przycisk
    submitButton.style.transition = "0.3s";    // Dodane dla efektu płynnego przejścia
    submitButton.style.borderRadius = '15px';
    submitButton.style.marginRight = '3px';

    submitButton.addEventListener("mouseover", ev => {
            submitButton.style.boxShadow = '0 0 20px moccasin';
        }
    )


    submitButton.addEventListener("mouseout", ev => {
            submitButton.style.boxShadow = 'none';
        }
    )
    horizontalContainer.appendChild(submitButton);

    formContainer.appendChild(form);

    const fileInput = document.createElement('input');
    fileInput.setAttribute('type', 'file');
    fileInput.setAttribute('multiple', 'multiple'); // Allow multiple file selection
    fileInput.style.display = 'none';
    fileInput.addEventListener('change', handleFileSelect);
    fileDropArea.appendChild(fileInput);

    fileDropArea.style.alignItems = 'center';

    fileDropArea.innerText = "Przeciągnij plik tutaj lub kliknij, aby wybrać plik do przesłania.\nMaksymalna ilość zdjęć to 15.";

    fileDropArea.addEventListener('drop', handleFileDrop);
    fileDropArea.addEventListener('dragover', function (e) {
        e.preventDefault();
    });
    fileDropArea.addEventListener('drop', handleFileDrop);
    fileDropArea.addEventListener('click', function () {
        fileInput.click();
    });

    photoContainer.appendChild(fileDropArea);

    fetchAdvertisementDetails()
        .then(userData => {
            populateFormData(userData); // use the returned userData to populate the form
        });

}

function populateFormData(data) {
    // Here, you can populate each field in your form using the data
    document.getElementById('name').value = data.name || '';
    document.getElementById('fuelType').value = data.fuelType || '';
    document.getElementById('driveType').value = data.driveType || '';
    document.getElementById('engineType').value = data.engineType || '';
    document.getElementById('transmissionType').value = data.transmissionType || '';
    document.getElementById('mileage').value = data.mileage || '';
    document.getElementById('price').value = data.price || '';
    document.getElementById('engineCapacity').value = data.engineCapacity || '';
    document.getElementById('engineHorsePower').value = data.engineHorsePower || '';
    document.getElementById('productionDate').value = data.productionDate || '';
    document.getElementById('firstRegistrationDate').value = data.firstRegistrationDate || '';


    // For selects, you may also need to ensure the correct option is selected based on data
    fetchModels(data.brand).then(() => {
        const modelSelect = document.getElementById('model');
        Array.from(modelSelect.options).forEach(option => {
            if (option.value === data.model) {
                option.selected = true;
            }
        });
    });

    // ... (rest of your code to populate other fields)
    const brandSelect = document.getElementById('brand');
    Array.from(brandSelect.options).forEach(option => {
        if (option.value === data.brand) {
            option.selected = true;
        }
    });
}

function updateCitySuggestions(suggestions) {
    // Pobierz pole tekstowe i stwórz listę propozycji miast
    const cityInput = document.getElementById('city');
    const cityStateInput = document.getElementById('cityState');
    const suggestionsList = document.getElementById('suggestionsList'); // Zakładam, że masz element listy o id 'suggestionsList'

    // Usuń wszystkie istniejące propozycje z listy
    while (suggestionsList.firstChild) {
        suggestionsList.removeChild(suggestionsList.firstChild);
    }

    // Wyświetl nowe propozycje
    suggestions.forEach(suggestion => {
        const suggestionItem = document.createElement('li');
        suggestionItem.textContent = suggestion.cityName;
        suggestionItem.addEventListener('click', function () {
            // Po kliknięciu propozycji, wypełnij pole tekstowe i wyczyść listę propozycji
            cityInput.value = suggestion.name;
            cityStateInput.value = suggestion.cityStateName;
            suggestionsList.innerHTML = '';
        });
        suggestionsList.appendChild(suggestionItem);
    });

    // Jeśli nie ma propozycji, ukryj listę
    if (suggestions.length === 0) {
        suggestionsList.style.display = 'none';
    } else {
        suggestionsList.style.display = 'block';
    }
}

function fetchBrands() {
    fetch('/api/brands')
        .then(response => response.json())
        .then(data => {
            const brandSelect = document.getElementById('brand');
            brandSelect.innerHTML = '<option value="">Wybierz markę</option>';
            data.forEach(brand => {
                const option = document.createElement('option');
                option.value = brand.name;
                option.text = brand.name;
                brandSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Błąd pobierania marek:', error));
}

function fetchModels(brand) {
    return new Promise((resolve, reject) => {
        const modelSelect = document.getElementById('model');
        if (brand) {
            fetch(`/api/models/${brand}`)
                .then(response => response.json())
                .then(data => {
                    modelSelect.innerHTML = '<option value="">Wybierz model</option>';
                    data.forEach(model => {
                        const option = document.createElement('option');
                        option.value = model.name;
                        option.text = model.name;
                        modelSelect.appendChild(option);
                    });
                    resolve();
                })
                .catch(error => {
                    console.error('Błąd pobierania modeli:', error);
                    reject(error);
                });
        } else {
            modelSelect.innerHTML = '<option value="">Wybierz model</option>';
            resolve();
        }
    });
}


function fetchSpecifications() {
    function populateSelect(selectId, data) {
        const select = document.getElementById(selectId);
        // select.innerHTML = `<option value="">Wybierz ${selectId}</option>`;
        select.innerHTML = `<option value="">------</option>`;
        data.forEach(option => {
            const value = option.name;
            const text = option.name;

            const optionElement = document.createElement('option');
            optionElement.value = value;
            optionElement.text = text;
            select.appendChild(optionElement);
        });
    }

    fetch('/api/spec/fuelTypes')
        .then(response => response.json())
        .then(data => populateSelect('fuelType', data))
        .catch(error => console.error('Błąd pobierania rodzaju paliwa:', error));

    fetch('/api/spec/driveTypes')
        .then(response => response.json())
        .then(data => populateSelect('driveType', data))
        .catch(error => console.error('Błąd pobierania rodzaju napędu:', error));

    fetch('/api/spec/engineTypes')
        .then(response => response.json())
        .then(data => populateSelect('engineType', data))
        .catch(error => console.error('Błąd pobierania rodzaju silnika:', error));

    fetch('/api/spec/transmissionTypes')
        .then(response => response.json())
        .then(data => populateSelect('transmissionType', data))
        .catch(error => console.error('Błąd pobierania rodzaju skrzyni biegów:', error));
}

function submitFormWithFiles() {
    if(selectedFiles.length>0){
        submitForm()
            .then(advertisementId => {
                if (advertisementId) {
                    uploadFiles(advertisementId);
                }
            })
            .catch(handleError);
    } else { alert('Umieść zdjęcia!');
    }
}

function submitForm() {

    quill.format(0, quill.getLength(), 'color', '#fff');
    descriptionContent = quill.container.firstChild.innerHTML;

    const formData = {
        name: getValue('name'),
        description: descriptionContent,
        brand: getValue('brand'),
        model: getValue('model'),
        fuelType: getValue('fuelType'),
        driveType: getValue('driveType'),
        engineType: getValue('engineType'),
        transmissionType: getValue('transmissionType'),
        mileage: getValue('mileage'),
        mileageUnit: getValue('mileageUnit'),
        price: getValue('price'),
        priceUnit: getValue('priceUnit'),
        engineCapacity: getValue('engineCapacity'),
        engineHorsePower: getValue('engineHorsePower'),
        productionDate: getValue('productionDate'),
        firstRegistrationDate: getValue('firstRegistrationDate'),
        city: getValue('city'),
        cityState: getValue('cityState'),
        userName: getUserName()
    };



    return fetch('/api/advertisements', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
        .then(handleResponse)
        .catch(handleError);
}

function handleResponse(response) {
    const errorMessagesElement = document.getElementById('errorMessages');
    errorMessagesElement.innerHTML = ''; // Wyczyść komunikaty błędów

    if (!response.ok) {
        if (response.status === 400) {
            return response.text().then(errorMessage => {
                throw new Error(errorMessage);
            });
        } else {
            throw new Error('Wystąpił błąd podczas przetwarzania formularza.');
        }
    }
    return response.headers.get('advertisementId');
}

function handleError(error) {
    console.error(error);
    alert(error.message);
}

function getValue(id) {
    return document.getElementById(id).value;
}


function uploadFiles(advertisementId) {
    if (selectedFiles.length === 0) {
        console.error('Nie wybrano pliku.');
        return;
    }

    const formData = new FormData();
    formData.append('advertisementId', advertisementId);
    formData.append('mainPhotoUrl',selectedFiles[0].name)

    selectedFiles.forEach((file) => {
        formData.append('files', file); // Use the same parameter name 'files' for each file
    });

    // const apiUrl = selectedFiles.length > 1 ? `/api/advertisement/images/${advertisementId}` : `/api/advertisement/image/${advertisementId}`;
    const apiUrl = `/api/advertisements/images/${advertisementId}`;

    console.log(selectedFiles.length);

    fetch(apiUrl, {
        method: 'POST',
        body: formData,
    })

        .then(response => {
            if(response.ok){
                console.log('Odpowiedź serwera:', response);
                resetFileDropArea();
                // displayResult(data);
                // Odczytaj nagłówek "Location" z odpowiedzi serwera
                const redirectURL = response.headers.get('Location');
                console.log(redirectURL);
                if (redirectURL) {
                    // Wykonaj przekierowanie na określony adres URL
                    window.location.href = redirectURL;
                } else {
                    console.error('Błąd przekierowania: Brak nagłówka "Location" w odpowiedzi serwera.');
                }
            }
        })
        .catch(error => {
            console.error(error.message);
            resetFileDropArea();
            // displayResult('Błąd podczas przesyłania pliku.');
        });
}

function createDropDeleteZone(){
    if(document.getElementById('deleteZone')===null){
        const deleteZone = document.createElement('div');
        deleteZone.id = 'deleteZone';
        deleteZone.style.width = '200px';
        deleteZone.style.height = '100px';
        deleteZone.style.color = 'white';
        deleteZone.style.border = '2px dashed red';
        deleteZone.style.borderRadius = '10px';
        deleteZone.style.textAlign = 'center';
        deleteZone.style.lineHeight = '100px';  // Center the text vertically
        deleteZone.style.cursor = 'pointer';
        deleteZone.style.position = 'relative';
        deleteZone.style.bottom = '200px';
        deleteZone.innerText = 'Drop to delete';

        deleteZone.addEventListener('dragover', handleDeleteZoneDragOver);
        deleteZone.addEventListener('drop', handleDeleteZoneDrop);
        deleteZone.addEventListener('mouseover', function() {
            this.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
        });
        deleteZone.addEventListener('mouseout', function() {
            this.style.backgroundColor = '';
        });

        let thumbnailzone = document.getElementById('half-container-big2');

        thumbnailzone.insertBefore(deleteZone, document.getElementById('thumbnails'));
    }
}

function handleDeleteZoneDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDeleteZoneDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    if (dragSrcElement) {
        // Określ indeks miniaturki, która została przeciągnięta
        const thumbnailsContainer = document.getElementById('thumbnails');
        const thumbnails = thumbnailsContainer.getElementsByClassName('thumbnail');
        const sourceIndex = Array.from(thumbnails).indexOf(dragSrcElement);

        console.log("Source Index:", sourceIndex); // Dodajemy debugowanie
        // console.log("Dragged Element:", dragSrcElement); // Wyświetlamy przeciągnięty element

        // Usuń miniaturkę z DOM
        dragSrcElement.remove();

        // Usuń odpowiadający jej plik z selectedFiles
        if (sourceIndex > -1) {
            selectedFiles.splice(sourceIndex, 1);
        } else {
            console.warn("Could not find the dragged thumbnail in the list.");
        }
        if(selectedFiles.length < 1){
            resetFileDropAreamy();
        }

        dragSrcElement = null; // Resetuj źródłowy element przeciągania
    }

    return false;
}

function handleFileDrop(e) {
    e.preventDefault();
    const files = e.dataTransfer.files;
    const allowedExtensions = ["jpg", "png"];
    const validFiles = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExtension = file.name.split(".").pop().toLowerCase();
        if (allowedExtensions.includes(fileExtension)) {
            validFiles.push(file);
        }
    }



    resetFileDropArea()
    if (validFiles.length > 0) {
        selectedFiles = validFiles;
        showThumbnails(validFiles);
    }
    if(validFiles.length < 1){
        resetFileDropAreamy();
    }
}
function handleFileSelect(e) {
    const fileInput = e.target;
    const files = Array.from(fileInput.files);
    const allowedExtensions = ["jpg", "png"];
    const validFiles = [];

    // for (let i = 0; i < files.length; i++) {
    //     const file = files[i];
    //     const fileExtension = file.name.split(".").pop().toLowerCase();
    //     if (allowedExtensions.includes(fileExtension)) {
    //         const uniqueId = Date.now() + i; // Użyj unikalnego znacznika czasowego
    //         const newFileName = `file_${uniqueId}.${fileExtension}`;
    //         const renamedFile = new File([file], newFileName, { type: file.type });
    //         validFiles.push(renamedFile);
    //     }
    // }

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExtension = file.name.split(".").pop().toLowerCase();
        if (allowedExtensions.includes(fileExtension)) {
            validFiles.push(file);
        }
    }

    if (validFiles.length > 15) {
        alert("Maximum 15 images can be uploaded.");
        return;
    }

    selectedFiles = validFiles;
    showThumbnails(validFiles);
    resetFileDropArea();

    if (validFiles.length > 0) {
        // uploadFiles(advertisementId); // Replace '123' with the appropriate advertisementId value
    }
}


async function showThumbnails(files) {
    const thumbnailsContainer = document.getElementById('thumbnails');
    thumbnailsContainer.innerHTML = '';

    const maxThumbnails = 15;
    const numThumbnailsToShow = Math.min(files.length, maxThumbnails);

    if(files.length > 1){
        createDropDeleteZone(files);
    }

    for (let i = 0; i < numThumbnailsToShow; i++) {
        const file = files[i];
        const thumbnailElement = document.createElement('img');
        thumbnailElement.className = 'thumbnail';
        thumbnailElement.setAttribute('draggable', true);
        thumbnailElement.setAttribute('data-index', i);
        thumbnailElement.addEventListener('dragstart', handleDragStart);
        thumbnailElement.addEventListener('dragover', handleDragOver);
        thumbnailElement.addEventListener('drop', handleDrop);

        thumbnailsContainer.appendChild(thumbnailElement);

        try {
            const thumbnailDataURL = await readFileAsDataURL(file);
            thumbnailElement.src = thumbnailDataURL;
        } catch (error) {
            console.error(error);
        }
    }
}

function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = event => resolve(event.target.result);
        reader.onerror = event => reject(event.error);
        reader.readAsDataURL(file);
    });
}

let dragSrcElement = null;


function handleDragStart(e) {

    dragSrcElement = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}



function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation(); // Stops some browsers from redirecting.
    }

    if (dragSrcElement !== this) {
        const thumbnailsContainer = document.getElementById('thumbnails');
        const thumbnails = thumbnailsContainer.getElementsByClassName('thumbnail');

        const targetIndex = Array.from(thumbnails).indexOf(this);
        const sourceIndex = Array.from(thumbnails).indexOf(dragSrcElement);

        if(targetIndex<sourceIndex){
            // Swap the positions of the two dragged thumbnails only
            thumbnailsContainer.insertBefore(this, thumbnails[sourceIndex]);
            thumbnailsContainer.insertBefore(dragSrcElement, thumbnails[targetIndex]);

            // Update the selectedFiles array to reflect the new order of files
            const filesCopy = selectedFiles.slice();
            const movedFileSource = filesCopy[sourceIndex];
            filesCopy[sourceIndex] = filesCopy[targetIndex];
            filesCopy[targetIndex] = movedFileSource;

            selectedFiles = filesCopy;

        }

        if(targetIndex > sourceIndex){
            // Swap the positions of the two dragged thumbnails only
            thumbnailsContainer.insertBefore(dragSrcElement, thumbnails[targetIndex].nextSibling);
            thumbnailsContainer.insertBefore(this, dragSrcElement);

            // Update the selectedFiles array to reflect the new order of files
            const filesCopy = selectedFiles.slice();
            const movedFileSource = filesCopy[sourceIndex];
            filesCopy[sourceIndex] = filesCopy[targetIndex];
            filesCopy[targetIndex] = movedFileSource;

            selectedFiles = filesCopy;
        }

    }

    return false;
}



function resetFileDropArea() {
    fileDropArea.innerHTML = "Możesz zmienić kolejność zdjęć za pomocą myszki.\n Pierwsze zdjęcie będzie główną miniaturką";
}
function resetFileDropAreamy() {
    fileDropArea.innerHTML = "Przeciągnij plik tutaj lub kliknij, aby wybrać plik do przesłania.\n Maksymalna ilość zdjęć to 15.";
}
