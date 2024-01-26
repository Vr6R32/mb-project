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
    // handleImageUrl("https://ireland.apollo.olxcdn.com/v1/files/eyJmbiI6ImhubHJ5ZHpwNDhkbzItT1RPTU9UT1BMIiwidyI6W3siZm4iOiJ3ZzRnbnFwNnkxZi1PVE9NT1RPUEwiLCJzIjoiMTYiLCJwIjoiMTAsLTEwIiwiYSI6IjAifV19.wqdGocguDvXytJOqUereVMNG5jyPJ-EWs7IpAIC8EJQ/image.webp");


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
            setTimeout(() => {
                let cityTextarea = document.getElementById('city');
                let cityStateSelect = document.getElementById('cityState');

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

    const formElements = createFormElements();
    handleFormElementsLogic(formElements, form);

    let horizontalContainer = document.getElementById('half-container-horizontal');

    createDescriptionEditor();

    const submitButton = document.createElement('input');
    submitButton.type = 'button';
    submitButton.value = 'Wyślij';
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


    const formData = advertisementFormDataExtract();

    fetch('/api/advertisements', {
        method: 'POST',
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
    const files = Array.from(e.dataTransfer.files);
    updateSelectedFiles(files);
}
function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    updateSelectedFiles(files);
}

function updateSelectedFiles(newFiles) {
    const totalFiles = newFiles.concat(selectedFiles);
    const allowedExtensions = ["jpg", "png", "heic", "heif", "webp"];

    const validFiles = totalFiles.reduce((unique, file) => {
        if (!unique.some(f => f.name === file.name && f.size === file.size) &&
            allowedExtensions.includes(file.name.split(".").pop().toLowerCase())) {
            unique.push(file);
        }
        return unique;
    }, []);

    resetFileDropArea();

    if (validFiles.length > 12) {
        alert("Maximum 12 images can be uploaded.");
        return;
    }

    selectedFiles = validFiles;
    showThumbnails(selectedFiles);
}

async function handleImageUrl(url) {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/heic", "image/heif", "image/webp"];

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok.');

        const blob = await response.blob();

        if (!allowedMimeTypes.includes(blob.type)) {
            alert("Invalid file type. Only images with extensions jpg, png, heic, heif, and webp are allowed.");
            return;
        }

        const file = new File([blob], "image." + blob.type.split("/")[1], { type: blob.type });

        selectedFiles.push(file);
        showThumbnails(selectedFiles);
    } catch (error) {
        console.error("Error fetching image:", error);
        alert("Failed to load image. Please check the URL and try again.");
    }
}


async function showThumbnails(files) {
    const thumbnailsContainer = document.getElementById('thumbnails');
    thumbnailsContainer.innerHTML = '';

    thumbnailsContainer.style.marginTop = '100px';

    const maxThumbnails = 12;
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
