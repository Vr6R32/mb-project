
function createUserAdvertisementsResultDiv(advertisement,container) {
    const resultDiv = document.createElement("messageResultDiv");
    resultDiv.id = "messageResultDiv";

    container.style.display = 'grid';
    container.style.gridTemplateColumns = '100%';
    container.style.overflowY = 'scroll';
    container.style.overflowX = 'hidden';
    container.style.paddingBottom = '30px';
    container.style.paddingTop = '30px';
    container.style.paddingLeft = '20px';
    container.style.paddingRight = '20px';
    container.style.scrollbarWidth = 'thin';
    container.style.scrollbarColor = 'darkgoldenrod transparent';

    // Tworzenie dwóch elementów grid
    const grid1 = document.createElement('div');
    grid1.style.maxWidth = '100%';



    // Dodawanie tych gridów jako dzieci do resultContainerRight
    container.appendChild(grid1);


    // Add hover effect on mouseover
    resultDiv.onmouseover = () => {
        resultDiv.style.boxShadow = "0 0 20px moccasin";
    };

    // Remove hover effect on mouseout
    resultDiv.onmouseout = () => {
        resultDiv.style.boxShadow = "0 0 0px darkgoldenrod";
    };





    const photoElement = document.createElement("img");
    photoElement.src = `/api/resources/advertisementPhoto/${advertisement.mainPhotoUrl}`;
    photoElement.style.height = "150px";
    photoElement.style.width = "100px";
    photoElement.style.objectFit = "cover";

    const fadeEffect = document.createElement('div');
    fadeEffect.classList.add('fade-effect-miniature-search');
    fadeEffect.appendChild(photoElement);

    resultDiv.appendChild(fadeEffect);

    const conversationDetailsHeader = document.createElement("conversationDetailsHeader");
    conversationDetailsHeader.style.width = '100%'; // Dopasowanie do szerokości resultDiv
    conversationDetailsHeader.style.display = 'flex'; // Ustawienie flexbox
    conversationDetailsHeader.style.justifyContent = 'space-between'; // Umieszczenie elementów na końcach kontenera
    conversationDetailsHeader.style.alignItems = 'center'; // Wyśrodkowanie elementów w pionie
    conversationDetailsHeader.style.boxSizing = "border-box";
    conversationDetailsHeader.style.flexBasis = "auto";

    const nameElement = document.createElement("div");
    nameElement.textContent = advertisement.name;
    nameElement.style.color = "white"; // Dostosuj kolor tekstu
    nameElement.style.fontSize = "24px"; // Dostosuj rozmiar tekstu
    nameElement.style.textAlign = 'left';


    conversationDetailsHeader.appendChild(nameElement);

        const dateElement = document.createElement("div");
        dateElement.textContent = 'Utworzone dnia ' + advertisement.creationDate;
        dateElement.style.color = "darkgoldenrod"; // Dostosuj kolor tekstu
        dateElement.style.fontSize = "18px"; // Dostosuj rozmiar tekstu
        dateElement.style.textAlign = 'right';
        dateElement.style.marginRight = '15px';
        dateElement.style.whiteSpace = 'nowrap'; // Tekst nie lami się na wiele linii
        conversationDetailsHeader.appendChild(dateElement);


    ///////////////////////////////////////////////////////////////////////
    ///////////////////////////////HEADER//////////////////////////////////
    ///////////////////////////////////////////////////////////////////////


    const conversationDetailsDiv = document.createElement("conversationDetailsDiv");
    conversationDetailsDiv.style.width = '100%'; // Dopasowanie do szerokości resultDiv
    conversationDetailsDiv.style.flexBasis = 'auto';
    conversationDetailsDiv.style.display = 'flex-start';
    conversationDetailsDiv.style.flexDirection = 'column'; // Ustawienia pionowego układu


    const conversationDetailsMain = document.createElement("conversationDetailsMain");
    conversationDetailsMain.style.width = '100%'; // Dopasowanie do szerokości resultDiv
    conversationDetailsMain.style.flexBasis = 'auto';
    conversationDetailsMain.style.display = 'grid';
    conversationDetailsMain.style.gridTemplateRows = 'auto 1fr auto'; // Rozkład na trzy sekcje: górną, środkową i dolną


    // const conversationDetailsSecondUser = document.createElement("conversationDetailsCenter");
    // conversationDetailsSecondUser.style.width = '100%'; // Dopasowanie do szerokości resultDiv
    // conversationDetailsSecondUser.style.flexBasis = 'auto';
    // conversationDetailsSecondUser.innerHTML = "Konwersacja z → <strong style='font-size: 1.4em;'>" + conversation.secondUser + "</strong>";


    const advertisementDetails = document.createElement("conversationDetailsBottom");
    advertisementDetails.style.width = '100%'; // Dopasowanie do szerokości resultDiv
    advertisementDetails.style.flexBasis = 'auto';
    advertisementDetails.style.display = 'flex';
    advertisementDetails.style.marginTop = '15px';


    const containers = [
        createInfoContainer('mileage', 'MileageIcon', advertisement.mileage),
        createInfoContainer('productionDate', 'ProductionDateIcon', advertisement.productionDate),
        createInfoContainer('fuelType', 'FuelTypeIcon', advertisement.fuelType),
        createInfoContainer('engineHorsePower', 'EngineIcon', advertisement.engineHorsePower + ' HP'),
    ];

    if (advertisement.fuelType !== 'ELEKTRYCZNY') {
        containers.push(
            createInfoContainer('engineType/' + advertisement.engineType, 'transmissionIcon', advertisement.engineType),
            createInfoContainer('transmissionType/' + advertisement.transmissionType, 'transmissionIcon', advertisement.transmissionType)
        );
    }

    containers.push(createInfoContainer('price', 'PriceIcon', advertisement.price + ',-'));

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

    const conversationLastMessage = document.createElement("conversationLastMessage");
    conversationLastMessage.style.width = '100%'; // Dostosowanie do szerokości
    conversationLastMessage.style.overflow = 'hidden'; // Ukrywa nadmiarowy tekst
    conversationLastMessage.style.textOverflow = 'ellipsis'; // Dodaje trzy kropki na końcu, gdy tekst jest zbyt długi
    conversationLastMessage.style.whiteSpace = 'nowrap'; // Tekst nie lami się na wiele linii


    conversationDetailsMain.appendChild(advertisementDetails);
    conversationDetailsMain.appendChild(conversationLastMessage);

    conversationDetailsDiv.appendChild(conversationDetailsHeader);
    conversationDetailsDiv.appendChild(conversationDetailsMain);

    resultDiv.appendChild(conversationDetailsDiv);

    resultDiv.style.gridColumn = 1;

    resultDiv.style.gridRowStart = row; // Ustaw numer rzędu
    resultDiv.style.gridRowEnd = row + 1; // Ustaw numer rzędu



    container.appendChild(resultDiv);
    return resultDiv;
}