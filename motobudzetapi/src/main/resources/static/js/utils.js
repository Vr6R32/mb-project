
window.addEventListener('scroll', hideNavBar);


document.addEventListener('DOMContentLoaded', async () => {
    applySavedZoom();
    handleZoomSlider();
});

function isMobileDevice() {
    const userAgent = navigator.userAgent;
    const maxMobileWidth = 300;
    const isMobileWidth = window.innerWidth <= maxMobileWidth;
    return /Mobi|Android/i.test(userAgent) || isMobileWidth;
}


async function fetchWithAuth(url, options = {}) {
    if (!options.headers) {
        options.headers = {};
    }
    // await checkIsTokenValid(true);
    return fetch(url, options);
}


function handleZoomSlider() {
    const slider = document.getElementById('zoom-slider');
    const defaultVal = 1;

    slider.oninput = (e) => {
        const val = e.target.valueAsNumber;

        if (Math.abs(val - defaultVal) < 0.02) {
            slider.value = defaultVal;
            changeZoom(defaultVal);
        } else {
            changeZoom(val);
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
            if(!isMobileDevice()){
                paralaxHover();
            }
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

    const cookiesBar = document.createElement('div');
    cookiesBar.id = 'cookieConsentBar';
    cookiesBar.style.position = 'fixed';
    cookiesBar.style.bottom = '0';
    cookiesBar.style.left = '0';
    cookiesBar.style.width = '100%';
    cookiesBar.style.backgroundColor = 'black';
    cookiesBar.style.borderTop = '1px solid white';
    cookiesBar.style.color = 'white';
    cookiesBar.style.textAlign = 'center';
    cookiesBar.style.padding = '10px';
    cookiesBar.style.zIndex = '1000';
    cookiesBar.style.transition = 'bottom 1s'; // Dodanie animacji

    const cookiesInfoText = document.createElement('span');
    cookiesInfoText.textContent = 'Ta strona używa cookies. ';

    const cookiesAcceptButton = document.createElement('button');
    cookiesAcceptButton.textContent = 'OK';
    cookiesAcceptButton.style.marginLeft = '15px';
    cookiesAcceptButton.style.color = 'black';
    cookiesAcceptButton.style.backgroundColor = 'white';
    cookiesAcceptButton.style.border = 'none';
    cookiesAcceptButton.style.padding = '5px 10px';
    cookiesAcceptButton.style.cursor = 'pointer';

    if (/Mobi|Android/i.test(navigator.userAgent)) {
        cookiesInfoText.style.fontSize = '50px';
        cookiesAcceptButton.style.height = '50px'
        cookiesAcceptButton.style.width = '100px';
    }

    cookiesAcceptButton.onclick = function() {
        localStorage.setItem('cookieConsent', 'true');
        cookiesBar.style.bottom = '-100px';

        setTimeout(function() {
            cookiesBar.style.display = 'none';
        }, 1000);
    };

    cookiesBar.appendChild(cookiesInfoText);
    cookiesBar.appendChild(cookiesAcceptButton);
    document.body.appendChild(cookiesBar);
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
        content.style.transformOrigin = '50% 0';
        var heightChange = rectBefore.height * (1 - value);

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

    resultDiv.onmouseover = () => {
        if (localStorage.getItem('darkMode') === 'true') {
            resultDiv.style.boxShadow = "0 0 20px cyan";
            if(iconWrapper) {
                iconWrapper.style.opacity = '1';
            }
        } else
            resultDiv.style.boxShadow = "0 0 20px cyan";
        if(iconWrapper){
            iconWrapper.style.opacity = '1';
        }
    };

    resultDiv.onmouseout = () => {
        if (localStorage.getItem('darkMode') === 'true') {
            resultDiv.style.boxShadow = "0 0 20px moccasin";
            if(iconWrapper) {
                iconWrapper.style.opacity = '0';
            }
        } else
            resultDiv.style.boxShadow = "0 0 20px darkgoldenrod";
            if(iconWrapper) {
                iconWrapper.style.opacity = '0';
            }
    }
}


function showSuccessNotification(message) {
    setTimeout(function() {
        let navbar = document.createElement('div');
        navbar.setAttribute('id', 'popupNavbar');
        navbar.style.top = '-120px';

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
    let rows = Math.ceil(images.length / 6);
    let imagesPerRow = Math.ceil(images.length / rows);

    // Stwórz kontener na wiersze
    let rowContainers = [];
    for (let i = 0; i < rows; i++) {
        let row = document.createElement('div');
        row.style.display = 'flex';
        row.style.flexWrap = 'wrap';
        row.style.justifyContent = 'center';
        row.style.alignItems = 'center';
        parentDiv.appendChild(row);
        rowContainers.push(row);
    }

    images.forEach((imageUrl, index) => {
        const figure = document.createElement('figure');
        figure.className = 'ph-image';
        figure.style.width = '220px';
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
        figure.style.minWidth = '250px';
        figure.style.height = '200px';
        figure.style.marginLeft = '10px';
        figure.appendChild(image);
        parrentDiv.appendChild(figure);

}

function createAdvertisementIndexDiv(mainContainer, advertisement) {


    const resultDiv = document.createElement("div");
    resultDiv.id = "advertisementResultDiv";
    resultDiv.style.width = "100%";
    resultDiv.style.maxWidth = "100%";
    resultDiv.style.boxSizing = "border-box";



    const imageDiv = document.createElement('div');

    imageDiv.style.position = 'relative';
    imageDiv.style.display = 'flex';
    imageDiv.style.alignItems = 'center';
    imageDiv.style.justifyContent = 'center';

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

    const previousArrow = document.createElement('span');
    previousArrow.setAttribute('id', 'previousArrow');
    previousArrow.textContent = '←';
    previousArrow.style.cursor = 'pointer';
    previousArrow.style.color = 'darkgoldenrod';
    previousArrow.style.boxSizing = "border-box";
    previousArrow.style.marginRight = '1%';
    previousArrow.style.fontSize = '6vw';
    previousArrow.addEventListener('click', () => previousPhoto(mainPhoto));
    previousArrow.style.userSelect = 'none';
    previousArrow.style.zIndex = '10';

    previousArrow.style.position = 'absolute';
    previousArrow.style.left = '0';
    previousArrow.style.top = '50%';
    previousArrow.style.transform = 'translateY(-50%)';

    const nextArrow = document.createElement('span');
    nextArrow.setAttribute('id', 'nextArrow');
    nextArrow.textContent = '→';
    nextArrow.style.cursor = 'pointer';
    nextArrow.style.color = 'darkgoldenrod';
    nextArrow.style.boxSizing = "border-box";
    nextArrow.style.marginLeft = '1%';
    nextArrow.style.fontSize = '6vw';
    nextArrow.addEventListener('click', () => nextPhoto(mainPhoto));
    nextArrow.style.userSelect = 'none';

    nextArrow.style.position = 'absolute';
    nextArrow.style.right = '0';
    nextArrow.style.top = '50%';
    nextArrow.style.transform = 'translateY(-50%)';

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
    advertisementDetailsHeader.style.width = '100%';
    advertisementDetailsHeader.style.display = 'flex';
    advertisementDetailsHeader.style.justifyContent = 'space-between';
    advertisementDetailsHeader.style.alignItems = 'center';
    advertisementDetailsHeader.style.boxSizing = "border-box";
    advertisementDetailsHeader.style.flexBasis = "auto";

    const nameElement = document.createElement("div");
    nameElement.textContent = advertisement.name;
    nameElement.style.color = "white";
    nameElement.style.fontSize = "24px";
    nameElement.style.textAlign = 'left';

    const dateElement = document.createElement("dateDiv");
    dateElement.textContent = 'Dodane ' + advertisement.creationDate;
    dateElement.style.color = "darkgoldenrod";
    dateElement.style.fontSize = "18px";
    dateElement.style.textAlign = 'right';
    dateElement.style.marginLeft = 'auto';
    dateElement.style.whiteSpace = 'nowrap';

    // mainContainer.appendChild(dateElement);
    // mainContainer.insertBefore(dateElement, titleDiv);

    advertisementDetailsHeader.appendChild(nameElement);
    // advertisementDetailsHeader.appendChild(dateElement);


    const advertisementDetailsDiv = document.createElement("advertisementDetailsDiv");
    advertisementDetailsDiv.style.width = '100%';
    advertisementDetailsDiv.style.flexBasis = 'auto';
    advertisementDetailsDiv.style.display = 'flex-start';
    advertisementDetailsDiv.style.flexDirection = 'column';


    const advertisementDetailsMain = document.createElement("advertisementDetailsMain");
    advertisementDetailsMain.style.width = '100%';
    advertisementDetailsMain.style.flexBasis = 'auto';
    advertisementDetailsMain.style.display = 'grid';
    advertisementDetailsMain.style.gridTemplateRows = 'auto 1fr auto';


    const advertisementDetailsOwner = document.createElement("advertisementDetailsCenter");
    advertisementDetailsOwner.style.width = '100%';
    advertisementDetailsOwner.style.flexBasis = 'auto';
    advertisementDetailsOwner.style.color = 'darkgoldenrod';
    advertisementDetailsOwner.innerHTML = "Wystawione przez → <strong style='font-size: 1.4em;'>" + advertisement.user + "</strong>";


    const advertisementDetails = document.createElement("advertisementDetailsBottom");
    advertisementDetails.style.width = '75%';
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
    paralaxMinatureDiv.style.justifyContent = 'center';
    paralaxMinatureDiv.style.alignItems = 'center';
    paralaxMinatureDiv.style.flexWrap = 'wrap';
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
        return null;
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
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';


        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                document.body.removeChild(overlay);
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
        dialogBox.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        dialogBox.style.borderRadius = '15px';
        dialogBox.style.boxShadow = '0 0 20px darkgoldenrod';
        dialogBox.style.flexDirection = 'column';
        dialogBox.style.alignItems = 'center';
        dialogBox.style.textAlign = 'center';
        dialogBox.style.display = 'flex';
        dialogBox.style.justifyContent = 'center';

        const headerTitle = document.createElement('dialogBox');
        headerTitle.style.width = "100%";
        headerTitle.setAttribute('id', 'dialogBoxTitle');
        headerTitle.textContent = message;
        headerTitle.style.color = 'darkgoldenrod';
        headerTitle.style.fontSize = '32px';
        headerTitle.style.fontWeight = 'bold';
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

    while (suggestionsList.firstChild) {
        suggestionsList.removeChild(suggestionsList.firstChild);
    }

    suggestions.forEach(suggestion => {
        const suggestionItem = document.createElement('li');
        suggestionItem.textContent = suggestion.cityName;
        suggestionItem.addEventListener('click', function () {
            cityInput.value = suggestion.name;
            cityStateInput.value = suggestion.cityStateName;
            cityStateInput.style.color = 'white';
            cityStateLabel.style.color = 'white';
            suggestionsList.innerHTML = '';
        });
        suggestionsList.appendChild(suggestionItem);
    });

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
    errorMessagesElement.innerHTML = '';
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
        e.stopPropagation();
    }

    if (dragSrcElement !== this) {
        const thumbnailsContainer = document.getElementById('thumbnails');
        const thumbnails = thumbnailsContainer.getElementsByClassName('thumbnail');

        const targetIndex = Array.from(thumbnails).indexOf(this);
        const sourceIndex = Array.from(thumbnails).indexOf(dragSrcElement);

        if(targetIndex<sourceIndex){
            thumbnailsContainer.insertBefore(this, thumbnails[sourceIndex]);
            thumbnailsContainer.insertBefore(dragSrcElement, thumbnails[targetIndex]);

            const filesCopy = selectedFiles.slice();
            const movedFileSource = filesCopy[sourceIndex];
            filesCopy[sourceIndex] = filesCopy[targetIndex];
            filesCopy[targetIndex] = movedFileSource;

            selectedFiles = filesCopy;

        }

        if(targetIndex > sourceIndex){
            thumbnailsContainer.insertBefore(dragSrcElement, thumbnails[targetIndex].nextSibling);
            thumbnailsContainer.insertBefore(this, dragSrcElement);

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

        trashIcon.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        });

        const deleteZone = document.createElement('div');
        deleteZone.id = 'deleteZone';
        deleteZone.style.position = 'absolute';
        deleteZone.style.top = '60px';
        deleteZone.appendChild(trashIcon);

        deleteZone.addEventListener('mouseover', function() {
            trashIcon.src = '/api/static/trashOpen';
        });
        deleteZone.addEventListener('mouseout', function() {
            trashIcon.src = '/api/static/trashClosed';
        });

        deleteZone.addEventListener('dragover', handleDeleteZoneDragOver);
        deleteZone.addEventListener('drop', handleDeleteZoneDrop);

        deleteZone.addEventListener('dragenter', function() {
            trashIcon.src = '/api/static/trashOpen';
        });
        deleteZone.addEventListener('dragleave', function() {
            trashIcon.src = '/api/static/trashClosed';
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



function fetchModels(brand) {
    return new Promise((resolve, reject) => {
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
                    resolve();
                })
                .catch(error => {
                    console.error('Błąd pobierania modeli:', error);
                    reject(error);
                });
        } else {
            modelSelect.innerHTML = '<option value="">Wybierz model</option>';
            resolve();
        }
    });
}

function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');
    snowflake.style.left = Math.random() * window.innerWidth + 'px';
    snowflake.style.animationDuration = Math.random() * 3 + 5 + 's';
    snowflake.style.opacity = Math.random();
    snowflake.style.fontSize = Math.random() * 20 + 10 + 'px';
    snowflake.style.zIndex = '-100';

    document.getElementById('snowflakeContainer').appendChild(snowflake);

    setTimeout(() => {
        snowflake.remove();
    }, 8000);
}

setInterval(createSnowflake, 300);


function createDescriptionEditor() {
    let horizontalContainer = document.getElementById('half-container-horizontal');
    horizontalContainer.style.marginBottom = '200px';
    horizontalContainer.style.padding = '20px';

    let editor = document.createElement('div');
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

    editor.style.width = '1200px';
    editor.style.maxWidth = '100%';
    editor.style.padding = '40px';
    editor.style.height = '700px';
    editor.style.backgroundColor = 'black';
    editor.style.borderRadius = '10px';
    editor.style.border = "1px solid rgba(255, 255, 255, 0.5)";
    editor.style.overflowY = 'auto';

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
    quill.format('color', '#fff');
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
    failGif.src = '/api/static/validationFail';
    failGif.id = 'failGif';
    failGif.style.height = '200px';
    failGif.style.width = '200px';
    submitButton.parentNode.insertBefore(failGif, submitButton);

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
                return false;
            }
        }

        if (element.type === 'select' && element.required) {
            const select = document.getElementById(element.id);
            if (select.selectedIndex === 0) {
                alert(`Pole ${element.label} jest wymagane.`);
                return false;
            }
        }
    }
    return true;
}

