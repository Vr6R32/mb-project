let prevPageButton = null;
let advertisements;
let currentMinIndex = 0;
let currentMaxIndex = 4;
const resultsPerPage = 4;

function handlePaginationArrows(prevPageButton, nextPageButton, container) {
    prevPageButton.style.userSelect = 'none';
    nextPageButton.style.userSelect = 'none';

    prevPageButton.addEventListener('click', () => {
        if (currentMinIndex > 0) {
            currentMinIndex -= resultsPerPage;
            currentMaxIndex -= resultsPerPage;
            clearAdvertisements(container, 'left');
            setTimeout(() => {
                displayLastUploaded(currentMinIndex, currentMaxIndex, 'right');
            }, 500);
        }
    });

    nextPageButton.addEventListener('click', () => {
        if (currentMaxIndex < advertisements.length) {
            currentMinIndex += resultsPerPage;
            currentMaxIndex += resultsPerPage;
            clearAdvertisements(container, 'right');
            setTimeout(() => {
                displayLastUploaded(currentMinIndex, currentMaxIndex, 'left');
            }, 500);
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
}

document.addEventListener("DOMContentLoaded", function () {
    const {container, prevPageButton, nextPageButton} = createLastUploadedContainer();
    getLastUploaded(0);
    handlePaginationArrows(prevPageButton, nextPageButton, container);
});



function animateImages(container, addAnimationClass, activeAnimationClass) {
    const images = container.querySelectorAll('img');
    images.forEach(image => {
        image.classList.add(addAnimationClass);
        setTimeout(() => {
            image.classList.add(activeAnimationClass);
        }, 500);
    });
    const figures = container.querySelectorAll('figure');
    figures.forEach(figure => {
        figure.classList.add(addAnimationClass);
        setTimeout(() => {
            figure.classList.add(activeAnimationClass);
        }, 500);
    });
}
function displayLastUploaded(min,max,direction){
    const container = document.getElementById('results2');
    advertisements.slice(min,max).forEach(advertisement => {
        const subContainer = document.createElement('div');
        subContainer.classList.add('sub-container-miniature');
        subContainer.style.color = 'darkgoldenrod';
        subContainer.style.textAlign = 'center';

        subContainer.classList.add(direction === 'left' ? 'slide-left-enter' : 'slide-right-enter');
        setTimeout(() => {
            subContainer.classList.add(direction === 'left' ? 'slide-left-enter-active' : 'slide-right-enter-active');
        }, 50);

        animateImages(subContainer, direction === 'left' ? 'slide-left-enter' : 'slide-right-enter',
            direction === 'left' ? 'slide-left-enter-active' : 'slide-right-enter-active');

        subContainer.addEventListener('mouseout', () => {
            subContainer.style.boxShadow = '0 0 20px darkgoldenrod';
        });

        subContainer.addEventListener('mouseover', () => {
            subContainer.style.boxShadow = '0 0 20px moccasin';
        });


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
        photoDiv.style.display = 'flex';
        photoDiv.style.justifyContent = 'center';
        photoDiv.style.alignItems = 'center';


        createParalaxMiniatureLastUploaded(mainPhoto, photoDiv,photoHeight,photoWidth);

        subContainer.appendChild(photoDiv);



        mainPhoto.addEventListener('mouseover', () => {
            mainPhoto.style.cursor = 'pointer';
        });

        mainPhoto.addEventListener('mouseout', () => {
            mainPhoto.style.cursor = 'default';
        });

        mainPhoto.addEventListener('click', () => {
            window.location.href = '/advertisement?id=' + advertisement.id + '&title=' + advertisement.name;
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
function clearAdvertisements(container, direction) {
    const advertisementElements = [...container.getElementsByClassName('sub-container-miniature')];
    advertisementElements.forEach(elem => {

        animateImages(elem, direction === 'right' ? 'slide-left-exit' : 'slide-right-exit',
            direction === 'right' ? 'slide-left-exit-active' : 'slide-right-exit-active');

        elem.classList.add(direction === 'right' ? 'slide-left-exit' : 'slide-right-exit');
        setTimeout(() => {
            elem.classList.add('to-remove');
            elem.classList.add(direction === 'right' ? 'slide-left-exit-active' : 'slide-right-exit-active');
        }, 50);
    });

    setTimeout(() => {
        advertisementElements.filter(elem => elem.classList.contains('to-remove')).forEach(elem => elem.remove());
    }, 500);
}