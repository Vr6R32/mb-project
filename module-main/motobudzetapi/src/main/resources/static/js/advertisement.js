const currentURL = window.location.href;
const advertisementId = extractAdvertisementId(currentURL);

function extractAdvertisementId(currentURL) {
    const urlParts = currentURL.split('/');
    const advertisementId = urlParts[urlParts.length - 1];
    console.log('advertisementId:', advertisementId); // Dodaj ten log
    return advertisementId;
}

fetch('/api/advertisements/' + advertisementId)
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('container-main');
        // container.style.display = 'flex';
        // container.style.textAlign = 'left';
        const advertisement = data; // Używamy pojedynczego obiektu, nie listy

        const subContainer = document.createElement('div');
        subContainer.classList.add('sub-container-big');
        subContainer.style.color = 'darkgoldenrod';
        subContainer.style.textAlign = 'center';

        const titleContainer = document.createElement('div');
        titleContainer.classList.add('title-container');
        titleContainer.style.color = 'darkgoldenrod';
        titleContainer.style.textAlign = 'center';

        const title = document.createElement('h2');
        title.textContent = advertisement.name;

        // const description = document.createElement('p');
        // description.textContent = advertisement.description;

        titleContainer.appendChild(title);
        // titleContainer.appendChild(description);



        const fadeEffect = document.createElement('div');
        fadeEffect.classList.add('fade-effect-big');

        const mainPhoto = document.createElement('img');
        mainPhoto.src = '/api/resources/advertisementPhoto/half/miniature/' + advertisement.urlList[0];
        mainPhoto.alt = 'MainUrlPhoto';
        mainPhoto.id = 'mainUrlPhoto';

        fadeEffect.appendChild(mainPhoto);
        subContainer.appendChild(fadeEffect);

        const arrowContainer = document.createElement('div');
        arrowContainer.style.display = 'flex';
        arrowContainer.style.justifyContent = 'center';
        arrowContainer.style.marginTop = '10px';

        const previousArrow = document.createElement('span');
        previousArrow.textContent = '←';
        previousArrow.style.cursor = 'pointer';
        previousArrow.style.fontSize = '36px';
        previousArrow.style.marginRight = '10px';
        previousArrow.addEventListener('click', () => previousPhoto(advertisement));

        const nextArrow = document.createElement('span');
        nextArrow.textContent = '→';
        nextArrow.style.cursor = 'pointer';
        nextArrow.style.fontSize = '36px';
        nextArrow.addEventListener('click', () => nextPhoto(advertisement));

        arrowContainer.appendChild(previousArrow);
        arrowContainer.appendChild(nextArrow);

        subContainer.appendChild(arrowContainer);

        const infoContainer = document.createElement('div');
        infoContainer.style.display = 'flex';
        infoContainer.style.alignItems = 'center';
        infoContainer.style.justifyContent = 'center';
        infoContainer.style.marginTop = '50px';

        const mileageInfo = document.createElement('div');
        mileageInfo.style.display = 'flex';
        mileageInfo.style.flexDirection = 'column';
        mileageInfo.style.alignItems = 'center';
        mileageInfo.style.marginRight = '30px';

        const mileageIcon = document.createElement('img');
        mileageIcon.src = '/api/resources/mileage';
        mileageIcon.alt = 'MileageIcon';

        const mileageValue = document.createElement('span');
        mileageValue.textContent = advertisement.mileage;
        mileageInfo.appendChild(mileageIcon);
        mileageInfo.appendChild(mileageValue);

        const productionDateInfo = document.createElement('div');
        productionDateInfo.style.display = 'flex';
        productionDateInfo.style.flexDirection = 'column';
        productionDateInfo.style.alignItems = 'center';

        const productionDateIcon = document.createElement('img');
        productionDateIcon.src = '/api/resources/productionDate';
        productionDateIcon.alt = 'ProductionDateIcon';

        const productionDateValue = document.createElement('span');
        productionDateValue.textContent = advertisement.productionDate;
        productionDateInfo.appendChild(productionDateIcon);
        productionDateInfo.appendChild(productionDateValue);

        const fuelTypeInfo = document.createElement('div');
        fuelTypeInfo.style.display = 'flex';
        fuelTypeInfo.style.flexDirection = 'column';
        fuelTypeInfo.style.alignItems = 'center';
        fuelTypeInfo.style.marginLeft = '30px';

        const fuelTypeIcon = document.createElement('img');
        fuelTypeIcon.src = '/api/resources/fuelType';
        fuelTypeIcon.alt = 'FuelTypeIcon';

        const fuelTypeValue = document.createElement('span');
        fuelTypeValue.textContent = advertisement.fuelType.name
        fuelTypeValue.textContent = advertisement.fuelType.name
        fuelTypeInfo.appendChild(fuelTypeIcon);
        fuelTypeInfo.appendChild(fuelTypeValue);

        infoContainer.appendChild(mileageInfo);
        infoContainer.appendChild(productionDateInfo);
        infoContainer.appendChild(fuelTypeInfo);

        subContainer.appendChild(infoContainer);

            container.appendChild(titleContainer);
            container.appendChild(subContainer);

        // Obsługa zmiany zdjęcia po kliknięciu strzałki
        let currentPhotoIndex = 0;

        const changePhoto = (index) => {
            mainPhoto.src = '/api/resources/advertisementPhoto/half/miniature/' + advertisement.urlList[index];
            mainPhoto.alt = 'MainUrlPhoto';
        };

        const previousPhoto = (advertisement) => {
            if (currentPhotoIndex > 0) {
                currentPhotoIndex--;
            } else {
                currentPhotoIndex = advertisement.urlList.length - 1;
            }
            changePhoto(currentPhotoIndex);
        };

        const nextPhoto = (advertisement) => {
            if (currentPhotoIndex < advertisement.urlList.length - 1) {
                currentPhotoIndex++;
            } else {
                currentPhotoIndex = 0;
            }
            changePhoto(currentPhotoIndex);
        };
    })
    .catch(error => {
        console.error('Błąd pobierania danych:', error);
    });
