let selectedFiles = [];
let quill;
let dragSrcElement = null;
let advertisementId = null;


document.addEventListener('DOMContentLoaded', function () {

    createAdvertisementForm('Edytuj swoje ogłoszenie');
    applyAdvertisementFormListeners();

    fetchAdvertisementDetails()
        .then(userData => {
            if(userData.user !== getUserName()){
                window.location = '/';
                return;
            }
            setTimeout(async () => {
                populateFormData(userData);
                try {
                    await showExistingThumbnails(userData.urlList);
                } catch (error) {
                    console.error('There was an error showing the thumbnails:', error);
                }
            }, 400);
        });
});

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
async function showExistingThumbnails(filenames) {
    if (filenames && filenames.length) {
        const imagePromises = filenames.map(filename => fetchImageFromFilename(filename));
        const images = await Promise.all(imagePromises);
        await showThumbnails(images);
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
    document.getElementById('city').value = data.city.name || '';
    document.getElementById('name').value = data.name || '';
    document.getElementById('mileage').value = data.mileage || '';
    document.getElementById('price').value = data.price || '';
    document.getElementById('engineCapacity').value = data.engineCapacity || '';
    document.getElementById('engineHorsePower').value = data.engineHorsePower || '';
    document.getElementById('productionDate').value = data.productionDate || '';
    document.getElementById('firstRegistrationDate').value = data.firstRegistrationDate || '';
    quill.clipboard.dangerouslyPasteHTML(0, data.description || '');


    fetchModels(data.brand.name).then(() => {
        const modelSelect = document.getElementById('model');
        Array.from(modelSelect.options).forEach(option => {
            if (option.value === data.model.name) {
                option.selected = true;
            }
        });
    });

    const brandSelect = document.getElementById('brand');
    Array.from(brandSelect.options).forEach(option => {
        if (option.value === data.brand.name) {
            option.selected = true;
        }
    });


}
function submitFormWithFiles() {
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

