let prevPageButton = null;
let advertisements;
let currentMinIndex = 0;
let currentMaxIndex = 4;
const resultsPerPage = 4;

document.addEventListener("DOMContentLoaded", function () {
    const {container, prevPageButton, nextPageButton} = createLastUploadedHeader();
    getLastUploaded(0);

    prevPageButton.style.userSelect = 'none';
    nextPageButton.style.userSelect = 'none';

    prevPageButton.addEventListener('click', () => {
        if (currentMinIndex > 0) {
            clearAdvertisements(container);
            currentMinIndex -= resultsPerPage;
            currentMaxIndex -= resultsPerPage;
            displayLastUploaded(currentMinIndex, currentMaxIndex);
            paralaxHover();
        }
    });

    nextPageButton.addEventListener('click', () => {
        if (currentMaxIndex < advertisements.length) {
            clearAdvertisements(container);
            currentMinIndex += resultsPerPage;
            currentMaxIndex += resultsPerPage;

            if (currentMaxIndex > advertisements.length) {
                currentMaxIndex = advertisements.length;
            }

            displayLastUploaded(currentMinIndex, currentMaxIndex);
            paralaxHover();

        }
    });

    function addHoverEffect(buttonElement) {
        buttonElement.addEventListener('mouseover', () => {
            buttonElement.style.textShadow = '0 0 10px moccasin';
            buttonElement.style.cursor = 'pointer';
            buttonElement.style.color = 'moccasin';
        });

        buttonElement.addEventListener('mouseout', () => {
            buttonElement.style.textShadow = '0 0 10px darkgoldenrod';
            buttonElement.style.cursor = 'default';
            buttonElement.style.color = 'darkgoldenrod';
        });
    }

    addHoverEffect(prevPageButton);
    addHoverEffect(nextPageButton);
});

function createLastUploadedHeader() {
    const container = document.getElementById('container-main');

    const title = document.createElement('h2');
    title.textContent = 'Ostatnio Dodane';
    title.classList.add('last-uploaded-title');

    const titleContainer = document.createElement('div');
    titleContainer.style.fontWeight = "bold";
    titleContainer.style.color = "darkgoldenrod";
    titleContainer.style.textAlign = 'center';
    titleContainer.style.width = '1400px';
    titleContainer.style.height = '70px';
    titleContainer.style.display = 'flex';
    titleContainer.style.justifyContent = 'space-between';
    titleContainer.style.alignItems = 'center';

    const arrowButtonContainer = document.createElement('div');
    arrowButtonContainer.style.display = 'flex';
    arrowButtonContainer.style.justifyContent = 'space-between';
    arrowButtonContainer.style.alignItems = 'center';
    arrowButtonContainer.style.marginTop = '10px';

    const prevPageButton = document.createElement('buttonPrev');
    prevPageButton.textContent = '←';
    prevPageButton.id = 'prevPageButton';
    prevPageButton.style.fontSize = '72px';
    prevPageButton.style.textShadow = '1px 0px black, -1px 0px black, 0px 1px black, 0px -1px black';

    const nextPageButton = document.createElement('buttonNext');
    nextPageButton.textContent = '→';
    nextPageButton.id = 'nextPageButton';
    nextPageButton.style.fontSize = '72px';
    prevPageButton.style.textShadow = '1px 0px black, -1px 0px black, 0px 1px black, 0px -1px black';

    arrowButtonContainer.appendChild(prevPageButton);
    arrowButtonContainer.appendChild(nextPageButton);

    titleContainer.style.marginTop = '15px';

    titleContainer.appendChild(prevPageButton);
    titleContainer.appendChild(title);
    titleContainer.appendChild(nextPageButton);

    let lastUploadedResults = document.getElementById('results2');
    container.insertBefore(titleContainer,lastUploadedResults);
    return {container, prevPageButton, nextPageButton};
}

function getLastUploaded(pageNumber){

    const results2 = document.getElementById('results2');
    results2.style.marginTop = "50px";
    results2.style.width = "100%";
    results2.style.marginBottom = "0px";
    results2.style.maxWidth = "100%";
    results2.innerHTML = "";
    results2.style.minHeight = '650px';


    fetch('/api/advertisements/last-uploaded?pageNumber=' + pageNumber)

        .then(response => response.json())
        .then(data => {
            advertisements = data;
            displayLastUploaded(currentMinIndex,currentMaxIndex);
            paralaxHover();
        })
        .catch(error => {
            console.error('Błąd pobierania danych:', error);
        });
}

function displayLastUploaded(min,max){
    const container = document.getElementById('results2');
    advertisements.slice(min,max).forEach(advertisement => {
        const subContainer = document.createElement('div');
        subContainer.classList.add('sub-container-miniature');
        subContainer.style.color = 'darkgoldenrod';
        subContainer.style.textAlign = 'center';

        subContainer.addEventListener('mouseout', () => {
            subContainer.style.boxShadow = '0 0 20px darkgoldenrod';
        });

        subContainer.addEventListener('mouseover', () => {
            subContainer.style.boxShadow = '0 0 20px moccasin';
        });

        // const fadeEffect = document.createElement('div');
        // fadeEffect.classList.add('fade-effect-miniature');

        const titleContainerMiniature = document.createElement('div');
        titleContainerMiniature.classList.add('title-container-miniature');
        titleContainerMiniature.style.color = 'darkgoldenrod';
        titleContainerMiniature.style.textAlign = 'center';

        subContainer.appendChild(titleContainerMiniature)

        const title = document.createElement('h2');
        title.textContent = advertisement.brand + '  ' + advertisement.model;
        titleContainerMiniature.appendChild(title);

        const mainPhoto = document.createElement('img');
        mainPhoto.src = '/api/static/photo/' + advertisement.mainPhotoUrl;
        let photoHeight = mainPhoto.style.maxWidth = '300px';
        let photoWidth = mainPhoto.style.maxHeight = '200px';
        mainPhoto.alt = 'MainUrlPhoto';
        mainPhoto.id = 'mainUrlPhoto';

        const photoDiv = document.createElement('div');
        photoDiv.style.display = 'flex';           // Enable flexbox
        photoDiv.style.justifyContent = 'center';   // Center horizontally
        photoDiv.style.alignItems = 'center';       // Center vertically
            // Make sure the div takes up full width of its container


        createParalaxMiniatureLastUploaded(mainPhoto, photoDiv,photoHeight,photoWidth);
        // fadeEffect.appendChild(mainPhoto);
        // subContainer.appendChild(fadeEffect);

        subContainer.appendChild(photoDiv);



        mainPhoto.addEventListener('mouseover', () => {
            mainPhoto.style.cursor = 'pointer';
        });

        mainPhoto.addEventListener('mouseout', () => {
            mainPhoto.style.cursor = 'default';
        });

        mainPhoto.addEventListener('click', () => {
            window.location.href = '/advertisement?id=' + advertisement.id;
        });

        const infoContainerFirst = document.createElement('div');
        infoContainerFirst.style.display = 'flex';
        infoContainerFirst.style.alignItems = 'center';
        infoContainerFirst.style.justifyContent = 'space-evenly';
        infoContainerFirst.style.justifyContent = 'center';
        infoContainerFirst.style.marginTop = '30px';

        const infoContainerSecond = document.createElement('div');
        infoContainerSecond.style.display = 'flex';
        infoContainerSecond.style.alignItems = 'center';
        infoContainerSecond.style.justifyContent = 'space-evenly';
        infoContainerSecond.style.justifyContent = 'center';
        infoContainerSecond.style.marginTop = '30px';

        const mileageInfo = document.createElement('div');
        mileageInfo.style.display = 'flex';
        mileageInfo.style.flexDirection = 'column';
        mileageInfo.style.alignItems = 'center';
        mileageInfo.style.marginRight = '30px';

        const mileageIcon = document.createElement('img');
        mileageIcon.src = '/api/static/mileage';
        mileageIcon.alt = 'MileageIcon';
        mileageIcon.style.marginBottom = '2px';

        const mileageValue = document.createElement('span');
        mileageValue.textContent = advertisement.mileage;
        mileageInfo.appendChild(mileageIcon);
        mileageInfo.appendChild(mileageValue);

        const productionDateInfo = document.createElement('div');
        productionDateInfo.style.display = 'flex';
        productionDateInfo.style.flexDirection = 'column';
        productionDateInfo.style.alignItems = 'center';

        const productionDateIcon = document.createElement('img');
        productionDateIcon.src = '/api/static/productionDate';
        productionDateIcon.alt = 'ProductionDateIcon';
        productionDateIcon.style.marginBottom = '2px';

        const productionDateValue = document.createElement('span');
        productionDateValue.textContent = advertisement.productionDate
        productionDateInfo.appendChild(productionDateIcon);
        productionDateInfo.appendChild(productionDateValue);

        const fuelTypeInfo = document.createElement('div');
        fuelTypeInfo.style.display = 'flex';
        fuelTypeInfo.style.flexDirection = 'column';
        fuelTypeInfo.style.alignItems = 'center';
        fuelTypeInfo.style.marginLeft = '30px';

        const fuelTypeIcon = document.createElement('img');
        fuelTypeIcon.src = '/api/static/fuelType';
        fuelTypeIcon.alt = 'FuelTypeIcon';
        fuelTypeIcon.style.marginBottom = '2px';

        const fuelTypeValue = document.createElement('span');
        fuelTypeValue.textContent = advertisement.fuelType;
        fuelTypeInfo.appendChild(fuelTypeIcon);
        fuelTypeInfo.appendChild(fuelTypeValue);

        const transmissionInfo = document.createElement('div');
        transmissionInfo.style.display = 'flex';
        transmissionInfo.style.flexDirection = 'column';
        transmissionInfo.style.alignItems = 'center';

        const transmissionIcon = document.createElement('img');
        transmissionIcon.src = '/api/static/transmissionType/' + advertisement.transmissionType;
        transmissionIcon.alt = 'TransmissionIcon';
        transmissionIcon.style.marginBottom = '2px';

        const transmissionValue = document.createElement('span');
        transmissionValue.textContent = advertisement.transmissionType;
        transmissionInfo.appendChild(transmissionIcon);
        transmissionInfo.appendChild(transmissionValue);

        const engineInfo = document.createElement('div');
        engineInfo.style.display = 'flex';
        engineInfo.style.flexDirection = 'column';
        engineInfo.style.alignItems = 'center';
        engineInfo.style.marginRight = '30px';

        const engineIcon = document.createElement('img');
        engineIcon.src = '/api/static/engineType/' + advertisement.engineType;
        engineIcon.alt = 'EngineIcon';
        engineIcon.style.marginBottom = '2px';

        const engineValue = document.createElement('span');
        engineValue.textContent = advertisement.engineType;
        engineInfo.appendChild(engineIcon);
        engineInfo.appendChild(engineValue);

        const engineHorsePowerInfo = document.createElement('div');
        engineHorsePowerInfo.style.display = 'flex';
        engineHorsePowerInfo.style.flexDirection = 'column';
        engineHorsePowerInfo.style.alignItems = 'center';
        engineHorsePowerInfo.style.marginLeft = '30px';

        const engineHorsePowerIcon = document.createElement('img');
        engineHorsePowerIcon.src = '/api/static/engineHorsePower';
        engineHorsePowerIcon.alt = 'EngineIcon';
        engineHorsePowerIcon.style.marginBottom = '2px';

        const engineHorsePowerValue = document.createElement('span');
        engineHorsePowerValue.textContent = advertisement.engineHorsePower + ' KM';
        engineHorsePowerInfo.appendChild(engineHorsePowerIcon);
        engineHorsePowerInfo.appendChild(engineHorsePowerValue);

        infoContainerFirst.appendChild(mileageInfo);
        infoContainerFirst.appendChild(productionDateInfo);
        infoContainerFirst.appendChild(fuelTypeInfo);

        infoContainerSecond.appendChild(engineInfo)
        infoContainerSecond.appendChild(transmissionInfo)
        infoContainerSecond.appendChild(engineHorsePowerInfo)


        infoContainerFirst.style.fontSize = '20px';
        infoContainerSecond.style.fontSize = '20px';

        subContainer.appendChild(infoContainerFirst);
        subContainer.appendChild(infoContainerSecond);

        handleDarkModeInverse(subContainer);

        container.appendChild(subContainer);




    });
}



function clearAdvertisements(container) {
    const advertisementElements = container.getElementsByClassName('sub-container-miniature');
    while (advertisementElements.length > 0) {
        advertisementElements[0].remove();
    }
}
