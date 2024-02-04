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

function funnyh1Paragraph(subContainer) {
    let heading = document.createElement('h1');
    heading.textContent = '112.300';
    heading.setAttribute('contenteditable', 'false');
    heading.setAttribute('spellcheck', 'false');
    heading.style.width = '200px';
    heading.style.height = '75px';
    subContainer.appendChild(heading);
}

function displayLastUploaded(min,max,direction){
    const container = document.getElementById('results2');
    advertisements.slice(min,max).forEach(advertisement => {
        const subContainer = document.createElement('div');
        subContainer.classList.add('sub-container-miniature');
        subContainer.style.color = 'darkgoldenrod';
        subContainer.style.textAlign = 'center';
        subContainer.style.padding = '15px';

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
        title.textContent = advertisement.brand.name + '  ' + advertisement.model.name;
        titleContainerMiniature.appendChild(title);

        const mainPhoto = document.createElement('img');
        mainPhoto.src = '/api/static/photo/' + advertisement.mainPhotoUrl;
        let photoHeight = mainPhoto.style.maxWidth = '300px';
        let photoWidth = mainPhoto.style.maxHeight = '200px';
        mainPhoto.alt = 'MainUrlPhoto';
        mainPhoto.id = 'mainUrlPhoto';
        mainPhoto.style.width = '100%';
        mainPhoto.style.height = '100%';
        mainPhoto.style.objectFit = 'cover';

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

        const lastUploadedIconsDetailsContainer = document.createElement('div');
        lastUploadedIconsDetailsContainer.style.display = 'grid';
        lastUploadedIconsDetailsContainer.style.gridTemplateColumns = 'repeat(3, 1fr)';
        lastUploadedIconsDetailsContainer.style.gridTemplateRows = 'auto auto';
        lastUploadedIconsDetailsContainer.style.gap = '30px';
        lastUploadedIconsDetailsContainer.style.marginTop = '30px';
        lastUploadedIconsDetailsContainer.style.fontSize = '20px';
        lastUploadedIconsDetailsContainer.style.alignItems = 'center';
        lastUploadedIconsDetailsContainer.style.justifyItems = 'center';
        lastUploadedIconsDetailsContainer.style.color = 'white';

        lastUploadedIconsDetailsContainer.appendChild(createInfoDiv(formatInteger(advertisement.mileage), 'mileage', 'mileageValue'));
        lastUploadedIconsDetailsContainer.appendChild(createInfoDiv(advertisement.productionDate, 'productionDate', 'productionDateValue'));
        lastUploadedIconsDetailsContainer.appendChild(createInfoDiv(advertisement.fuelType, 'fuelType', 'fuelTypeValue'));
        lastUploadedIconsDetailsContainer.appendChild(createInfoDiv(formatValue(advertisement.engineType), 'engineType/'+ advertisement.engineType, 'engineValue'));
        lastUploadedIconsDetailsContainer.appendChild(createInfoDiv(formatValue(advertisement.transmissionType), 'transmissionType/'+ advertisement.transmissionType, 'transmissionValue'));
        lastUploadedIconsDetailsContainer.appendChild(createInfoDiv(advertisement.engineHorsePower + 'HP', 'engineHorsePower', 'engineHorsePowerValue'));

        subContainer.appendChild(lastUploadedIconsDetailsContainer);

        handleDarkModeInverse(subContainer);

        funnyNeonTextPrice(subContainer,advertisement.price);

        container.appendChild(subContainer);
        paralaxHover();

    });
}

function createInfoDiv(value, iconName, valueClass) {
    const infoDiv = document.createElement('div');
    infoDiv.style.display = 'flex';
    infoDiv.style.flexDirection = 'column';
    infoDiv.style.alignItems = 'center';
    infoDiv.style.justifyContent = 'center';

    const icon = document.createElement('img');
    icon.src = `/api/static/${iconName}`;
    icon.alt = `${iconName}`;
    icon.style.width = '24px';
    icon.style.marginBottom = '2px';

    const text = document.createElement('span');
    text.textContent = value;
    text.className = valueClass;
    infoDiv.appendChild(icon);
    infoDiv.appendChild(text);

    return infoDiv;
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