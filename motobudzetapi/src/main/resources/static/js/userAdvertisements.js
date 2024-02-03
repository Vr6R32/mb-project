function softlyRemoveDivWithOpacity(opacity, step, resultDiv, container, intervalDuration) {
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
    return opacity;
}

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
    photoElement.style.objectFit = "cover"

    createPhotoFadeEffect(photoElement, resultDiv);

    const advertisementDetailsHeader = createAdvertisementDetailsHeaderDiv();

    const headerTitleNameDiv = document.createElement('div');
    headerTitleNameDiv.className = 'headerTitleNameDiv';

    const advertisementTitleDiv = document.createElement("div");
    advertisementTitleDiv.className = 'advertisement-title-div';
    advertisementTitleDiv.textContent = ad.name;

    const modelBrandElement = createModelBrandDiv(ad);

    headerTitleNameDiv.appendChild(advertisementTitleDiv);
    headerTitleNameDiv.appendChild(modelBrandElement);

    advertisementDetailsHeader.appendChild(headerTitleNameDiv);
    const priceHeader = createPriceHeader(ad);
    advertisementDetailsHeader.appendChild(priceHeader);

    const advertisementDetailsDiv = createAdvertisementDetailsDiv();
    const advertisementDetailsMain = createAdvertisementDetailsMain();
    const advertisementDetails = createAdvertisementDetails();
    let mileageUnitValue = createMileageUnitSpan();
    mileageUnitValue.textContent = ad.mileageUnit;
    let horsePower = createHorsePowerSpan();
    let productionYear = createProductionYearSpan();
    let engineCapacity = createEngineCapacitySpan();
    const bottomDetailsHeader = createBottomDetailsHeaderDiv();

    const locationDetailsDiv = document.createElement('div');
    locationDetailsDiv.style.display = 'column';
    locationDetailsDiv.style.width = '100%';
    locationDetailsDiv.style.position = 'relative';
    locationDetailsDiv.style.top = '10px';

    const locationDetails = document.createElement("div");
    locationDetails.className = "locationDetails";

    const citySpan = document.createElement("span");
    citySpan.textContent = ad.city.name + ',';
    citySpan.style.fontSize = "22px";

    const stateSpan = document.createElement("span");
    stateSpan.textContent = ' \t' + ad.city.cityState.name;
    stateSpan.style.color = 'darkgoldenrod';
    stateSpan.style.fontSize = "14px";
    stateSpan.style.marginTop = "6px";

    locationDetails.appendChild(citySpan);
    locationDetails.appendChild(stateSpan);


    locationDetailsDiv.appendChild(locationDetails);
    bottomDetailsHeader.appendChild(locationDetailsDiv);
    const favouriteBottomHeaderDiv = createFavouriteBottomDiv();

    const favouriteWrapper = document.createElement('div');
    favouriteWrapper.id = 'favouriteWrapper';
    favouriteWrapper.style.display = 'flex';
    favouriteWrapper.style.alignItems = 'center';

    const favouriteIconDiv = document.createElement('div');
    favouriteIconDiv.style.color = 'white';
    favouriteIconDiv.style.fontSize = "26px";
    favouriteIconDiv.style.zIndex = '999';
    const favouriteText = createFavouriteTextSpan();


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


    const editBottomHeaderDiv = createEditBottomHeaderDiv();
    const editWrapper = createEditWrapperDiv();
    const editText = createEditTextSpan();
    const editIconDiv = createEditIconDiv();

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
                softlyRemoveDivWithOpacity(opacity, step, resultDiv, container, intervalDuration);

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
                softlyRemoveDivWithOpacity(opacity, step, resultDiv, container, intervalDuration);
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

    addContainerSpans(ad, mileageUnitValue, horsePower, productionYear, engineCapacity, advertisementDetails);

    advertisementDetailsMain.appendChild(advertisementDetails);
    advertisementDetailsDiv.appendChild(advertisementDetailsHeader);
    advertisementDetailsDiv.appendChild(advertisementDetailsMain);
    advertisementDetailsDiv.appendChild(bottomDetailsHeader);

    resultDiv.appendChild(advertisementDetailsDiv);

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

