let selectedFiles = [];
let descriptionContent;
let quill;
let dragSrcElement = null;


document.addEventListener('DOMContentLoaded', function () {

    window.onload = function() {
        window.scrollTo(0, 0);
    }

    createForm();
    fetchBrands();
    fetchSpecifications();
    loadFileDrop();
    fetchUserDetails();
    createDropDeleteZone();

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
    fetch(getUrlSite() + "/api/user/details")
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
                optionState.value = data.cityStateName;
                optionState.textContent = data.cityStateName;

                cityStateSelect.appendChild(optionState);

            }, 1000);
        })
        .catch(error => {
            console.error("There was a problem with the fetch operation:", error.message);
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


    const form = document.createElement('form');
    form.id = 'advertisementForm';

    const formElements = [
        { label: 'Tytuł:', type: 'text', id: 'name', name: 'name', required: true },
        // { label: 'Opis ogłoszenia:', type: 'div', id: 'description', name: 'description', required: true },
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
            inputContainer.style.position = "relative";
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
            suggestionsList.style.zIndex = '1000';

            suggestionsList.style.scrollbarWidth = 'thin';
            suggestionsList.style.scrollbarColor = 'darkgoldenrod transparent';
            suggestionsList.style.WebkitScrollbar = 'thin';
            suggestionsList.style.WebkitScrollbarTrack = 'transparent';
            suggestionsList.style.WebkitScrollbarThumb = 'darkgoldenrod';
            suggestionsList.style.WebkitScrollbarThumbHover = 'goldenrod';


            suggestionsList.addEventListener('click', function (event) {
                if (event.target && event.target.nodeName === 'LI') {
                    input.value = event.target.textContent;
                    suggestionsList.style.display = 'none';
                }
            });


            inputContainer.appendChild(input);
            inputContainer.appendChild(suggestionsList);
            form.appendChild(inputContainer);

            let timeoutId;
            const debounceDelay = 200;

            input.addEventListener("input", function () {
                clearTimeout(timeoutId);

                const partialCityName = input.value;

                // Ustawia nowe opóźnienie
                timeoutId = setTimeout(function () {
                    fetch(getUrlSite() + `/api/cities?partialName=${partialCityName}`)
                        .then(response => response.json())
                        .then(data => {
                            updateCitySuggestions(data);
                        })
                        .catch(error => {
                            console.error("Błąd podczas pobierania propozycji miast:", error);
                        });
                }, debounceDelay);
            });
        }



        if (element.additionalSelect) {
            const wrapper = document.createElement('div');
            wrapper.style.display = 'flex';
            wrapper.style.alignItems = 'center';
            wrapper.style.gap = '10px';
            wrapper.style.justifyContent = 'space-between';
            wrapper.style.width = '500px';

            const additionalSelectLabel = document.createElement('label');
            additionalSelectLabel.setAttribute('for', element.additionalSelect.id);
            additionalSelectLabel.textContent = element.additionalSelect.label;

            const additionalSelectInput = document.createElement('select');
            additionalSelectInput.id = element.additionalSelect.id;
            additionalSelectInput.name = element.additionalSelect.name;
            additionalSelectInput.style.width = '50px';

            if(element.additionalSelect.id === 'cityState'){
                additionalSelectInput.style.width = '50%';
            }

            element.additionalSelect.options.forEach(optionValue => {
                const option = document.createElement('option');
                option.value = optionValue;
                option.textContent = optionValue;
                additionalSelectInput.appendChild(option);
            });

            input.style.flex = '1';

            additionalSelectInput.style.flex = 'none';


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
    submitButton.style.padding = "10px 20px";
    submitButton.style.cursor = "pointer";
    submitButton.style.transition = "0.3s";
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

    fileDropArea.innerText = "Przeciągnij plik tutaj lub kliknij, aby wybrać plik do przesłania.\nMaksymalna ilość zdjęć to 12.";

    fileDropArea.addEventListener('drop', handleFileDrop);
    fileDropArea.addEventListener('dragover', function(e) {
        e.preventDefault();
    });
    fileDropArea.addEventListener('drop', handleFileDrop);
    fileDropArea.addEventListener('click', function() {
        fileInput.click();
    });
    handleEvType();

    photoContainer.appendChild(fileDropArea);

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
    const formData
        = advertisementFormDataExtract();
    return fetch(getUrlSite() + '/api/advertisements', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
        .then(handleResponse)
        .catch(handleError);
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

    const apiUrl = getUrlSite() + `/api/advertisements/images/${advertisementId}`;

    console.log(selectedFiles.length);

    fetch(apiUrl, {
        method: 'POST',
        body: formData,
    })

        .then(response => {
            if(response.ok){
                console.log('Odpowiedź serwera:', response);
                resetFileDropArea();
                const redirectURL = response.headers.get('Location');
                const parameter = response.headers.get('created');
                console.log(redirectURL);
                if (redirectURL) {
                    window.location.href = redirectURL + '&created='+parameter;
                } else {
                    console.error('Błąd przekierowania: Brak nagłówka "Location" w odpowiedzi serwera.');
                }
            }
        })
        .catch(error => {
            console.error(error.message);
            resetFileDropArea();
        });
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
        const thumbnailsContainer = document.getElementById('thumbnails');
        const thumbnails = thumbnailsContainer.getElementsByClassName('thumbnail');
        const sourceIndex = Array.from(thumbnails).indexOf(dragSrcElement);

        console.log("Source Index:", sourceIndex);

        dragSrcElement.remove();

        if (sourceIndex > -1) {
            selectedFiles.splice(sourceIndex, 1);
        } else {
            console.warn("Could not find the dragged thumbnail in the list.");
        }
        if(selectedFiles.length < 1){
            resetFileDropAreamy();
        }

        dragSrcElement = null;
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
function resetFileDropAreamy() {
    fileDropArea.innerHTML = "Przeciągnij plik tutaj lub kliknij, aby wybrać plik do przesłania.\n Maksymalna ilość zdjęć to 12.";
}
