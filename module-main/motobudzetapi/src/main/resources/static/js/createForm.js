let selectedFiles = []; // Store the selected files references in an array

document.addEventListener('DOMContentLoaded', function () {


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

function fetchUserDetails() {
    fetch("http://localhost:20134/api/user/details")
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            let citySelect = document.getElementById('city');
            let cityStateSelect = document.getElementById('cityState');

            // Tworzymy nowy element option
            let optionCity = document.createElement('option');
            optionCity.value = data.cityName; // Ustawiamy wartość na cityStateName
            optionCity.textContent = data.cityName; // Ustawiamy tekst widoczny dla użytkownika

            let optionState = document.createElement('option');
            optionState.value = data.cityStateName; // Ustawiamy wartość na cityStateName
            optionState.textContent = data.cityStateName; // Ustawiamy tekst widoczny dla użytkownika

            // Dodajemy nowy element option do elementu select
            citySelect.appendChild(optionCity);
            cityStateSelect.appendChild(optionState);

            console.log(data); // Tutaj masz dostęp do danych z
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
        { label: 'Tytuł:', type: 'text', id: 'name', name: 'name', required: true },
        { label: 'Opis:', type: 'textarea', id: 'description', name: 'description', required: true },
        { label: 'Marka:', type: 'select', id: 'brand', name: 'brand', onchange: 'fetchModels(this.value)', required: true },
        { label: 'Model:', type: 'select', id: 'model', name: 'model', required: true },
        { label: 'Rodzaj paliwa:', type: 'select', id: 'fuelType', name: 'fuelType', required: true },
        { label: 'Rodzaj napędu:', type: 'select', id: 'driveType', name: 'driveType', required: true },
        { label: 'Rodzaj silnika:', type: 'select', id: 'engineType', name: 'engineType', required: true },
        { label: 'Rodzaj skrzyni biegów:', type: 'select', id: 'transmissionType', name: 'transmissionType', required: true },
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
        { label: 'Cena:', type: 'number', id: 'price', name: 'price', required: true ,
            additionalSelect: {
                label: 'Jednostka:',
                id: 'priceUnit',
                name: 'priceUnit',
                options: ['PLN', 'EUR', 'USD']
            }},
        { label: 'Pojemność silnika (w cm³):', type: 'number', id: 'engineCapacity', name: 'engineCapacity', required: true },
        { label: 'Moc silnika (KM):', type: 'number', id: 'engineHorsePower', name: 'engineHorsePower', required: true },
        { label: 'Data produkcji:', type: 'number', id: 'productionDate', name: 'productionDate', required: true },
        { label: 'Data pierwszej rejestracji:', type: 'date', id: 'firstRegistrationDate', name: 'firstRegistrationDate', required: true },
        {
            label: 'Lokalizacja:',
            type: 'select',
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

            if(element.additionalSelect.id === 'cityState'){
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

    const submitButton = document.createElement('input');
    submitButton.type = 'button';
    submitButton.value = 'Wyślij';
    submitButton.onclick = submitFormWithFiles;
    form.appendChild(submitButton);

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
    fileDropArea.addEventListener('dragover', function(e) {
        e.preventDefault();
    });
    fileDropArea.addEventListener('drop', handleFileDrop);
    fileDropArea.addEventListener('click', function() {
        fileInput.click();
    });

    photoContainer.appendChild(fileDropArea);

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
            })
            .catch(error => console.error('Błąd pobierania modeli:', error));
    } else {
        modelSelect.innerHTML = '<option value="">Wybierz model</option>';
    }
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
    submitForm()
        .then(advertisementId => {
            if (advertisementId) {
                uploadFiles(advertisementId);
            }
        })
        .catch(handleError);
}

function submitForm() {
    const formData = {
        name: getValue('name'),
        description: getValue('description'),
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

    }

    return false;
}


function resetFileDropArea() {
    fileDropArea.innerHTML = "Możesz zmienić kolejność zdjęć za pomocą myszki.\n Pierwsze zdjęcie będzie główną miniaturką";
}
function resetFileDropAreamy() {
    fileDropArea.innerHTML = "Przeciągnij plik tutaj lub kliknij, aby wybrać plik do przesłania.\n Maksymalna ilość zdjęć to 15.";
}
