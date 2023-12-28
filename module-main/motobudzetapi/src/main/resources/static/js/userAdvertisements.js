function createUserAdvertisementsResultDiv(ad,container) {
    const resultDiv = document.createElement("messageResultDiv");
    resultDiv.id = "messageResultDiv";

    let isEventListenerActive = true;  // Zmienna stanu
    let iconWrapper;


    container.style.maxHeight = "900px";
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
        if(!isEventListenerActive) return;
        const advertisementId = ad.id;

        // Przenieś na stronę /id/advertisement.id
        window.location.href = `/id?advertisementId=${advertisementId}`;
    });

    resultDiv.onmouseover = () => {
        resultDiv.style.boxShadow = "0 0 20px moccasin";
        if (iconWrapper) {
            iconWrapper.style.opacity = '1'; // Pokaż iconWrapper
        }
    };

    resultDiv.onmouseout = () => {
        resultDiv.style.boxShadow = "0 0 0px darkgoldenrod";
        if (iconWrapper) {
            iconWrapper.style.opacity = '0'; // Ukryj iconWrapper
        }
    };




    const photoElement = document.createElement("img");
    photoElement.src = `/api/resources/advertisementPhoto/${ad.mainPhotoUrl}`;
    photoElement.style.height = "200px";
    photoElement.style.backgroundColor = 'rgba(0, 0, 0, 1)'
    let maxPhotoWidth = 300;
    // photoElement.style.objectFit = "cover";
    // photoElement.onload = () => {
    //     if (photoElement.width > maxPhotoWidth) {
    //         maxPhotoWidth = photoElement.width;
    //     }
    // };


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

    const headerTitleNameDiv = document.createElement('div');
    headerTitleNameDiv.style.display = 'column';
    headerTitleNameDiv.style.width = '100%';
    headerTitleNameDiv.style.position = 'relative';
    headerTitleNameDiv.style.bottom = '-15px';

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

    headerTitleNameDiv.appendChild(titleElement);
    headerTitleNameDiv.appendChild(modelBrandElement);

    conversationDetailsHeader.appendChild(headerTitleNameDiv);

    const priceHeader = document.createElement("div");
    priceHeader.style.color = "darkgoldenrod"; // Dostosuj kolor tekstu
    priceHeader.style.fontSize = "18px"; // Dostosuj rozmiar tekstu
    priceHeader.style.position = 'relative'; // Dostosuj rozmiar tekstu
    priceHeader.style.bottom = '-5px'; // Dostosuj rozmiar tekstu
    priceHeader.style.textAlign = 'right';
    priceHeader.style.marginRight = '25px';
    priceHeader.style.whiteSpace = 'nowrap'; // Tekst nie lami się na wiele linii

    const priceElement = document.createElement('div');
    priceElement.style.color = 'white';
    priceElement.style.fontSize = "26px"; // Dostosuj rozmiar tekstu

    const priceValueSpan = document.createElement('span'); // Używamy span zamiast div
    priceValueSpan.textContent = ad.priceUnit;
    priceValueSpan.style.color = 'darkgoldenrod';
    priceValueSpan.style.verticalAlign = "top"; // Wyrówn
    priceValueSpan.style.fontSize = "16px"; // Dostosuj rozmiar tekstu

    priceElement.textContent = formatInteger(ad.price) + ' '; // Dodajemy spację po wartości ceny
    priceElement.appendChild(priceValueSpan); // Dodajemy ad.priceUnit bezpośrednio po ad.price

    priceHeader.appendChild(priceElement);

    conversationDetailsHeader.appendChild(priceHeader);


    const conversationDetailsDiv = document.createElement("conversationDetailsDiv");
    conversationDetailsDiv.style.width = '100%'; // Dopasowanie do szerokości resultDiv
    conversationDetailsDiv.style.flexBasis = 'auto';
    conversationDetailsDiv.style.display = 'flex-start';
    conversationDetailsDiv.style.flexDirection = 'column'; // Ustawienia pionowego układu
    // conversationDetailsDiv.style.marginBottom = '30px';


    const conversationDetailsMain = document.createElement("conversationDetailsMain");
    conversationDetailsMain.style.width = '100%'; // Dopasowanie do szerokości resultDiv
    conversationDetailsMain.style.flexBasis = 'auto';
    conversationDetailsMain.style.display = 'grid';
    conversationDetailsMain.style.gridTemplateRows = 'auto 1fr auto'; // Rozkład na trzy sekcje: górną, środkową i dolną
    conversationDetailsMain.style.marginTop = '20px';

    const advertisementDetails = document.createElement("conversationDetailsBottom");
    advertisementDetails.style.width = '75%'; // Dopasowanie do szerokości resultDiv
    advertisementDetails.style.flexBasis = 'auto';
    advertisementDetails.style.display = 'flex';
    advertisementDetails.style.marginTop = '15px';

    let priceUnitValue = document.createElement('span');
    priceUnitValue.style.color = 'darkgoldenrod';
    priceUnitValue.textContent = ad.priceUnit;

    let mileageUnitValue = document.createElement('span');
    mileageUnitValue.style.color = 'darkgoldenrod';
    mileageUnitValue.textContent = ad.mileageUnit;

    let horsePower = document.createElement('span');
    horsePower.style.color = 'darkgoldenrod';
    horsePower.textContent = 'HP';

    let productionYear = document.createElement('span');
    productionYear.style.color = 'darkgoldenrod';
    productionYear.textContent = 'ROK';

    let engineCapacity = document.createElement('span');
    engineCapacity.style.color = 'darkgoldenrod';
    engineCapacity.textContent = 'CM';
    let smallerDigit = document.createElement('span');
    smallerDigit.textContent = '3';
    smallerDigit.style.fontSize = '10px'; // Zmniejszenie rozmiaru czcionki o 20%
    smallerDigit.style.verticalAlign = 'top';

    engineCapacity.appendChild(smallerDigit);


    const bottomDetailsHeader = document.createElement("bottomDetailsHeader");
    bottomDetailsHeader.style.width = '100%'; // Dopasowanie do szerokości resultDiv
    bottomDetailsHeader.style.display = 'flex'; // Ustawienie flexbox
    bottomDetailsHeader.style.justifyContent = 'space-between'; // Umieszczenie elementów na końcach kontenera
    bottomDetailsHeader.style.alignItems = 'center'; // Wyśrodkowanie elementów w pionie
    bottomDetailsHeader.style.boxSizing = "border-box";
    bottomDetailsHeader.style.flexBasis = "auto";

    const locationDetailsDiv = document.createElement('div');
    locationDetailsDiv.style.display = 'column';
    locationDetailsDiv.style.width = '100%';
    locationDetailsDiv.style.position = 'relative';
    locationDetailsDiv.style.bottom = '20px';

    const locationDetails = document.createElement("div");
    locationDetails.textContent = ad.city + ', ' + ad.cityState;
    locationDetails.style.color = "white"; // Dostosuj kolor tekstu
    locationDetails.style.fontSize = "16px"; // Dostosuj rozmiar tekstu
    locationDetails.style.position = 'relative'; // Dostosuj rozmiar tekstu
    locationDetails.style.bottom = '-40px'; // Dostosuj rozmiar tekstu
    locationDetails.style.textAlign = 'left';
    locationDetails.style.marginRight = '15px';
    locationDetails.style.whiteSpace = 'nowrap'; // Tekst nie lami się na wiele linii
    locationDetails.style.width = '100%'; // Dopasowanie do szeokości resultDiv
    locationDetails.style.display = 'flex'; // Ustawienie flexbox
    locationDetails.style.justifyContent = 'space-between'; // Umieszczenie elementów na końcach kontenera
    locationDetails.style.alignItems = 'center'; // Wyśrodkowanie elementów w pionie
    locationDetails.style.boxSizing = "border-box";
    locationDetails.style.flexBasis = "auto";
    locationDetails.style.textAlign = 'left';


    locationDetailsDiv.appendChild(locationDetails);
    bottomDetailsHeader.appendChild(locationDetailsDiv);


    const favouriteBottomHeaderDiv = document.createElement("div");
    favouriteBottomHeaderDiv.style.color = "darkgoldenrod"; // Dostosuj kolor tekstu
    favouriteBottomHeaderDiv.style.fontSize = "18px"; // Dostosuj rozmiar tekstu
    favouriteBottomHeaderDiv.style.position = 'relative'; // Dostosuj rozmiar tekstu
    favouriteBottomHeaderDiv.style.bottom = '-25px'; // Dostosuj rozmiar tekstu
    favouriteBottomHeaderDiv.style.textAlign = 'right';
    favouriteBottomHeaderDiv.style.marginRight = '25px';
    favouriteBottomHeaderDiv.style.whiteSpace = 'nowrap'; // Tekst nie lami się na wiele linii

    const favouriteWrapper = document.createElement('div');
    favouriteWrapper.id = 'favouriteWrapper';
    favouriteWrapper.style.display = 'flex';
    favouriteWrapper.style.alignItems = 'center';  // Wycentrowanie elementów w pionie

    const favouriteIconDiv = document.createElement('div');
    favouriteIconDiv.style.color = 'white';
    favouriteIconDiv.style.fontSize = "26px";
    favouriteIconDiv.style.zIndex = '999';


    const favouriteText = document.createElement('span');
    favouriteText.id = 'favouriteText';
    favouriteText.style.border = '5px';
    favouriteText.style.color = 'white';
    favouriteText.style.position = 'relative';
    favouriteText.style.left = '-150px';  // -150px jest przykładową wartością, dostosuj do rzeczywistej szerokości tekstu
    favouriteText.style.opacity = '0';
    favouriteText.style.transition = 'left 0.5s, opacity 0.5s';


    favouriteWrapper.appendChild(favouriteText);
    favouriteWrapper.appendChild(favouriteIconDiv);
    const heartIcon = document.createElement('img');



    favouriteIconDiv.addEventListener('mouseover', function() {
        if (!isEventListenerActive) return;  // Jeśli zmienna stanu jest false, zignoruj akcje

        favouriteIconDiv.style.cursor = "pointer";
        favouriteText.style.left = '-15px';
        favouriteText.style.opacity = '1';
    });

    favouriteIconDiv.addEventListener('mouseout', function() {
        if (!isEventListenerActive) return;  // Jeśli zmienna stanu jest false, zignoruj akcje

        favouriteIconDiv.style.cursor = "auto";
        favouriteText.style.left = '-150px';
        favouriteText.style.opacity = '0';
    });



    const editBottomHeaderDiv = document.createElement("div");
    editBottomHeaderDiv.style.color = "darkgoldenrod"; // Dostosuj kolor tekstu
    editBottomHeaderDiv.style.fontSize = "18px"; // Dostosuj rozmiar tekstu
    editBottomHeaderDiv.style.position = 'relative'; // Dostosuj rozmiar tekstu
    editBottomHeaderDiv.style.bottom = '0px'; // Dostosuj rozmiar tekstu
    editBottomHeaderDiv.style.textAlign = 'right';
    editBottomHeaderDiv.style.marginRight = '25px';
    editBottomHeaderDiv.style.whiteSpace = 'nowrap'; // Tekst nie lami się na wiele linii

    const editWrapper = document.createElement('div');
    editWrapper.id = 'editWrapper';
    editWrapper.style.display = 'flex';
    editWrapper.style.alignItems = 'center';  // Wycentrowanie elementów w pionie

    const editText = document.createElement('span');
    editText.id = 'editText';
    editText.style.border = '5px';
    editText.style.color = 'white';
    editText.style.position = 'relative';
    editText.style.left = '-150px';  // -150px jest przykładową wartością, dostosuj do rzeczywistej szerokości tekstu
    editText.style.opacity = '0';
    editText.style.transition = 'left 0.5s, opacity 0.5s';

    const editIconDiv = document.createElement('div');
    editIconDiv.style.color = 'white';
    editIconDiv.style.fontSize = "26px";
    editIconDiv.style.zIndex = '999';

    editWrapper.appendChild(editText);
    editWrapper.appendChild(editIconDiv);
    const editIcon = document.createElement('img');

    editIconDiv.addEventListener('mouseover', function() {
        editIconDiv.style.cursor = "pointer";
        editText.style.left = '-15px';  // Przesuń tekst do pozycji początkowej
        editText.style.opacity = '1';  // Ustaw opacity na 1
    });
    editIconDiv.addEventListener('mouseout', function() {
        editIconDiv.style.cursor = "auto";
        editText.style.left = '-150px';  // Chowa tekst z powrotem poza widok
        editText.style.opacity = '0';  // Ustaw opacity na 0
    });
    editIconDiv.addEventListener('click', function() {
        event.stopPropagation();
        if (!isEventListenerActive) return;
        window.location = '/advertisement/edit?advertisementId=' + ad.id;
    });


    // editIconDiv.addEventListener('click', handleEditIconClick);



    const deleteBottomHeaderDiv = document.createElement("div");
    deleteBottomHeaderDiv.style.color = "darkgoldenrod"; // Dostosuj kolor tekstu
    deleteBottomHeaderDiv.style.fontSize = "18px"; // Dostosuj rozmiar tekstu
    deleteBottomHeaderDiv.style.position = 'relative'; // Dostosuj rozmiar tekstu
    deleteBottomHeaderDiv.style.bottom = '0px'; // Dostosuj rozmiar tekstu
    deleteBottomHeaderDiv.style.textAlign = 'right';
    deleteBottomHeaderDiv.style.marginRight = '25px';
    deleteBottomHeaderDiv.style.left = '10px';
    deleteBottomHeaderDiv.style.whiteSpace = 'nowrap'; // Tekst nie lami się na wiele linii

    const deleteWrapper = document.createElement('div');
    deleteWrapper.id = 'deleteWrapper';
    deleteWrapper.style.display = 'flex';
    deleteWrapper.style.alignItems = 'center';  // Wycentrowanie elementów w pionie

    const deleteText = document.createElement('span');
    deleteText.id = 'deleteText';
    deleteText.style.border = '5px';
    deleteText.style.color = 'white';
    deleteText.style.position = 'relative';
    deleteText.style.left = '-150px';  // -150px jest przykładową wartością, dostosuj do rzeczywistej szerokości tekstu
    deleteText.style.opacity = '0';
    deleteText.style.transition = 'left 0.5s, opacity 0.5s';

    const deleteIconDiv = document.createElement('div');
    deleteIconDiv.style.color = 'white';
    deleteIconDiv.style.fontSize = "26px";
    deleteIconDiv.style.zIndex = '999';

    deleteWrapper.appendChild(deleteText);
    deleteWrapper.appendChild(deleteIconDiv);
    const deleteIcon = document.createElement('img');




    deleteIconDiv.addEventListener('mouseover', function() {
        deleteIconDiv.style.cursor = "pointer";
        deleteText.style.left = '-15px';  // Przesuń tekst do pozycji początkowej
        deleteText.style.opacity = '1';  // Ustaw opacity na 1
    });
    deleteIconDiv.addEventListener('mouseout', function() {
        deleteIconDiv.style.cursor = "auto";
        deleteText.style.left = '-150px';  // Chowa tekst z powrotem poza widok
        deleteText.style.opacity = '0';  // Ustaw opacity na 0
    });


    deleteIcon.addEventListener('click', function(event) {
        event.stopPropagation();



                isEventListenerActive = false;

                // editIconDiv.removeEventListener('click', handleEditIconClick);

                let opacity = 1;
                const step = 0.01;
                const intervalDuration = 10;

                resultDiv.style.opacity = String(opacity);

                const fadeOutInterval = setInterval(() => {
                    opacity -= step;
                    resultDiv.style.setProperty('opacity', String(opacity), 'important');

                    if (opacity <= 0) {
                        clearInterval(fadeOutInterval);
                        if (resultDiv.parentNode === container) {
                            container.removeChild(resultDiv);
                        }
                    }
                }, intervalDuration);



        fetch('/api/advertisements/' + ad.id, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    console.log('deleted');
                } else {
                    console.error('Nie udało się usunąć ogłoszenia.');
                }
            })
            .catch(error => {
                // Obsłuż błędy sieci lub inne błędy, które mogą wystąpić
                console.error('Wystąpił błąd:', error);
            });
    });



    if(getUserName()!==ad.user){
        heartIcon.src = "/api/resources/heartFull";
        favouriteText.innerHTML = "Usuń z ulubionych";
        favouriteBottomHeaderDiv.appendChild(favouriteWrapper);
        heartIcon.style.marginBottom = '2px';
        favouriteIconDiv.appendChild(heartIcon);
        bottomDetailsHeader.appendChild(favouriteBottomHeaderDiv);
    }
    else if (getUserName()===ad.user) {

        editIcon.src = "/api/resources/editIcon";
        editText.innerHTML = "Edytuj ogłoszenie";
        editBottomHeaderDiv.appendChild(editWrapper);
        editIcon.style.marginBottom = '2px';
        editIconDiv.appendChild(editIcon);

        deleteIcon.src = "/api/resources/deleteIcon";
        deleteText.innerHTML = "Usuń ogłoszenie";
        deleteBottomHeaderDiv.appendChild(deleteWrapper);
        deleteIcon.style.marginBottom = '2px';
        deleteIconDiv.appendChild(deleteIcon);

        iconWrapper = document.createElement('div');
        iconWrapper.style.display = 'flex';
        iconWrapper.style.flexDirection = 'column';
        iconWrapper.style.opacity = '0';

        iconWrapper.appendChild(deleteBottomHeaderDiv);
        iconWrapper.appendChild(editBottomHeaderDiv);
        bottomDetailsHeader.appendChild(iconWrapper);

        // bottomDetailsHeader.appendChild(editBottomHeaderDiv);

    }




    favouriteIconDiv.addEventListener('click', function(event) {
        event.stopPropagation();
        if (!isEventListenerActive) return;

        if (heartIcon.src.includes("heartFull")) {
            heartIcon.src = "/api/resources/heartEmpty";
            favouriteText.innerHTML = "Dodaj do ulubionych";

            if (resultDiv && resultDiv.parentNode === container) {
                let opacity = 1;
                const step = 0.01;
                const intervalDuration = 10;

                isEventListenerActive = false;
                resultDiv.style.opacity = String(opacity);
                favouriteText.style.left = '-150px';  // Chowa tekst z powrotem poza widok
                favouriteText.style.opacity = '0';  // Ustaw opacity na 0
                favouriteText.innerHTML = "Usuń z ulubionych";

                const fadeOutInterval = setInterval(() => {
                    opacity -= step;
                    resultDiv.style.setProperty('opacity', String(opacity), 'important');

                    if (opacity <= 0) {
                        clearInterval(fadeOutInterval);
                        if (resultDiv.parentNode === container) {
                            container.removeChild(resultDiv);
                        }
                    }
                }, intervalDuration);
            }

        } else if (heartIcon.src.includes("heartEmpty")) {
            heartIcon.src = "/api/resources/heartFull";
            favouriteText.innerHTML = "Usuń z ulubionych";
        }

        const requestBody = {
            advertisementId: ad.id
        };

        fetch('/api/users/favourites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
            .then(response => response.text())
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });




    function formatInteger(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    const containers = [
        // createInfoContainer('price', 'PriceIcon', formatInteger(ad.price)),
        createInfoContainer('mileage', 'MileageIcon', formatInteger(ad.mileage)),
        createInfoContainer('engineHorsePower', 'EngineIcon', ad.engineHorsePower),
        createInfoContainer('productionDate', 'ProductionDateIcon', ad.productionDate),
        createInfoContainer('engineCapacity', 'CapacityIcon', formatInteger(ad.engineCapacity)),
        createInfoContainer('fuelType', 'FuelTypeIcon', ad.fuelType),
        createInfoContainer('engineType/' + ad.engineType, 'transmissionIcon', ad.engineType),
        createInfoContainer('transmissionType/' + ad.transmissionType, 'transmissionIcon', ad.transmissionType),
    ];

    // containers[0].appendChild(priceUnitValue);
    containers[0].appendChild(mileageUnitValue);
    containers[1].appendChild(horsePower);
    containers[2].appendChild(productionYear);
    containers[3].appendChild(engineCapacity);

    containers.forEach(container => {
        advertisementDetails.appendChild(container);
    });

    const maxTextWidth = Math.max(
        ...containers.map(container => container.querySelector('span').offsetWidth)
    );

    // Ustaw taką samą szerokość dla wszystkich kontenerów
    containers.forEach(container => {
        container.style.width = maxTextWidth + '65px';
    });


    conversationDetailsMain.appendChild(advertisementDetails);

    conversationDetailsDiv.appendChild(conversationDetailsHeader);
    conversationDetailsDiv.appendChild(conversationDetailsMain);

    conversationDetailsDiv.appendChild(bottomDetailsHeader);








    resultDiv.appendChild(conversationDetailsDiv);

    resultDiv.style.gridColumn = 1;

    resultDiv.style.gridRowStart = row; // Ustaw numer rzędu
    resultDiv.style.gridRowEnd = row + 1; // Ustaw numer rzędu



    container.appendChild(resultDiv);
    return resultDiv;
}
