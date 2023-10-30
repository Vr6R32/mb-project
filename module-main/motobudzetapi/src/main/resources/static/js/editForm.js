let selectedFiles = []; // Store the selected files references in an array
let descriptionContent;
let quill;
let dragSrcElement = null;


document.addEventListener('DOMContentLoaded', function () {

    createForm();
    fetchBrands();
    fetchSpecifications();
    loadFileDrop();

    document.addEventListener('dragover', function (e) {
        e.preventDefault();
    });
    document.addEventListener('drop', function (e) {
        e.preventDefault();
    });

    window.onload = function() {
        window.scrollTo(0, 0);
    }
    window.addEventListener('beforeunload', warnOnPageLeave);

});


document.addEventListener('click', function(event) {
    let suggestionsList = document.getElementById('suggestionsList');
    if (!suggestionsList.contains(event.target)) {
        suggestionsList.style.display = 'none';
    }
});


function warnOnPageLeave(e) {
    let message = 'Czy na pewno chcesz opuścić tę stronę?';
    e.returnValue = message;
    return message;
}
function fetchAdvertisementDetails() {
    extractAdvertisementId();

    return fetch(`/api/advertisements/${advertisementId}`)
        .then(response => {
            if (!response.ok) {
                window.location = '/';
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
    title.textContent = 'Edytuj swoje ogłoszenie';
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
    submitButton.value = 'Zapisz';
    submitButton.style.marginBottom = '15px';
    submitButton.onclick = function() {

        window.removeEventListener('beforeunload', warnOnPageLeave);
        submitFormWithFiles();


    };
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

    fileDropArea.innerText = "Przeciągnij plik tutaj lub kliknij, aby wybrać plik do przesłania.\nMaksymalna ilość zdjęć to 12.";

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
            if(userData.user !== getUserName()){
                window.location = '/';
                return;
            }
            setTimeout(() => {
                populateFormData(userData);
                showExistingThumbnails(userData.urlList)
            }, 200);
        });

}
async function showExistingThumbnails(filenames) {
    if (filenames && filenames.length) {
        const imagePromises = filenames.map(filename => fetchImageFromFilename(filename));
        const images = await Promise.all(imagePromises);
        showThumbnails(images);
    }
}
function fetchImageFromFilename(filename) {
    return fetch(`/api/resources/advertisementPhoto/${filename}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch image for filename: ${filename}`);
            }
            // return response.blob();

            return response.blob().then(blob => ({
                blob,
                name: filename
            }));

        })
        .catch(error => {
            console.error("Error fetching image:", error);
            return null; // or handle this error more gracefully
        });
}
function populateFormData(data) {
    // Here, you can populate each field in your form using the data
    document.getElementById('name').value = data.name || '';
    setSelectedOption(document.getElementById('fuelType'), data.fuelType);
    setSelectedOption(document.getElementById('driveType'), data.driveType);
    setSelectedOption(document.getElementById('engineType'), data.engineType);
    setSelectedOption(document.getElementById('transmissionType'), data.transmissionType);
    document.getElementById('city').value = data.city || '';
    setSelectedOption(document.getElementById('cityState'), data.cityState);
    document.getElementById('mileage').value = data.mileage || '';
    document.getElementById('price').value = data.price || '';
    document.getElementById('engineCapacity').value = data.engineCapacity || '';
    document.getElementById('engineHorsePower').value = data.engineHorsePower || '';
    document.getElementById('productionDate').value = data.productionDate || '';
    document.getElementById('firstRegistrationDate').value = data.firstRegistrationDate || '';
    quill.clipboard.dangerouslyPasteHTML(0, data.description || '');


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



    return fetch('/api/advertisements/'+ advertisementId, {
        method: 'PUT',
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
    // formData.append('mainPhotoUrl',selectedFiles[0].name)


    selectedFiles.forEach((file) => {
        if (file.blob instanceof Blob) {
            formData.append('files', file.blob , file.name); // Use the same parameter name 'files' for each file
        } else {
            formData.append('files',file);
        }
    });

    // const apiUrl = selectedFiles.length > 1 ? `/api/advertisement/images/${advertisementId}` : `/api/advertisement/image/${advertisementId}`;
    const apiUrl = `/api/advertisements/images/${advertisementId}`;


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
                const parameter = response.headers.get('edited');
                console.log(redirectURL);
                if (redirectURL) {
                    // Wykonaj przekierowanie na określony adres URL
                    window.location.href = redirectURL + '&edited='+parameter;
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

        const trashIcon = document.createElement('img');
        trashIcon.src = `/api/resources/trashClosed`;
        trashIcon.alt = 'trashIcon';


        const deleteZone = document.createElement('div');

        deleteZone.id = 'deleteZone';

        deleteZone.style.position = 'absolute';
        deleteZone.style.top = '60px';


        deleteZone.appendChild(trashIcon);

        deleteZone.addEventListener('mouseover', function() {
            trashIcon.src = '/api/resources/trashOpen'; // Switch to open trash icon
        });
        deleteZone.addEventListener('mouseout', function() {
            trashIcon.src = '/api/resources/trashClosed'; // Switch back to closed trash icon
        });

        deleteZone.addEventListener('dragover', handleDeleteZoneDragOver);
        deleteZone.addEventListener('drop', handleDeleteZoneDrop);

        deleteZone.addEventListener('dragenter', function() {
            trashIcon.src = '/api/resources/trashOpen'; // Switch to open trash icon
        });
        deleteZone.addEventListener('dragleave', function() {
            trashIcon.src = '/api/resources/trashClosed'; // Switch back to closed trash icon
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

        if (selectedFiles.length < 2) {
            let thumbnailzone = document.getElementById('deleteZone');
            thumbnailzone.parentNode.removeChild(thumbnailzone);
        }

        dragSrcElement = null; // Resetuj źródłowy element przeciągania
    }

    return false;
}
function handleFileDrop(e) {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const totalFiles = files.concat(selectedFiles);
    const allowedExtensions = ["jpg", "png", "heic", "heif"];
    const validFiles = totalFiles.filter(file => {
        const fileExtension = file.name.split(".").pop().toLowerCase();
        return allowedExtensions.includes(fileExtension);
    });

    resetFileDropArea();

    if (validFiles.length > 12) {
        alert("Maximum 12 images can be uploaded.");
        return;
    }

    if (validFiles.length > 0) {
        selectedFiles = validFiles;
        showThumbnails(selectedFiles);
    } else {
        resetFileDropAreamy();
    }
}
function handleFileSelect(e) {
    const fileInput = e.target;
    const files = Array.from(fileInput.files);
    const totalFiles = files.concat(selectedFiles);
    const allowedExtensions = ["jpg", "png", "heic", "heif"];
    const validFiles = totalFiles.filter(file => {
        const fileExtension = file.name.split(".").pop().toLowerCase();
        return allowedExtensions.includes(fileExtension);
    });

    if (validFiles.length > 12) {
        alert("Maximum 12 images can be uploaded.");
        return;
    }

    if (validFiles.length > 0) {
        selectedFiles = validFiles;
        showThumbnails(selectedFiles);
        resetFileDropArea();
    }
}
async function showThumbnails(files) {
    const thumbnailsContainer = document.getElementById('thumbnails');
    thumbnailsContainer.innerHTML = '';

    const maxThumbnails = 12;
    const numThumbnailsToShow = Math.min(files.length, maxThumbnails);

    if (files.length > 1) {
        createDropDeleteZone(files);
    }

    for (let i = 0; i < numThumbnailsToShow; i++) {
        const fileObj = files[i];
        const thumbnailElement = document.createElement('img');

        thumbnailElement.className = 'thumbnail';
        thumbnailElement.setAttribute('draggable', true);
        thumbnailElement.setAttribute('data-index', i);
        thumbnailElement.addEventListener('dragstart', handleDragStart);
        thumbnailElement.addEventListener('dragover', handleDragOver);
        thumbnailElement.addEventListener('drop', handleDrop);

        thumbnailsContainer.appendChild(thumbnailElement);

        try {
            let thumbnailDataURL;

            // Check if the fileObj has a blob property, indicating that it's the expected object
            if (fileObj.blob instanceof Blob) {
                thumbnailDataURL = await readFileAsDataURL(fileObj.blob);
                const fileData = {
                    blob: fileObj.blob,
                    name: fileObj.name
                };

                // Check if this file is already in the selectedFiles array
                const isFileAlreadyPresent = selectedFiles.some(existingFile => existingFile.name === fileObj.name);

                if (!isFileAlreadyPresent) {
                    selectedFiles.push(fileData);
                }
            } else {
                thumbnailDataURL = await readFileAsDataURL(fileObj)
            }

            thumbnailElement.src = thumbnailDataURL;
        } catch (error) {
            console.error("Error setting thumbnail source:", error);
        }
    }
}
function resetFileDropAreamy() {
    fileDropArea.innerHTML = "Przeciągnij plik tutaj lub kliknij, aby wybrać plik do przesłania.\n Maksymalna ilość zdjęć to 12.";
}
function setSelectedOption(selectElement, value) {
    setTimeout(() => {
        Array.from(selectElement.options).forEach(option => {
            if (option.value === value) {
                option.selected = true;
            } else {
                option.selected = false;
            }
        });
    }, 500);
}

