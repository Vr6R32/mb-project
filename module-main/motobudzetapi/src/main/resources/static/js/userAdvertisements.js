
function createUserAdvertisementsResultDiv(ad,container) {
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

    resultDiv.addEventListener("click", () => {
        // Pobierz ID reklamy
        const advertisementId = ad.id;

        // Przenieś na stronę /id/advertisement.id
        window.location.href = `/id?advertisementId=${advertisementId}`;
    });

    // Add hover effect on mouseover
    resultDiv.onmouseover = () => {
        resultDiv.style.boxShadow = "0 0 20px moccasin";
    };

    // Remove hover effect on mouseout
    resultDiv.onmouseout = () => {
        resultDiv.style.boxShadow = "0 0 0px darkgoldenrod";
    };





    const photoElement = document.createElement("img");
    photoElement.src = `/api/resources/advertisementPhoto/${ad.mainPhotoUrl}`;
    photoElement.style.height = "200px";
    let maxPhotoWidth = 300;
    photoElement.style.objectFit = "cover";
    photoElement.onload = () => {
        if (photoElement.width > maxPhotoWidth) {
            maxPhotoWidth = photoElement.width;
        }
    };


    const fadeEffect = document.createElement('div');
    fadeEffect.classList.add('fade-effect-miniature-search');
    fadeEffect.appendChild(photoElement);
    fadeEffect.style.width = maxPhotoWidth + 'px';

    resultDiv.appendChild(fadeEffect);

    const conversationDetailsHeader = document.createElement("conversationDetailsHeader");
    conversationDetailsHeader.style.width = '100%'; // Dopasowanie do szerokości resultDiv
    conversationDetailsHeader.style.display = 'flex'; // Ustawienie flexbox
    conversationDetailsHeader.style.justifyContent = 'space-between'; // Umieszczenie elementów na końcach kontenera
    conversationDetailsHeader.style.alignItems = 'center'; // Wyśrodkowanie elementów w pionie
    conversationDetailsHeader.style.boxSizing = "border-box";
    conversationDetailsHeader.style.flexBasis = "auto";
    // conversationDetailsHeader.style.position = 'relative';
    // conversationDetailsHeader.style.bottom = '30px';

    const headerTitleNameDiv = document.createElement('div');
    headerTitleNameDiv.style.display = 'column';
    headerTitleNameDiv.style.width = '100%';
    headerTitleNameDiv.style.position = 'relative';
    headerTitleNameDiv.style.bottom = '10px';

    // const headerTitleModelBrand = document.createElement('div');
    // headerTitleModelBrand.style.display = 'column';
    // headerTitleModelBrand.style.width = '100%';
    // headerTitleModelBrand.style.position = 'relative';
    // headerTitleModelBrand.style.bottom = '50px';
    // headerTitleOwnerName.style.marginBottom = '50px';

    const titleElement = document.createElement("div");
    titleElement.textContent = ad.name;
    titleElement.style.color = "white"; // Dostosuj kolor tekstu
    titleElement.style.fontSize = "24px"; // Dostosuj rozmiar tekstu
    titleElement.style.textAlign = 'left';

    const modelBrandElement = document.createElement("div");
    modelBrandElement.textContent = ad.brand + ' ' + ad.model;
    modelBrandElement.style.color = "darkgoldenrod"; // Dostosuj kolor tekstu
    modelBrandElement.style.fontSize = "16px"; // Dostosuj rozmiar tekstu
    modelBrandElement.style.textAlign = 'left';

    const ownerName = document.createElement("div");
    ownerName.innerHTML = "Wystawione przez → <strong style='font-size: 1.4em;'>" + ad.user + "</strong>";
    ownerName.style.color = "darkgoldenrod"; // Dostosuj kolor tekstu
    ownerName.style.fontSize = "18px"; // Dostosuj rozmiar tekstu
    ownerName.style.textAlign = 'left';


    headerTitleNameDiv.appendChild(titleElement);
    headerTitleNameDiv.appendChild(modelBrandElement);
    // headerTitleOwnerName.appendChild(ownerName);

    conversationDetailsHeader.appendChild(headerTitleNameDiv);
    // conversationDetailsHeader.appendChild(headerTitleModelBrand);

    const dateElement = document.createElement("div");
    dateElement.textContent = 'Utworzone dnia ' + ad.creationDate;
    dateElement.style.color = "darkgoldenrod"; // Dostosuj kolor tekstu
    dateElement.style.fontSize = "18px"; // Dostosuj rozmiar tekstu
    dateElement.style.position = 'relative'; // Dostosuj rozmiar tekstu
    dateElement.style.bottom = '20px'; // Dostosuj rozmiar tekstu
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
    conversationDetailsDiv.style.marginTop = '15px';


    const conversationDetailsMain = document.createElement("conversationDetailsMain");
    conversationDetailsMain.style.width = '100%'; // Dopasowanie do szerokości resultDiv
    conversationDetailsMain.style.flexBasis = 'auto';
    conversationDetailsMain.style.display = 'grid';
    conversationDetailsMain.style.gridTemplateRows = 'auto 1fr auto'; // Rozkład na trzy sekcje: górną, środkową i dolną
    // conversationDetailsMain.style.position = 'relative';
    // conversationDetailsMain.style.bottom = '20px';


    // const conversationDetailsSecondUser = document.createElement("conversationDetailsCenter");
    // conversationDetailsSecondUser.style.width = '100%'; // Dopasowanie do szerokości resultDiv
    // conversationDetailsSecondUser.style.flexBasis = 'auto';
    // conversationDetailsSecondUser.innerHTML = "Konwersacja z → <strong style='font-size: 1.4em;'>" + conversation.secondUser + "</strong>";


    const advertisementDetails = document.createElement("conversationDetailsBottom");
    advertisementDetails.style.width = '75%'; // Dopasowanie do szerokości resultDiv
    advertisementDetails.style.flexBasis = 'auto';
    advertisementDetails.style.display = 'flex';
    advertisementDetails.style.marginTop = '15px';


    let pln = document.createElement('span');
    pln.style.color = 'darkgoldenrod';
    pln.textContent = 'PLN';

    function formatPrice(price) {
        // Zamienia liczbę na łańcuch znaków i dodaje separatery tysięcy
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    const containers = [
        createInfoContainer('price', 'PriceIcon', formatPrice(ad.price)),
        createInfoContainer('mileage', 'MileageIcon', formatPrice(ad.mileage)),
        createInfoContainer('productionDate', 'ProductionDateIcon', ad.productionDate),
        createInfoContainer('fuelType', 'FuelTypeIcon', ad.fuelType),
        createInfoContainer('engineHorsePower', 'EngineIcon', ad.engineHorsePower + 'HP'),
        createInfoContainer('engineType/' + ad.engineType, 'transmissionIcon', ad.engineType),
        createInfoContainer('transmissionType/' + ad.transmissionType, 'transmissionIcon', ad.transmissionType),
    ];

    containers[0].appendChild(pln);


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