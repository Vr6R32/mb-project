let selectedFiles = []; // Store the selected files references in an array
let descriptionContent;
let quill;
let dragSrcElement = null;


document.addEventListener('DOMContentLoaded', function () {

    createForm();
    fetchBrands();
    fetchSpecifications();
    loadFileDrop();
    createDropDeleteZone();

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
    advertisementId = urlParams.get('id');
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


    const form = document.createElement('form');
    form.id = 'advertisementForm';

    const formElements = createFormElements();
    handleFormElementsLogic(formElements, form);

    let horizontalContainer = document.getElementById('half-container-horizontal');

    createDescriptionEditor();

    const submitButton = document.createElement('input');
    submitButton.type = 'button';
    submitButton.value = 'Zapisz';
    submitButton.style.marginBottom = '15px';
    submitButton.style.backgroundColor = "black";
    submitButton.style.color = "white";
    submitButton.style.border = "1px solid darkgoldenrod";
    submitButton.style.padding = "10px 20px";
    submitButton.style.cursor = "pointer";
    submitButton.style.transition = "0.3s";
    submitButton.style.borderRadius = '15px';
    submitButton.style.marginRight = '3px';

    submitButton.addEventListener('click', function() {

        window.removeEventListener('beforeunload', warnOnPageLeave);

        if (!validatePhotos(submitButton)) {
            setFailGif(submitButton);
            return;
        }

        if (!validateForm(formElements,submitButton)) {
            setFailGif(submitButton);
            return;
        }

        setSuccessGif(submitButton);

        submitFormWithFiles();
    });

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
    fileInput.setAttribute('multiple', 'multiple');
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

    handleEvType();

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
    return fetch(`/api/static/photo/${filename}`)
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
            return null;
        });
}
function populateFormData(data) {
    setSelectedOption(document.getElementById('fuelType'), data.fuelType);
    setSelectedOption(document.getElementById('driveType'), data.driveType);
    setSelectedOption(document.getElementById('engineType'), data.engineType);
    setSelectedOption(document.getElementById('transmissionType'), data.transmissionType);
    setSelectedOption(document.getElementById('cityState'), data.cityState);
    document.getElementById('city').value = data.city || '';
    document.getElementById('name').value = data.name || '';
    document.getElementById('mileage').value = data.mileage || '';
    document.getElementById('price').value = data.price || '';
    document.getElementById('engineCapacity').value = data.engineCapacity || '';
    document.getElementById('engineHorsePower').value = data.engineHorsePower || '';
    document.getElementById('productionDate').value = data.productionDate || '';
    document.getElementById('firstRegistrationDate').value = data.firstRegistrationDate || '';
    quill.clipboard.dangerouslyPasteHTML(0, data.description || '');


    fetchModels(data.brand).then(() => {
        const modelSelect = document.getElementById('model');
        Array.from(modelSelect.options).forEach(option => {
            if (option.value === data.model) {
                option.selected = true;
            }
        });
    });

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
    if (selectedFiles.length === 0) {
        alert('Umieść zdjęcia!');
        return;
    }
    const formData = advertisementFormDataExtract();

    fetch('/api/advertisements/'+ advertisementId, {
        method: 'PUT',
        body: formData
    })
        .then(response => {
            if(response.ok){
                resetFileDropArea();
                const redirectURL = response.headers.get('location');
                const parameter = response.headers.get('created');
                if (redirectURL) {
                    window.location.href = redirectURL + '&created='+parameter;
                } else {
                    console.error('Błąd przekierowania: Brak nagłówka "Location" w odpowiedzi serwera.');
                }
            } else {
                handleResponse(response);
            }
        })
        .catch(handleError);
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

        // if (selectedFiles.length < 2) {
        //     let thumbnailzone = document.getElementById('deleteZone');
        //     thumbnailzone.parentNode.removeChild(thumbnailzone);
        // }

        dragSrcElement = null;
    }

    return false;
}
function handleFileDrop(e) {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const totalFiles = files.concat(selectedFiles);
    const allowedExtensions = ["jpg", "png", "heic", "heif","webp"];
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
    const allowedExtensions = ["jpg", "png", "heic", "heif","webp"];
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

    thumbnailsContainer.style.marginTop = '100px';

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

        // createParalaxMiniatureThumbnail(thumbnailElement, thumbnailsContainer);

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
    // paralaxHover();
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

