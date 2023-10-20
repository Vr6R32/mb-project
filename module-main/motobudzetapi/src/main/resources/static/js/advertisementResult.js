function createAdvertisementResultDiv(mainContainer,advertisement) {
    const resultDiv = document.createElement("advertisementResultDiv");
    resultDiv.id = "advertisementResultDiv";

    const imageDiv = document.createElement('mainImageDiv');
    imageDiv.style.width = '100%'; // Ustawienie tła na czarny
    imageDiv.style.justifyContent = 'space-between'; // Wyrównanie elementów na krańcach w poziomie
    imageDiv.style.display = 'flex';
    imageDiv.style.alignItems = 'center'; // Wyśrodkowanie w pionie
    // imageDiv.style.backgroundColor = 'transparent';

    console.log(advertisement);

    const mainPhoto = document.createElement('img');
    mainPhoto.src = '/api/resources/advertisementPhoto/' + advertisement.urlList[0];
    mainPhoto.style.height = '675px';
    mainPhoto.alt = 'MainUrlPhoto';
    mainPhoto.id = 'mainUrlPhoto';
    // mainPhoto.style.color = 'black';
    // mainPhoto.style.backgroundColor = 'rgba(0,0,0, 0.9)'; // Ustawienie tła na czarny
    mainPhoto.style.backgroundColor = 'transparent'; // Ustawienie tła na czarny
    mainPhoto.style.width = '100%'; // Ustawienie tła na czarny

    const previousArrow = document.createElement('span');
    previousArrow.textContent = '←';
    previousArrow.style.cursor = 'pointer';
    previousArrow.style.fontSize = '72px';
    previousArrow.style.color = 'darkgoldenrod';
    previousArrow.addEventListener('click', () => previousPhoto(mainPhoto));

    const nextArrow = document.createElement('span');
    nextArrow.textContent = '→';
    nextArrow.style.cursor = 'pointer';
    nextArrow.style.fontSize = '72px';
    nextArrow.style.color = 'darkgoldenrod';
    nextArrow.addEventListener('click', () => nextPhoto(mainPhoto));

    const fadeEffect = document.createElement('div');
    fadeEffect.classList.add('fade-effect-big');
    fadeEffect.style.backgroundColor = 'transparent';


    fadeEffect.appendChild(mainPhoto);
    imageDiv.appendChild(previousArrow)
    imageDiv.appendChild(fadeEffect)
    imageDiv.appendChild(nextArrow)


    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
            previousPhoto(mainPhoto);
        } else if (event.key === 'ArrowRight') {
            nextPhoto(mainPhoto);
        }
    });

    resultDiv.appendChild(imageDiv);

    const advertisementDetailsHeader = document.createElement("advertisementDetailsHeader");
    advertisementDetailsHeader.style.width = '100%'; // Dopasowanie do szerokości resultDiv
    advertisementDetailsHeader.style.display = 'flex'; // Ustawienie flexbox
    advertisementDetailsHeader.style.justifyContent = 'space-between'; // Umieszczenie elementów na końcach kontenera
    advertisementDetailsHeader.style.alignItems = 'center'; // Wyśrodkowanie elementów w pionie
    advertisementDetailsHeader.style.boxSizing = "border-box";
    advertisementDetailsHeader.style.flexBasis = "auto";

    const nameElement = document.createElement("div");
    nameElement.textContent = advertisement.name;
    nameElement.style.color = "white"; // Dostosuj kolor tekstu
    nameElement.style.fontSize = "24px"; // Dostosuj rozmiar tekstu
    nameElement.style.textAlign = 'left';

    const dateElement = document.createElement("dateDiv");
    dateElement.textContent = 'Dodane ' + advertisement.creationDate;
    dateElement.style.color = "darkgoldenrod"; // Dostosuj kolor tekstu
    dateElement.style.fontSize = "18px"; // Dostosuj rozmiar tekstu
    dateElement.style.textAlign = 'right';
    dateElement.style.marginLeft = 'auto'; // Wyrównaj od prawej krawędzi
    dateElement.style.whiteSpace = 'nowrap'; // T

    // mainContainer.appendChild(dateElement);
    // mainContainer.insertBefore(dateElement, titleDiv);

    advertisementDetailsHeader.appendChild(nameElement);
    // advertisementDetailsHeader.appendChild(dateElement);


    const advertisementDetailsDiv = document.createElement("advertisementDetailsDiv");
    advertisementDetailsDiv.style.width = '100%'; // Dopasowanie do szerokości resultDiv
    advertisementDetailsDiv.style.flexBasis = 'auto';
    advertisementDetailsDiv.style.display = 'flex-start';
    advertisementDetailsDiv.style.flexDirection = 'column'; // Ustawienia pionowego układu


    const advertisementDetailsMain = document.createElement("advertisementDetailsMain");
    advertisementDetailsMain.style.width = '100%'; // Dopasowanie do szerokości resultDiv
    advertisementDetailsMain.style.flexBasis = 'auto';
    advertisementDetailsMain.style.display = 'grid';
    advertisementDetailsMain.style.gridTemplateRows = 'auto 1fr auto'; // Rozkład na trzy sekcje: górną, środkową i dolną


    const advertisementDetailsOwner = document.createElement("advertisementDetailsCenter");
    advertisementDetailsOwner.style.width = '100%'; // Dopasowanie do szerokości resultDiv
    advertisementDetailsOwner.style.flexBasis = 'auto';
    advertisementDetailsOwner.style.color = 'darkgoldenrod';
    advertisementDetailsOwner.innerHTML = "Wystawione przez → <strong style='font-size: 1.4em;'>" + advertisement.user + "</strong>";


    const advertisementDetails = document.createElement("advertisementDetailsBottom");
    advertisementDetails.style.width = '75%'; // Dopasowanie do szerokości resultDiv
    advertisementDetails.style.flexBasis = 'auto';
    advertisementDetails.style.display = 'flex';
    advertisementDetails.style.marginTop = '15px';


    const containers = [
        createAdvertisementDetailsContainer('mileage', 'MileageIcon', advertisement.mileage),
        createAdvertisementDetailsContainer('productionDate', 'ProductionDateIcon', advertisement.productionDate),
        createAdvertisementDetailsContainer('fuelType', 'FuelTypeIcon', advertisement.fuelType),
        createAdvertisementDetailsContainer('engineHorsePower', 'EngineIcon', advertisement.engineHorsePower + ' HP'),
    ];

    if (advertisement.fuelType !== 'ELEKTRYK') {
        containers.push(
            createAdvertisementDetailsContainer('engineType/' + advertisement.engineType, 'transmissionIcon', advertisement.engineType),
            createAdvertisementDetailsContainer('transmissionType/' + advertisement.transmissionType, 'transmissionIcon', advertisement.transmissionType)
        );
    }

    containers.push(createAdvertisementDetailsContainer('price', 'PriceIcon', advertisement.price + ',-'));

    const maxTextWidth = Math.max(
        ...containers.map(container => container.querySelector('span').offsetWidth)
    );

    containers.forEach(container => {
        container.style.width = maxTextWidth + 'px';
        // container.style.maxWidth = "100%";
        // container.style.boxSizing = "border-box";
        // container.style.flexBasis = "auto";
        advertisementDetails.appendChild(container);
    });

    advertisementDetailsDiv.appendChild(advertisementDetailsMain);

    advertisementDetailsMain.appendChild(advertisementDetailsHeader);
    advertisementDetailsMain.appendChild(advertisementDetailsOwner);
    advertisementDetailsMain.appendChild(advertisementDetails);

    resultDiv.appendChild(advertisementDetailsDiv);

    mainContainer.appendChild(resultDiv);
    return resultDiv;
}

function createAdvertisementDetailsContainer(iconPath, altText, value) {
    const container = document.createElement('advertisementInfoContainer');
    container.setAttribute('id', 'advertisementInfoContainer');
    container.style.color = 'darkgoldenrod';

    const icon = document.createElement('img');
    icon.src = `/api/resources/${iconPath}`;
    icon.alt = altText;
    icon.style.marginBottom = '2px';

    const valueElement = document.createElement('span');
    valueElement.textContent = value;

    container.appendChild(icon);
    container.appendChild(valueElement);

    return container;
}