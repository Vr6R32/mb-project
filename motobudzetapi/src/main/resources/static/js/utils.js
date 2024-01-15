
window.addEventListener('scroll', hideNavBar);


document.addEventListener('DOMContentLoaded', async () => {
    applySavedZoom();
    handleZoomSlider();
});




async function fetchWithAuth(url, options = {}) {
    if (!options.headers) {
        options.headers = {};
    }
    // await checkIsTokenValid(true);
    return fetch(url, options);
}


function handleZoomSlider() {
    const slider = document.getElementById('zoom-slider');
    const defaultVal = 1; // ustaw wartość domyślną bezpośrednio

    slider.oninput = (e) => {
        const val = e.target.valueAsNumber;

        if (Math.abs(val - defaultVal) < 0.02) { // 0.02 to zakres 'snap', dostosuj wg potrzeb
            slider.value = defaultVal;
            changeZoom(defaultVal); // Wywołaj funkcję zmiany skali
        } else {
            changeZoom(val); // Kontynuuj normalną zmianę skali
        }
    };
    showCookieBarNotification();
}

function getLastUploaded(pageNumber){

    const results2 = document.getElementById('results2');
    results2.style.marginTop = "50px";
    results2.style.width = "100%";
    results2.style.marginBottom = "0px";
    results2.style.maxWidth = "100%";
    results2.innerHTML = "";
    results2.style.minHeight = '650px';


    fetchWithAuth('/api/advertisements/last-uploaded?pageNumber=' + pageNumber)

        .then(response => response.json())
        .then(data => {
            advertisements = data;
            displayLastUploaded(currentMinIndex,currentMaxIndex,'left');
            paralaxHover();
        })
        .catch(error => {
            console.error('Błąd pobierania danych:', error);
        });
}

function createLastUploadedContainer() {
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
function showCookieBarNotification() {

    if (localStorage.getItem('cookieConsent') === 'true') {
        return;
    }

    // Utwórz elementy paska zgody na cookies
    const consentBar = document.createElement('div');
    consentBar.id = 'cookieConsentBar';
    consentBar.style.position = 'fixed';
    consentBar.style.bottom = '0';
    consentBar.style.left = '0';
    consentBar.style.width = '100%';
    consentBar.style.backgroundColor = 'black';
    consentBar.style.borderTop = '1px solid white';
    consentBar.style.color = 'white';
    consentBar.style.textAlign = 'center';
    consentBar.style.padding = '10px';
    consentBar.style.zIndex = '1000';
    consentBar.style.transition = 'bottom 1s'; // Dodanie animacji

    const consentText = document.createElement('span');
    consentText.textContent = 'Ta strona używa cookies. ';

    const consentButton = document.createElement('button');
    consentButton.textContent = 'OK';
    consentButton.style.marginLeft = '15px';
    consentButton.style.color = 'black';
    consentButton.style.backgroundColor = 'white';
    consentButton.style.border = 'none';
    consentButton.style.padding = '5px 10px';
    consentButton.style.cursor = 'pointer';

    // Dodaj funkcjonalność przycisku
    consentButton.onclick = function() {
        localStorage.setItem('cookieConsent', 'true');
        consentBar.style.bottom = '-100px'; // Zmiana pozycji paska do "zjechania" w dół

        setTimeout(function() {
            consentBar.style.display = 'none'; // Ukrycie paska po zakończeniu animacji
        }, 1000); // Czas trwania animacji (w milisekundach)
    };

    consentBar.appendChild(consentText);
    consentBar.appendChild(consentButton);
    document.body.appendChild(consentBar);
}

function hideNavBar () {
    const header = document.querySelector('header');
    if (window.pageYOffset > 300) {
        header.classList.add('header-hidden');
    } else {
        header.classList.remove('header-hidden');
    }
}

function changeZoom(value) {
    var content = document.getElementById('container-main');
    if (content) {
        var rectBefore = content.getBoundingClientRect();
        console.log('Przed skalowaniem:', rectBefore);

        content.style.transform = 'scale(' + value + ')';
        // Set the transform origin to the center of the content relative to the viewport
        content.style.transformOrigin = '50% 0';

        // Adjust position based on the change in height after scaling
        var heightChange = rectBefore.height * (1 - value);
        // content.style.top = (heightChange / 2) + 'px';

        setTimeout(function() {
            var rectAfter = content.getBoundingClientRect();
            console.log('Po skalowaniu:', rectAfter);
        }, 0);
    }

    localStorage.setItem('userZoom', value);
}

function paralaxHover() {
    /*
   * Paralax Hover
   */
    (function() {

        // TODO: Make these names suck less.
        var config = {
            rotation: 0.035, // Rotation modifier, larger number = less rotation
            alpha: 0.2, // Alpha channel modifer
            shadow: 10 // How much the shadow moves
        }

        var imagesList = document.querySelectorAll('.ph-image');
        var imagesArray = Array.prototype.slice.call(imagesList);
        var imageWidth, imageHeight, imageShadow, imageLighting;

        if (imagesArray.length <= 0) {
            return;
        }

        /*
         * TODO: This could get seriously gnarly with too many images on screen
         * Would be better to defer these to a single listener on a wrapping element.
         */
        imagesArray.forEach(function(image) {
            image.addEventListener('mouseenter', handleMouseEnter);
            image.addEventListener('mousemove', handleMouseMove);
            image.addEventListener('mouseleave', handleMouseLeave);
        });

        function handleMouseEnter() {
            imageWidth = this.offsetWidth || this.clientWidth || this.scrollWidth;
            imageHeight = this.offsetHeight || this.clientHeight || this.scrollheight;

            // TODO: Give these a unique ID for better selection later
            imageShadow = this.querySelector('.ph-shadow');
            imageLighting = this.querySelector('.ph-lighting');

            this.style.transform = 'perspective(' + imageWidth * 3 + 'px)';
        }

        function handleMouseMove(e) {
            let bounds = e.target.getBoundingClientRect();
            let centerX = imageWidth / 2;
            let centerY = imageHeight / 2;
            let deltaX = e.offsetX - centerX;
            let deltaY = e.offsetY - centerY;

            //Invert the sign for rotateX to correct the vertical inversion
            let rotateX = -deltaY / (config.rotation * 100); // Inverted rotation around X-axis for vertical movement
            let rotateY = deltaX / (config.rotation * 100); // Rotation around Y-axis for horizontal movement

            let angleRad = Math.atan2(deltaY, deltaX);
            let angleDeg = angleRad * 180 / Math.PI - 90;

            // var movement = e.offsetY / bounds.top;
            // var lightAlpha = movement * config.alpha;
            // var shadowMovement = movement * 5;

            if (angleDeg <= 0) {
                angleDeg = angleDeg + 360;
            }

            this.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
            // imageLighting.style.background = 'linear-gradient(' + angleDeg + 'deg, rgba(255,255,255, ' + lightAlpha + ') 0%, rgba(255,255,255,0) 60%)';
            // imageShadow.style.transform = 'translateX(' + shadowMovement + 'px) translateY(' + shadowMovement + 'px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
        }

        function handleMouseLeave(e) {
            this.style.transform = '';

            // imageLighting.style.background = '';
            // imageLighting.style.transform = '';
        }

    })();

}
document.addEventListener('DOMContentLoaded', function() {


    var darkModeCheckbox = document.getElementById('darkModeCheckbox');
    if (darkModeCheckbox) {
        darkModeCheckbox.addEventListener('change', function() {
            toggleDarkMode();
        });
    }

    // Call this on page load to apply the dark mode setting
    if(localStorage.getItem('darkMode') === 'true') {
        let container = document.getElementById('container-main');
        container.style.backgroundColor = 'black';
        document.body.classList.add('dark-mode');
        darkModeCheckbox.checked = true;
    }
});

function toggleDarkMode() {
    let container = document.getElementById('container-main');
    let isDarkMode = document.body.classList.toggle('dark-mode');
    container.style.backgroundColor = 'black';
    localStorage.setItem('darkMode', isDarkMode);
    if(!isDarkMode) {
        container.style.backgroundColor = 'transparent';
    }
}

function applySavedZoom() {
    var savedZoom = localStorage.getItem('userZoom');
    if (savedZoom) {
        var content = document.getElementById('container-main');
        if (content) {
            content.style.transform = 'scale(' + savedZoom + ')';
            content.style.transformOrigin = '50% 0';
        }
        var zoomSlider = document.getElementById('zoom-slider');
        if (zoomSlider) {
            zoomSlider.value = savedZoom;
        }
    }
}


function handleDarkModeInverse(resultDiv,iconWrapper) {
    if (localStorage.getItem('darkMode') === 'true') {
        resultDiv.style.boxShadow = "0 0 20px moccasin";
    } else {
        resultDiv.style.boxShadow = "0 0 20px darkgoldenrod";
    }


    if (darkModeCheckbox) {
        darkModeCheckbox.addEventListener('change', function () {
            if (darkModeCheckbox.checked) {
                resultDiv.style.boxShadow = "0 0 20px moccasin";
            } else {
                resultDiv.style.boxShadow = "0 0 20px darkgoldenrod";
            }
        })
    }

    // Add hover effect on mouseover
    resultDiv.onmouseover = () => {
        if (localStorage.getItem('darkMode') === 'true') {
            resultDiv.style.boxShadow = "0 0 20px cyan";
            if(iconWrapper) {
                iconWrapper.style.opacity = '1'; // Pokaż iconWrapper
            }
        } else
            resultDiv.style.boxShadow = "0 0 20px moccasin";
        if(iconWrapper){
            iconWrapper.style.opacity = '1'; // Pokaż iconWrapper
        }
    };

    // Remove hover effect on mouseout
    resultDiv.onmouseout = () => {
        if (localStorage.getItem('darkMode') === 'true') {
            resultDiv.style.boxShadow = "0 0 20px moccasin";
            if(iconWrapper) {
                iconWrapper.style.opacity = '0'; // Pokaż iconWrapper
            }
        } else
            resultDiv.style.boxShadow = "0 0 20px darkgoldenrod";
            if(iconWrapper) {
                iconWrapper.style.opacity = '0'; // Pokaż iconWrapper
            }
    }
}


function showSuccessNotification(message) {
    setTimeout(function() {
        let navbar = document.createElement('div');
        navbar.setAttribute('id', 'popupNavbar');
        navbar.style.top = '-120px';  // Set the initial position

        let text = document.createElement('p');
        text.style.color = 'white';
        text.textContent = message;

        const successIcon = document.createElement('img');
        successIcon.src = '/api/static/successIcon';
        successIcon.alt = 'successIcon';

        navbar.appendChild(successIcon);
        navbar.appendChild(text);
        document.body.appendChild(navbar);

        setTimeout(function() {
            navbar.style.top = '0';
        }, 500);

        setTimeout(function() {
            navbar.style.top = '-120px';
        }, 7000);
    });
}


function createParalaxMiniaturesGallery(images, parentDiv, mainPhoto) {
    // Znajdź najbardziej równomierny podział zdjęć na wiersze
    let rows = Math.ceil(images.length / 6);
    let imagesPerRow = Math.ceil(images.length / rows);

    // Stwórz kontener na wiersze
    let rowContainers = [];
    for (let i = 0; i < rows; i++) {
        let row = document.createElement('div');
        row.style.display = 'flex';
        row.style.flexWrap = 'wrap'; // Pozwala elementom przechodzić do nowego wiersza
        row.style.justifyContent = 'center';
        row.style.alignItems = 'center';
        parentDiv.appendChild(row);
        rowContainers.push(row);
    }

    // Dodaj obrazy do wierszy
    images.forEach((imageUrl, index) => {
        const figure = document.createElement('figure');
        figure.className = 'ph-image';
        figure.style.width = '220px'; // Stała szerokość
        figure.style.height = '170px';
        figure.style.margin = '10px';
        figure.style.cursor = 'pointer';
        figure.style.userSelect = 'none';

        const img = document.createElement('img');
        img.src = '/api/static/photo/' + imageUrl;
        figure.appendChild(img);

        // Dodanie event listenera
        figure.addEventListener('click', function() {
            if(index!==currentPhotoIndex){
                currentPhotoIndex = index;
                changePhoto(currentPhotoIndex, mainPhoto);
            }
        });

        // Dodaj figure do odpowiedniego wiersza
        let rowIndex = Math.floor(index / imagesPerRow);
        rowContainers[rowIndex].appendChild(figure);
    });
}



function createParalaxMiniatureLastUploaded(image,parrentDiv,height,width) {

    const figure = document.createElement('figure');
    figure.className = 'ph-image';
    figure.style.width = height;
    figure.style.height = width;
    figure.style.marginLeft = '20px';
    figure.style.marginRight = '20px';
    figure.appendChild(image);
    parrentDiv.appendChild(figure);

}

function createParalaxMiniatureThumbnail(image,parrentDiv,height,width) {

    const figure = document.createElement('figure');
    figure.className = 'ph-image';
    figure.style.width = height;
    figure.style.height = width;
    figure.appendChild(image);
    parrentDiv.appendChild(figure);

}
function createParalaxMiniature(image,parrentDiv) {

        const figure = document.createElement('figure');
        figure.className = 'ph-image';
        figure.style.width = '350px';
        figure.style.height = '200px';
        figure.style.marginLeft = '20px';
        figure.appendChild(image);
        parrentDiv.appendChild(figure);

}

function createAdvertisementIndexDiv(mainContainer, advertisement) {


    const resultDiv = document.createElement("div");
    resultDiv.id = "advertisementResultDiv";
    resultDiv.style.width = "100%";
    resultDiv.style.maxWidth = "100%";
    resultDiv.style.boxSizing = "border-box";
    // resultDiv.style.flexShrink = '1';



    const imageDiv = document.createElement('div');

    imageDiv.style.position = 'relative'; // This makes it a positioned ancestor
    imageDiv.style.display = 'flex'; // Use flex for centering the image
    imageDiv.style.alignItems = 'center'; // Vertically align items in the center
    imageDiv.style.justifyContent = 'center'; // Horizontally

    imageDiv.style.width = '100%';
    imageDiv.style.maxWidth = '100%';
    imageDiv.style.maxHeight = '100%';
    imageDiv.style.minHeight = '675px';
    imageDiv.style.justifyContent = 'center';
    imageDiv.style.display = 'flex';
    imageDiv.style.alignItems = 'center';
    imageDiv.style.marginTop = '15px';
    imageDiv.style.marginBottom = '15px';
    imageDiv.style.flexBasis = 'auto';
    // imageDiv.style.boxSizing = "border-box";
    // imageDiv.style.paddingRight = '25px';


    const mainPhoto = document.createElement('img');
    mainPhoto.className = 'abc';
    mainPhoto.src = '/api/static/photo/' + advertisement.urlList[0];
    mainPhoto.style.maxHeight = '675px';
    mainPhoto.alt = 'MainUrlPhoto';
    mainPhoto.id = 'mainUrlPhoto';
    mainPhoto.style.backgroundColor = 'transparent';
    mainPhoto.style.borderRadius = '20px';
    // mainPhoto.style.flex = '1 1 auto'; // This allows the image to be flexible within the container



    const previousArrow = document.createElement('span');
    previousArrow.setAttribute('id', 'previousArrow');
    previousArrow.textContent = '←';
    previousArrow.style.cursor = 'pointer';
    previousArrow.style.color = 'darkgoldenrod';
    previousArrow.style.boxSizing = "border-box";
    // previousArrow.style.flexShrink = '1';
    previousArrow.style.marginRight = '1%';
    previousArrow.style.fontSize = '6vw'; // or use '4em'
    // previousArrow.style.flex = '0 1 auto'; // Flex settings for responsiveness
    previousArrow.addEventListener('click', () => previousPhoto(mainPhoto));
    previousArrow.style.userSelect = 'none'; // Zapobieganie zaznaczaniu tekstu



    previousArrow.style.position = 'absolute'; // Position it absolutely
    previousArrow.style.left = '0'; // Align it to the left edge
    previousArrow.style.top = '50%'; // Center it vertically
    previousArrow.style.transform = 'translateY(-50%)'; // Offset by half its height to truly center


    const nextArrow = document.createElement('span');
    nextArrow.setAttribute('id', 'nextArrow');
    nextArrow.textContent = '→';
    nextArrow.style.cursor = 'pointer';
    nextArrow.style.color = 'darkgoldenrod';
    nextArrow.style.marginLeft = '1%';
    nextArrow.style.boxSizing = "border-box";
    // nextArrow.style.flexShrink = '1';
    nextArrow.style.fontSize = '6vw'; // or use '4em'
    // nextArrow.style.flex = '0 1 auto'; // Flex settings for responsiveness

    nextArrow.addEventListener('click', () => nextPhoto(mainPhoto));
    nextArrow.style.userSelect = 'none'; // Zapobieganie zaznaczaniu tekstu



    nextArrow.style.position = 'absolute'; // Position it absolutely
    nextArrow.style.right = '0'; // Align it to the right edge
    nextArrow.style.top = '50%'; // Center it vertically
    nextArrow.style.transform = 'translateY(-50%)'; // Offset by hal

    const fadeEffect = document.createElement('div');
    fadeEffect.classList.add('fade-effect-big');
    fadeEffect.style.backgroundColor = 'transparent';

    fadeEffect.style.maxWidth = '100%';


    // fadeEffect.appendChild(mainPhoto);
    imageDiv.appendChild(previousArrow)
    imageDiv.appendChild(mainPhoto)
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
        createAdvertisementIndexDetailsContainer('mileage', 'MileageIcon', advertisement.mileage),
        createAdvertisementIndexDetailsContainer('productionDate', 'ProductionDateIcon', advertisement.productionDate),
        createAdvertisementIndexDetailsContainer('fuelType', 'FuelTypeIcon', advertisement.fuelType),
        createAdvertisementIndexDetailsContainer('engineHorsePower', 'EngineIcon', advertisement.engineHorsePower + ' HP'),
        createAdvertisementIndexDetailsContainer('engineType/' + advertisement.engineType, 'transmissionIcon', advertisement.engineType),
        createAdvertisementIndexDetailsContainer('transmissionType/' + advertisement.transmissionType, 'transmissionIcon', advertisement.transmissionType)
    ];


    containers.push(createAdvertisementIndexDetailsContainer('price', 'PriceIcon', advertisement.price + ',-'));

    const maxTextWidth = Math.max(
        ...containers.map(container => container.querySelector('span').offsetWidth)
    );

    containers.forEach(container => {
        container.style.width = maxTextWidth + 'px';
        container.style.maxWidth = "100%";
        container.style.boxSizing = "border-box";
        container.style.flexBasis = "auto";
        advertisementDetails.appendChild(container);
    });



    advertisementDetailsMain.appendChild(advertisementDetailsHeader);
    advertisementDetailsMain.appendChild(advertisementDetailsOwner);
    advertisementDetailsMain.appendChild(advertisementDetails);

    advertisementDetailsDiv.appendChild(advertisementDetailsMain);

    let paralaxMinatureDiv = document.createElement('div');
    paralaxMinatureDiv.style.display = 'flex';
    paralaxMinatureDiv.style.justifyContent = 'center'; // Wyśrodkowanie w poziomie
    paralaxMinatureDiv.style.alignItems = 'center'; // Wyśrodkowanie w pionie
    paralaxMinatureDiv.style.flexWrap = 'wrap'; // Pozwala elementom przechodzić do nowego wiersza
    paralaxMinatureDiv.style.marginTop = '40px';
    paralaxMinatureDiv.style.marginBottom = '40px';
    paralaxMinatureDiv.style.maxWidth = '100%';
    paralaxMinatureDiv.style.width = '100%';


    resultDiv.appendChild(paralaxMinatureDiv);
    resultDiv.appendChild(advertisementDetailsDiv);

    mainContainer.appendChild(resultDiv);


    let descriptionContainer = document.createElement('div');
    let descriptionElement = document.createElement('div');

    descriptionElement.innerHTML = advertisement.description;
    descriptionElement.style.color = 'white';
    descriptionContainer.appendChild(descriptionElement);

    let descContainer = document.createElement('div');
    descContainer.className = "ql-editor";
    descContainer.style.width = '100%';
    descContainer.style.maxWidth = '100%';
    descContainer.style.borderRadius = '20px';
    descContainer.style.margin = '0 auto';
    descContainer.style.marginTop = '30px';



    descContainer.style.backgroundColor = 'transparent';
    descContainer.appendChild(descriptionContainer);

    resultDiv.appendChild(descContainer);

    createParalaxMiniaturesGallery(advertisement.urlList,paralaxMinatureDiv,mainPhoto);

    paralaxHover();

    return resultDiv;
}
function updateTooltipPosition(event) {
    const tooltips = document.querySelectorAll('.tooltip');
    tooltips.forEach(tooltip => {
        tooltip.style.left = (event.pageX + 20) + 'px';
        tooltip.style.top = (event.pageY + 20) + 'px';
    });
}
function createAdvertisementIndexDetailsContainer(iconPath, altText, value) {
    const container = document.createElement('advertisementInfoContainer');
    container.setAttribute('id', 'advertisementInfoContainer');
    container.style.color = 'darkgoldenrod';

    const icon = document.createElement('img');
    icon.src = `/api/static/${iconPath}`;
    icon.alt = altText;
    icon.style.marginBottom = '2px';

    const valueElement = document.createElement('span');
    valueElement.textContent = value;

    container.appendChild(icon);
    container.appendChild(valueElement);

    return container;
}
function getUserName() {
    let userNameElement = document.getElementById('username');
    if (userNameElement) {
        return userNameElement.textContent;
    } else {
        return null; // or any default value you want to return when not logged in
    }
}
function createDialogBox(message){
    if(!document.getElementById('overlayId')){
        const overlay = document.createElement('div');
        overlay.setAttribute('id', 'overlayId');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'; // Czarny kolor z przeźroczystością


        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                document.body.removeChild(overlay); // Usuń overlay po kliknięciu na tło
            }
        });

        // Stwórz okno dialogowe
        const dialogBox = document.createElement('div');
        dialogBox.setAttribute('id','dialogBox')
        dialogBox.style.position = 'fixed';
        dialogBox.style.top = '50%';
        dialogBox.style.left = '50%';
        dialogBox.style.height = '250px';
        dialogBox.style.width = '600px';
        dialogBox.style.transform = 'translate(-50%, -50%)';
        dialogBox.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'; // Czarny kolor z przeźroczystością
        dialogBox.style.borderRadius = '15px';
        dialogBox.style.boxShadow = '0 0 20px darkgoldenrod'; // Dodaj efekt cienia
        dialogBox.style.flexDirection = 'column'; // Kierunek kolumny
        dialogBox.style.alignItems = 'center'; // Wyśrodkowanie w pionie
        dialogBox.style.textAlign = 'center'; // Wyśrodkowanie zawartości w poziomie
        dialogBox.style.display = 'flex';
        dialogBox.style.justifyContent = 'center'; // Wyśrodkowanie zawartości w pionie

        const headerTitle = document.createElement('dialogBox');
        headerTitle.style.width = "100%";
        headerTitle.setAttribute('id', 'dialogBoxTitle');
        headerTitle.textContent = message;
        headerTitle.style.color = 'darkgoldenrod';
        headerTitle.style.fontSize = '32px';
        headerTitle.style.fontWeight = 'bold'; // Ustawienie pogrubienia
        headerTitle.style.marginTop = '15px'

        dialogBox.appendChild(headerTitle);
        overlay.appendChild(dialogBox);
        document.body.appendChild(overlay);
    }
}
function updateCitySuggestions(suggestions) {
    const cityInput = document.getElementById('city');
    const cityStateInput = document.getElementById('cityState');
    const cityStateLabel = document.getElementById('cityStatelabel');
    const suggestionsList = document.getElementById('suggestionsList');

    // Usuń wszystkie istniejące propozycje z listy
    while (suggestionsList.firstChild) {
        suggestionsList.removeChild(suggestionsList.firstChild);
    }

    // Wyświetl nowe propozycje
    suggestions.forEach(suggestion => {
        const suggestionItem = document.createElement('li');
        suggestionItem.textContent = suggestion.cityName;
        suggestionItem.addEventListener('click', function () {
            // Po kliknięciu propozycji, wypełnij pole tekstowe i wyczyść listę propozycji
            cityInput.value = suggestion.name;
            cityStateInput.value = suggestion.cityStateName;
            cityStateInput.style.color = 'white';
            cityStateLabel.style.color = 'white';
            suggestionsList.innerHTML = '';
        });
        suggestionsList.appendChild(suggestionItem);
    });

    // Jeśli nie ma propozycji, ukryj listę
    if (suggestions.length === 0) {
        suggestionsList.style.display = 'none';
    } else {
        suggestionsList.style.display = 'block';
    }
}
function fetchBrands() {
    fetch('/api/brands')
        .then(response => response.json())
        .then(data => {
            const brandSelect = document.getElementById('brand');
            brandSelect.innerHTML = '<option value="">Wybierz markę</option>';
            data.forEach(brand => {
                const option = document.createElement('option');
                option.value = brand.name;
                option.text = brand.name;
                brandSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Błąd pobierania marek:', error));
}
function loadFileDrop(){
    const fileDropArea = document.getElementById('fileDropArea');

    fileDropArea.addEventListener('drop', handleFileDrop);
    fileDropArea.addEventListener('dragover', function(e) {
        e.preventDefault();
    });
}

function fetchSpecifications() {
    function populateSelect(selectId, data) {
        const select = document.getElementById(selectId);
        // select.innerHTML = `<option value="">Wybierz ${selectId}</option>`;
        select.innerHTML = `<option value="">------</option>`;
        data.forEach(option => {
            const value = option.name;
            const text = option.name;

            const optionElement = document.createElement('option');
            optionElement.value = value;
            optionElement.text = text;
            select.appendChild(optionElement);
        });
    }

    fetch('/api/spec/fuelTypes')
        .then(response => response.json())
        .then(data => populateSelect('fuelType', data))
        .catch(error => console.error('Błąd pobierania rodzaju paliwa:', error));

    fetch('/api/spec/driveTypes')
        .then(response => response.json())
        .then(data => populateSelect('driveType', data))
        .catch(error => console.error('Błąd pobierania rodzaju napędu:', error));

    fetch('/api/spec/engineTypes')
        .then(response => response.json())
        .then(data => populateSelect('engineType', data))
        .catch(error => console.error('Błąd pobierania rodzaju silnika:', error));

    fetch('/api/spec/transmissionTypes')
        .then(response => response.json())
        .then(data => populateSelect('transmissionType', data))
        .catch(error => console.error('Błąd pobierania rodzaju skrzyni biegów:', error));
}
function handleResponse(response) {
    const errorMessagesElement = document.getElementById('errorMessages');
    errorMessagesElement.innerHTML = ''; // Wyczyść komunikaty błędów
        if (response.status === 400) {
            return response.text().then(errorMessage => {
                alert(errorMessage);
            });
        } else {
            throw new Error('Wystąpił błąd podczas przetwarzania formularza.');
        }
}

function createHeader(buttonName){

    let headerContainer = document.getElementById("headerContainer");
    headerContainer.textContent = buttonName.replace("_", " ");

    let hrLine = document.createElement("hr");
    hrLine.setAttribute('id', 'headerLine');

    headerContainer.appendChild(hrLine);

    cleanResultsDiv();

    setTimeout(() => {
        hrLine.style.transform = "scaleX(1)";
        hrLine.style.borderTopColor = "darkgoldenrod";

    }, 500);
}

function cleanResultsDiv() {
    let childConversationMessageInputElement = document.getElementById('messageInputDiv');

    let childConversationResultElements = document.querySelectorAll('#rightContainer [id^="messageResultDiv"]');

    childConversationResultElements.forEach(element => {
        element.parentNode.removeChild(element);
    });

    if (childConversationMessageInputElement) {
        childConversationMessageInputElement.parentNode.removeChild(childConversationMessageInputElement);
    }

    let resultContainerRight = document.getElementById("resultContainerRight");
    resultContainerRight.innerHTML = "";

    resultContainerRight.style.display = 'flex';
}
function handleError(error) {
    console.error(error);
    alert(error.message);
}
function getValue(id) {
    return document.getElementById(id).value;
}
function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = event => resolve(event.target.result);
        reader.onerror = event => reject(event.error);
        reader.readAsDataURL(file);
    });
}
function handleDragStart(e) {

    dragSrcElement = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}
function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}
function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation(); // Stops some browsers from redirecting.
    }

    if (dragSrcElement !== this) {
        const thumbnailsContainer = document.getElementById('thumbnails');
        const thumbnails = thumbnailsContainer.getElementsByClassName('thumbnail');

        const targetIndex = Array.from(thumbnails).indexOf(this);
        const sourceIndex = Array.from(thumbnails).indexOf(dragSrcElement);

        if(targetIndex<sourceIndex){
            // Swap the positions of the two dragged thumbnails only
            thumbnailsContainer.insertBefore(this, thumbnails[sourceIndex]);
            thumbnailsContainer.insertBefore(dragSrcElement, thumbnails[targetIndex]);

            // Update the selectedFiles array to reflect the new order of files
            const filesCopy = selectedFiles.slice();
            const movedFileSource = filesCopy[sourceIndex];
            filesCopy[sourceIndex] = filesCopy[targetIndex];
            filesCopy[targetIndex] = movedFileSource;

            selectedFiles = filesCopy;

        }

        if(targetIndex > sourceIndex){
            // Swap the positions of the two dragged thumbnails only
            thumbnailsContainer.insertBefore(dragSrcElement, thumbnails[targetIndex].nextSibling);
            thumbnailsContainer.insertBefore(this, dragSrcElement);

            // Update the selectedFiles array to reflect the new order of files
            const filesCopy = selectedFiles.slice();
            const movedFileSource = filesCopy[sourceIndex];
            filesCopy[sourceIndex] = filesCopy[targetIndex];
            filesCopy[targetIndex] = movedFileSource;

            selectedFiles = filesCopy;
        }

    }

    return false;
}
function resetFileDropArea() {
    fileDropArea.innerHTML = "Możesz zmienić kolejność zdjęć za pomocą myszki.\n Pierwsze zdjęcie będzie główną miniaturką";
}

function advertisementFormDataExtract() {
    const formData = new FormData();

    // Założenie, że 'getValue' to funkcja pobierająca wartości z pól formularza
    // np. document.getElementById(id).value

    // Dodawanie wartości tekstowych do obiektu FormData
    formData.append('name', getValue('name'));
    formData.append('brand', getValue('brand'));
    formData.append('model', getValue('model'));
    formData.append('fuelType', getValue('fuelType'));
    formData.append('driveType', getValue('driveType'));
    formData.append('engineType', getValue('engineType'));
    formData.append('transmissionType', getValue('transmissionType'));
    formData.append('mileage', getValue('mileage'));
    formData.append('mileageUnit', getValue('mileageUnit'));
    formData.append('price', getValue('price'));
    formData.append('priceUnit', getValue('priceUnit'));
    formData.append('engineCapacity', getValue('engineCapacity'));
    formData.append('engineHorsePower', getValue('engineHorsePower'));
    formData.append('productionDate', getValue('productionDate'));
    formData.append('firstRegistrationDate', getValue('firstRegistrationDate'));
    formData.append('city', getValue('city'));
    formData.append('cityState', getValue('cityState'));

    const descriptionContent = quill.container.firstChild.innerHTML;
    formData.append('description', descriptionContent);

    let mainPhotoUrl;
    if (selectedFiles && selectedFiles.length > 0) {
        mainPhotoUrl = getValue('name') + '-' + selectedFiles[0].name;
        formData.append('mainPhotoUrl', mainPhotoUrl);
    }

    selectedFiles.forEach((file) => {
        if (file.blob instanceof Blob) {
            formData.append('files', file.blob , file.name);
        } else {
            formData.append('files',file);
        }
    });

    return formData;
}

function createDropDeleteZone(){
    if(document.getElementById('deleteZone')===null){

        const trashIcon = document.createElement('img');
        trashIcon.src = `/api/static/trashClosed`;
        trashIcon.alt = 'trashIcon';


        trashIcon.style.pointerEvents = 'none';
        trashIcon.ondragstart = function() { return false; };

        // Event listener to prevent right-click
        trashIcon.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        });

        const deleteZone = document.createElement('div');

        deleteZone.id = 'deleteZone';

        deleteZone.style.position = 'absolute';
        deleteZone.style.top = '60px';



        deleteZone.appendChild(trashIcon);

        deleteZone.addEventListener('mouseover', function() {
            trashIcon.src = '/api/static/trashOpen'; // Switch to open trash icon
        });
        deleteZone.addEventListener('mouseout', function() {
            trashIcon.src = '/api/static/trashClosed'; // Switch back to closed trash icon
        });

        deleteZone.addEventListener('dragover', handleDeleteZoneDragOver);
        deleteZone.addEventListener('drop', handleDeleteZoneDrop);

        deleteZone.addEventListener('dragenter', function() {
            trashIcon.src = '/api/static/trashOpen'; // Switch to open trash icon
        });
        deleteZone.addEventListener('dragleave', function() {
            trashIcon.src = '/api/static/trashClosed'; // Switch back to closed trash icon
        });

        let thumbnailzone = document.getElementById('half-container-big2');

        thumbnailzone.insertBefore(deleteZone, document.getElementById('thumbnails'));
    }
}

function getDeviceScreenInfo(){
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;

    console.log(`Szerokość ekranu: ${screenWidth}px`);
    console.log(`Wysokość ekranu: ${screenHeight}px`);

    const availableScreenWidth = window.screen.availWidth;
    const availableScreenHeight = window.screen.availHeight;

    console.log(`Dostępna szerokość ekranu: ${availableScreenWidth}px`);
    console.log(`Dostępna wysokość ekranu: ${availableScreenHeight}px`);

    const pixelsPerInch = window.screen.pixelDensity;

    console.log(`Piksele na cal (PPI): ${pixelsPerInch}`);

    const colorDepth = window.screen.colorDepth;

    console.log(`Głębia kolorów: ${colorDepth} bitów`);

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    console.log(`Szerokość okna przeglądarki: ${windowWidth}px`);
    console.log(`Wysokość okna przeglądarki: ${windowHeight}px`);

    window.addEventListener('resize', () => {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        console.log(`Nowa szerokość okna przeglądarki: ${windowWidth}px`);
        console.log(`Nowa wysokość okna przeglądarki: ${windowHeight}px`);
    });

}

function handleEvType() {
    document.getElementById('fuelType').addEventListener('change', function () {
        const fuelType = this.value;
        const transmissionType = document.getElementById('transmissionType');
        const engineType = document.getElementById('engineType');
        const engineCapacity = document.getElementById('engineCapacity');

        if (fuelType === 'EV') {
            // Sprawdzanie, czy opcja 'AUTOMAT' istnieje w 'transmissionType'
            if (Array.from(transmissionType.options).some(option => option.value === 'Automat')) {
                transmissionType.value = 'Automat';
            }
            transmissionType.disabled = true;

            // Analogicznie dla 'engineType'
            if (Array.from(engineType.options).some(option => option.value === 'Cewka')) {
                engineType.value = 'Cewka';
            }
            engineType.disabled = true;

            engineCapacity.value = '0';
            engineCapacity.disabled = true;
        } else {
            transmissionType.disabled = false;
            engineType.disabled = false;
            engineCapacity.disabled = false;
            transmissionType.value = '------';
            engineType.value = '------';
            engineCapacity.value = '';
        }
    });
}

function fetchModels(brand) {
    const modelSelect = document.getElementById('model');
    if (brand) {
        fetch(`/api/models/${brand}`)
            .then(response => response.json())
            .then(data => {
                modelSelect.innerHTML = '<option value="">Wybierz model</option>';
                data.forEach(model => {
                    const option = document.createElement('option');
                    option.value = model.name;
                    option.text = model.name;
                    modelSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Błąd pobierania modeli:', error));
    } else {
        modelSelect.innerHTML = '<option value="">Wybierz model</option>';
    }
}

function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');
    snowflake.style.left = Math.random() * window.innerWidth + 'px';
    snowflake.style.animationDuration = Math.random() * 3 + 5 + 's'; // between 5 - 8 seconds
    snowflake.style.opacity = Math.random();
    snowflake.style.fontSize = Math.random() * 20 + 10 + 'px'; // większe rozmiary
    snowflake.style.zIndex = '-100';

    document.getElementById('snowflakeContainer').appendChild(snowflake);

    setTimeout(() => {
        snowflake.remove();
    }, 8000); // Zwiększony czas do 8 sekund
}

setInterval(createSnowflake, 300);


function createDescriptionEditor() {
    let horizontalContainer = document.getElementById('half-container-horizontal');
    horizontalContainer.style.marginBottom = '200px';
    horizontalContainer.style.padding = '20px'; // na przykład 20 pikseli

    let editor = document.createElement('div'); // zamiast 'textarea'
    editor.id = "editor";

    let label = document.createElement('div');
    label.textContent = 'Opis Ogłoszenia:'
    label.style.marginTop = '15px';
    label.style.marginBottom = '15px';
    label.style.color = 'darkgoldenrod';
    label.style.width = '1300px';
    label.style.textAlign = 'center';
    label.style.fontSize = '18px';

    editor.style.scrollbarWidth = 'thin';
    editor.style.scrollbarColor = 'darkgoldenrod transparent';
    editor.style.WebkitScrollbar = 'thin';
    editor.style.WebkitScrollbarTrack = 'transparent';
    editor.style.WebkitScrollbarThumb = 'darkgoldenrod';
    editor.style.WebkitScrollbarThumbHover = 'goldenrod';


    // Stylizacja dla textarea
    editor.style.width = '1200px';
    editor.style.maxWidth = '100%';
    editor.style.padding = '40px';
    editor.style.height = '700px';


    editor.style.backgroundColor = 'black';
    editor.style.borderRadius = '10px';
    editor.style.border = "1px solid rgba(255, 255, 255, 0.5)"; // Dodano bezpośrednio z Twojego wcześniejszego kodu
    editor.style.overflowY = 'auto'; // Dodane

    // Dodanie elementów do kontenera
    horizontalContainer.appendChild(label);
    horizontalContainer.appendChild(editor);
    horizontalContainer.appendChild(document.createElement('br'));

    const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],
        // ['blockquote', 'code-block'],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': ['white','blue','yellow','red','pink','green',] }, { 'background': ['black'] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        // ['clean']
    ];

    quill = new Quill('#editor', {
        modules: {
            toolbar: toolbarOptions
        },
        theme: 'snow'
    });

    quill.root.style.color = '#fff';
    quill.format('color', '#fff'); // Ustawienie domyślnego koloru tekstu na biały
    quill.format(0, quill.getLength(), 'color', '#fff');
}



async function checkIsTokenValid(isFetch) {
    let accessTokenExpirationTime = localStorage.getItem("accessTokenExpirationTime");
    let refreshTokenExpirationTime = localStorage.getItem("refreshTokenExpirationTime");
    let currentDate = Date.now();

    let accessTokenValid = accessTokenExpirationTime && !isNaN(accessTokenExpirationTime);
    let refreshTokenValid = refreshTokenExpirationTime && !isNaN(refreshTokenExpirationTime) && parseInt(refreshTokenExpirationTime, 10) > currentDate;

    if (accessTokenValid) {
        let accessTokenExpirationDate = new Date(parseInt(accessTokenExpirationTime, 10));
        let tenMinutesBeforeExpiration = new Date(accessTokenExpirationDate.getTime() - 10 * 600);

        if (currentDate >= tenMinutesBeforeExpiration.getTime()) {
            console.log("Token za chwilę wygaśnie. Odświeżanie tokenu.");
            await refreshToken(isFetch);
        } else {
            console.log("Token jest jeszcze ważny.");
        }
    } else if (refreshTokenValid) {
        console.log("AccessToken jest nieważny, ale refreshToken jest ważny. Odświeżanie tokenu.");
        await refreshToken(isFetch);
    } else {
        console.log("Oba tokeny są nieważne lub nie istnieją. Użytkownik może być zmuszony do ponownego logowania.");
    }
}

function handleLoginResponse(errorOccurred) {
    if (errorOccurred) {
        clearForm();
        createDialogBox('Nieprawidłowe dane logowania.');
    } else {
        window.location = getRedirectLink();
    }
}

async function refreshToken() {
    let url = '/api/v1/auth/refresh-token';

    try {
        let response = await fetch(url, {
            method: 'POST',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Problem z odświeżeniem tokenu.');
        }

        handleLoginResponse();

    } catch (error) {
        console.error('Error:', error);
    }
}

function getCookie(name) {
    let cookieArray = document.cookie.split(';');
    for (let cookie of cookieArray) {
        let [cookieName, cookieValue] = cookie.split('=');
        if (cookieName.trim() === name) {
            return cookieValue;
        }
    }
    return null;
}

function getRedirectLink() {
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get('redirect');
    return redirect ? redirect : '/';
}



function setFailGif(submitButton) {
    submitButton.style.display = 'none';
    const failGif = document.createElement('img');
    failGif.src = '/api/static/validationFail'; // Ścieżka do gif niepowodzenia walidacji
    failGif.id = 'failGif';
    failGif.style.height = '200px';
    failGif.style.width = '200px';
    submitButton.parentNode.insertBefore(failGif, submitButton);

    // Po 3 sekundach ukryj gif i pokaż ponownie przycisk
    setTimeout(function () {
        failGif.parentNode.removeChild(failGif);
        submitButton.style.display = 'block';
    }, 4000);
}

function setSuccessGif(submitButton) {
    submitButton.style.display = 'none';
    const loadingGif = document.createElement('img');
    loadingGif.src = '/api/static/loading';
    loadingGif.id = 'loadingGif';
    loadingGif.style.height = '100px';
    loadingGif.style.width = '100px';
    loadingGif.style.marginBottom = '15px';
    submitButton.parentNode.insertBefore(loadingGif, submitButton);

    setTimeout(function () {
        loadingGif.parentNode.removeChild(loadingGif);
        submitButton.style.display = 'block';
    }, 6000);
}



function validatePhotos() {
    if (selectedFiles.length === 0) {
        alert('Umieść zdjęcia!');
        return false;
    }
    return true;
}

function validateForm(formElements) {
    for (let element of formElements) {
        if (element.required) {
            const input = document.getElementById(element.id);
            if (!input.value.trim()) {
                alert(`Pole ${element.label} jest wymagane.`);
                return false; // Formularz jest niepoprawny
            }
        }

        if (element.type === 'select' && element.required) {
            const select = document.getElementById(element.id);
            if (select.selectedIndex === 0) {
                alert(`Pole ${element.label} jest wymagane.`);
                return false; // Formularz jest niepoprawny
            }
        }
    }
    return true; // Formularz jest poprawny
}

