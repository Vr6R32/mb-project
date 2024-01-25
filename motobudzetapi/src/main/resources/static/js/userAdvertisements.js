
function createSingleAdvertisementResultPanelDiv(ad, container) {

    container.style.maxHeight = "1000px";
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

    const resultDiv = document.createElement("messageResultDiv");
    resultDiv.id = "messageResultDiv";
    resultDiv.style.height = '90%';
    resultDiv.style.marginBottom = '30px';

    // if (/Mobi|Android/i.test(navigator.userAgent)) {
    //     let resultContainerRight = document.getElementById('resultContainerRight');
    //     let rightContainer = document.getElementById('rightContainer');
    //     resultContainerRight.style.height = '1400px';
    //     resultContainerRight.style.maxHeight = '1400px';
    //     rightContainer.style.maxHeight = '1400px';
    //     rightContainer.style.height = '1400px';
    //     resultDiv.style.height = '70%';
    //     resultDiv.style.marginBottom = '1%';
    // }



    let isEventListenerActive = true;
    let iconWrapper;


    resultDiv.addEventListener("click", () => {
        if(!isEventListenerActive) return;
        const advertisementId = ad.id;
        window.location.href = `/advertisement?id=${advertisementId}` + '&title=' + ad.name;
    });



    const photoElement = document.createElement("img");
    photoElement.src = `/api/static/photo/${ad.mainPhotoUrl}`;
    photoElement.style.height = "200px";
    photoElement.style.minWidth = '250px';
    photoElement.style.maxWidth = '250px';
    photoElement.style.objectFit = "cover";
    // photoElement.style.backgroundColor = 'rgba(0, 0, 0, 1)'


    const fadeEffect = document.createElement('div');
    fadeEffect.classList.add('fade-effect-miniature-search');
    fadeEffect.appendChild(photoElement);

    resultDiv.appendChild(fadeEffect);

    const conversationDetailsHeader = document.createElement("conversationDetailsHeader");
    conversationDetailsHeader.style.width = '100%';
    conversationDetailsHeader.style.display = 'flex';
    conversationDetailsHeader.style.justifyContent = 'space-between';
    conversationDetailsHeader.style.alignItems = 'center';
    conversationDetailsHeader.style.boxSizing = "border-box";
    conversationDetailsHeader.style.flexBasis = "auto";

    const headerTitleNameDiv = document.createElement('div');
    headerTitleNameDiv.style.display = 'column';
    headerTitleNameDiv.style.width = '100%';
    headerTitleNameDiv.style.position = 'relative';
    headerTitleNameDiv.style.bottom = '-15px';

    const titleElement = document.createElement("div");
    titleElement.textContent = ad.name;
    titleElement.style.color = "white";
    titleElement.style.fontSize = "24px";
    titleElement.style.textAlign = 'left';

    const modelBrandElement = document.createElement("div");
    modelBrandElement.textContent = ad.brand + ' ' + ad.model;
    modelBrandElement.style.color = "darkgoldenrod";
    modelBrandElement.style.fontSize = "16px";
    modelBrandElement.style.textAlign = 'left';

    headerTitleNameDiv.appendChild(titleElement);
    headerTitleNameDiv.appendChild(modelBrandElement);

    conversationDetailsHeader.appendChild(headerTitleNameDiv);

    const priceHeader = document.createElement("div");
    priceHeader.style.color = "darkgoldenrod";
    priceHeader.style.fontSize = "18px";
    priceHeader.style.position = 'relative';
    priceHeader.style.bottom = '-5px';
    priceHeader.style.textAlign = 'right';
    priceHeader.style.marginRight = '25px';
    priceHeader.style.whiteSpace = 'nowrap';

    const priceElement = document.createElement('div');
    priceElement.style.color = 'white';
    priceElement.style.fontSize = "26px"; // Dostosuj rozmiar tekstu

    const priceValueSpan = document.createElement('span');
    priceValueSpan.textContent = ad.priceUnit;
    priceValueSpan.style.color = 'darkgoldenrod';
    priceValueSpan.style.verticalAlign = "top";
    priceValueSpan.style.fontSize = "16px";

    priceElement.textContent = formatInteger(ad.price) + ' ';
    priceElement.appendChild(priceValueSpan);

    priceHeader.appendChild(priceElement);

    conversationDetailsHeader.appendChild(priceHeader);


    const conversationDetailsDiv = document.createElement("conversationDetailsDiv");
    conversationDetailsDiv.style.width = '100%';
    conversationDetailsDiv.style.flexBasis = 'auto';
    conversationDetailsDiv.style.display = 'flex-start';
    conversationDetailsDiv.style.flexDirection = 'column';
    // conversationDetailsDiv.style.marginBottom = '30px';


    const conversationDetailsMain = document.createElement("conversationDetailsMain");
    conversationDetailsMain.style.width = '100%';
    conversationDetailsMain.style.flexBasis = 'auto';
    conversationDetailsMain.style.display = 'grid';
    conversationDetailsMain.style.gridTemplateRows = 'auto 1fr auto';
    conversationDetailsMain.style.marginTop = '20px';

    const advertisementDetails = document.createElement("conversationDetailsBottom");
    advertisementDetails.style.width = '75%';
    advertisementDetails.style.flexBasis = 'auto';
    advertisementDetails.style.display = 'flex';
    advertisementDetails.style.marginTop = '15px';
    advertisementDetails.style.marginLeft = '5%';

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
    smallerDigit.style.fontSize = '10px';
    smallerDigit.style.verticalAlign = 'top';

    engineCapacity.appendChild(smallerDigit);


    const bottomDetailsHeader = document.createElement("bottomDetailsHeader");
    bottomDetailsHeader.style.width = '100%';
    bottomDetailsHeader.style.display = 'flex';
    bottomDetailsHeader.style.justifyContent = 'space-between';
    bottomDetailsHeader.style.alignItems = 'center';
    bottomDetailsHeader.style.boxSizing = "border-box";
    bottomDetailsHeader.style.flexBasis = "auto";

    const locationDetailsDiv = document.createElement('div');
    locationDetailsDiv.style.display = 'column';
    locationDetailsDiv.style.width = '100%';
    locationDetailsDiv.style.position = 'relative';
    locationDetailsDiv.style.top = '10px';
    // locationDetailsDiv.style.bottom = '20px';

    const locationDetails = document.createElement("div");
    locationDetails.style.color = "white";
    locationDetails.style.fontSize = "16px";
    locationDetails.style.position = 'relative';
    locationDetails.style.textAlign = 'left';
    locationDetails.style.marginRight = '15px';
    locationDetails.style.whiteSpace = 'nowrap';
    locationDetails.style.width = '100%';
    locationDetails.style.display = 'flex';
    locationDetails.style.alignItems = 'center';
    locationDetails.style.boxSizing = "border-box";
    locationDetails.style.flexBasis = "auto";
    locationDetails.style.textAlign = 'left';

    const citySpan = document.createElement("span");
    citySpan.textContent = ad.city + ',';
    citySpan.style.fontSize = "22px";

    const stateSpan = document.createElement("span");
    stateSpan.textContent = ' \t' + ad.cityState;
    stateSpan.style.color = 'darkgoldenrod';
    stateSpan.style.fontSize = "14px";
    stateSpan.style.marginTop = "6px";

    locationDetails.appendChild(citySpan);
    locationDetails.appendChild(stateSpan);


    locationDetailsDiv.appendChild(locationDetails);
    bottomDetailsHeader.appendChild(locationDetailsDiv);


    const favouriteBottomHeaderDiv = document.createElement("div");
    favouriteBottomHeaderDiv.style.color = "darkgoldenrod";
    favouriteBottomHeaderDiv.style.fontSize = "18px";
    favouriteBottomHeaderDiv.style.position = 'relative';
    favouriteBottomHeaderDiv.style.bottom = '-25px';
    favouriteBottomHeaderDiv.style.textAlign = 'right';
    favouriteBottomHeaderDiv.style.marginRight = '25px';
    favouriteBottomHeaderDiv.style.whiteSpace = 'nowrap';

    const favouriteWrapper = document.createElement('div');
    favouriteWrapper.id = 'favouriteWrapper';
    favouriteWrapper.style.display = 'flex';
    favouriteWrapper.style.alignItems = 'center';

    const favouriteIconDiv = document.createElement('div');
    favouriteIconDiv.style.color = 'white';
    favouriteIconDiv.style.fontSize = "26px";
    favouriteIconDiv.style.zIndex = '999';


    const favouriteText = document.createElement('span');
    favouriteText.id = 'favouriteText';
    favouriteText.style.border = '5px';
    favouriteText.style.color = 'white';
    favouriteText.style.position = 'relative';
    favouriteText.style.left = '-150px';
    favouriteText.style.opacity = '0';
    favouriteText.style.transition = 'left 0.5s, opacity 0.5s';


    favouriteWrapper.appendChild(favouriteText);
    favouriteWrapper.appendChild(favouriteIconDiv);
    const heartIcon = document.createElement('img');



    favouriteIconDiv.addEventListener('mouseover', function() {
        if (!isEventListenerActive) return;

        favouriteIconDiv.style.cursor = "pointer";
        favouriteText.style.left = '-15px';
        favouriteText.style.opacity = '1';
    });

    favouriteIconDiv.addEventListener('mouseout', function() {
        if (!isEventListenerActive) return;

        favouriteIconDiv.style.cursor = "auto";
        favouriteText.style.left = '-150px';
        favouriteText.style.opacity = '0';
    });



    const editBottomHeaderDiv = document.createElement("div");
    editBottomHeaderDiv.style.color = "darkgoldenrod";
    editBottomHeaderDiv.style.fontSize = "18px";
    editBottomHeaderDiv.style.position = 'relative';
    editBottomHeaderDiv.style.bottom = '0px';
    editBottomHeaderDiv.style.textAlign = 'right';
    editBottomHeaderDiv.style.marginRight = '25px';
    editBottomHeaderDiv.style.whiteSpace = 'nowrap';

    const editWrapper = document.createElement('div');
    editWrapper.id = 'editWrapper';
    editWrapper.style.display = 'flex';
    editWrapper.style.alignItems = 'center';

    const editText = document.createElement('span');
    editText.id = 'editText';
    editText.style.border = '5px';
    editText.style.color = 'white';
    editText.style.position = 'relative';
    editText.style.left = '-150px';
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
        editText.style.left = '-15px';
        editText.style.opacity = '1';
    });
    editIconDiv.addEventListener('mouseout', function() {
        editIconDiv.style.cursor = "auto";
        editText.style.left = '-150px';
        editText.style.opacity = '0';
    });
    editIconDiv.addEventListener('click', function() {
        event.stopPropagation();
        if (!isEventListenerActive) return;
        window.location = '/advertisement/edit?id=' + ad.id;
    });


    // editIconDiv.addEventListener('click', handleEditIconClick);



    const deleteBottomHeaderDiv = document.createElement("div");
    deleteBottomHeaderDiv.style.color = "darkgoldenrod";
    deleteBottomHeaderDiv.style.fontSize = "18px";
    deleteBottomHeaderDiv.style.position = 'relative';
    deleteBottomHeaderDiv.style.bottom = '0px';
    deleteBottomHeaderDiv.style.textAlign = 'right';
    deleteBottomHeaderDiv.style.marginRight = '25px';
    deleteBottomHeaderDiv.style.left = '10px';
    deleteBottomHeaderDiv.style.whiteSpace = 'nowrap';

    const deleteWrapper = document.createElement('div');
    deleteWrapper.id = 'deleteWrapper';
    deleteWrapper.style.display = 'flex';
    deleteWrapper.style.alignItems = 'center';

    const deleteText = document.createElement('span');
    deleteText.id = 'deleteText';
    deleteText.style.border = '5px';
    deleteText.style.color = 'white';
    deleteText.style.position = 'relative';
    deleteText.style.left = '-150px';
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
        deleteText.style.left = '-15px';
        deleteText.style.opacity = '1';
    });
    deleteIconDiv.addEventListener('mouseout', function() {
        deleteIconDiv.style.cursor = "auto";
        deleteText.style.left = '-150px';
        deleteText.style.opacity = '0';
    });


    deleteIcon.addEventListener('click', function(event) {
        event.stopPropagation();

                isEventListenerActive = false;

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
                console.error('Wystąpił błąd:', error);
            });
    });

    iconWrapper = document.createElement('div');
    iconWrapper.setAttribute('id', 'iconWrapper');
    iconWrapper.style.display = 'flex';
    iconWrapper.style.flexDirection = 'column';
    iconWrapper.style.opacity = '0';

    handleIcons(ad, heartIcon, favouriteText, favouriteBottomHeaderDiv, favouriteWrapper, favouriteIconDiv, iconWrapper, bottomDetailsHeader, editIcon, editText, editBottomHeaderDiv, editWrapper, editIconDiv, deleteIcon, deleteText, deleteBottomHeaderDiv, deleteWrapper, deleteIconDiv);


    favouriteIconDiv.addEventListener('click', function(event) {
        event.stopPropagation();
        if (!isEventListenerActive) return;

        if (heartIcon.src.includes("heartFull")) {
            heartIcon.src = "/api/static/heartEmpty";
            favouriteText.innerHTML = "Dodaj do ulubionych";

            if (resultDiv && resultDiv.parentNode === container) {
                let opacity = 1;
                const step = 0.01;
                const intervalDuration = 10;

                isEventListenerActive = false;
                resultDiv.style.opacity = String(opacity);
                favouriteText.style.left = '-150px';
                favouriteText.style.opacity = '0';
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
            heartIcon.src = "/api/static/heartFull";
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

    containers.forEach(container => {
        container.style.width = maxTextWidth + '65px';
    });

    conversationDetailsMain.appendChild(advertisementDetails);
    conversationDetailsDiv.appendChild(conversationDetailsHeader);
    conversationDetailsDiv.appendChild(conversationDetailsMain);
    conversationDetailsDiv.appendChild(bottomDetailsHeader);





    resultDiv.appendChild(conversationDetailsDiv);

    resultDiv.style.gridColumn = 1;

    resultDiv.style.gridRowStart = row;
    resultDiv.style.gridRowEnd = row + 1;



    container.appendChild(resultDiv);
    handleDarkModeInverse(resultDiv,iconWrapper);
    return resultDiv;
}

function handleIcons(ad, heartIcon, favouriteText, favouriteBottomHeaderDiv, favouriteWrapper, favouriteIconDiv, iconWrapper, bottomDetailsHeader, editIcon, editText, editBottomHeaderDiv, editWrapper, editIconDiv, deleteIcon, deleteText, deleteBottomHeaderDiv, deleteWrapper, deleteIconDiv) {
    if (getUserName() !== ad.user) {
        heartIcon.src = "/api/static/heartFull";
        favouriteText.innerHTML = "Usuń z ulubionych";
        favouriteBottomHeaderDiv.appendChild(favouriteWrapper);
        heartIcon.style.marginBottom = '2px';
        favouriteIconDiv.appendChild(heartIcon);
        iconWrapper.appendChild(favouriteBottomHeaderDiv);
        bottomDetailsHeader.appendChild(iconWrapper);
    } else if (getUserName() === ad.user) {
        editIcon.src = "/api/static/editIcon";
        editText.innerHTML = "Edytuj ogłoszenie";
        editBottomHeaderDiv.appendChild(editWrapper);
        editIcon.style.marginBottom = '2px';
        editIconDiv.appendChild(editIcon);
        deleteIcon.src = "/api/static/deleteIcon";
        deleteText.innerHTML = "Usuń ogłoszenie";
        deleteBottomHeaderDiv.appendChild(deleteWrapper);
        deleteIcon.style.marginBottom = '2px';
        deleteIconDiv.appendChild(deleteIcon);
        iconWrapper.appendChild(deleteBottomHeaderDiv);
        iconWrapper.appendChild(editBottomHeaderDiv);
        bottomDetailsHeader.appendChild(iconWrapper);
    }
}

