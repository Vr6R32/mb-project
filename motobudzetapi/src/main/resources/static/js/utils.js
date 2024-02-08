
window.addEventListener('scroll', hideNavBar);


document.addEventListener('DOMContentLoaded', async () => {
    // document.body.style.fontFamily = '"Courier New", monospace';
    document.body.style.fontFamily = '"Arial", sans-serif';

    applySavedZoom();
    handleZoomSlider();
    applyDarkMode();

});


function formatInteger(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function createPriceHeader(ad) {
    const priceHeader = document.createElement("div");
    priceHeader.style.color = "darkgoldenrod";
    priceHeader.style.fontSize = "18px";
    priceHeader.style.position = 'relative';
    priceHeader.style.bottom = '-5px';
    priceHeader.style.textAlign = 'right';
    priceHeader.style.marginRight = '25px';
    priceHeader.style.whiteSpace = 'nowrap';

    const priceValueSpan = document.createElement('span');
    priceValueSpan.textContent = ad.priceUnit;
    priceValueSpan.style.color = 'darkgoldenrod';
    priceValueSpan.style.verticalAlign = "top";
    priceValueSpan.style.fontSize = "16px";


    const priceElement = document.createElement('div');
    priceElement.style.color = 'white';
    priceElement.style.fontSize = "26px";
    // priceElement.style.fontFamily = '"Arial", sans-serif'; // for a sans-serif font


    priceElement.textContent = formatInteger(ad.price) + ' ';
    priceElement.appendChild(priceValueSpan);


    priceHeader.appendChild(priceElement);
    return priceHeader;


}

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
function createEditBottomHeaderDiv() {
    const editBottomHeaderDiv = document.createElement("div");
    editBottomHeaderDiv.className = 'edit-bottom-header';
    return editBottomHeaderDiv;
}

function formatValue(value) {
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function addContainerSpans(ad, mileageUnitValue, horsePower, productionYear, engineCapacity, advertisementDetails) {
    const containers = [
        createInfoContainer('mileage', 'MileageIcon', formatInteger(ad.mileage)),
        createInfoContainer('engineHorsePower', 'EngineIcon', ad.engineHorsePower),
        createInfoContainer('productionDate', 'ProductionDateIcon', ad.productionDate),
        createInfoContainer('engineCapacity', 'CapacityIcon', formatInteger(ad.engineCapacity)),
        createInfoContainer('fuelType', 'FuelTypeIcon', ad.fuelType),
        createInfoContainer('engineType/' + ad.engineType, 'transmissionIcon', formatValue(ad.engineType)),
        createInfoContainer('transmissionType/' + ad.transmissionType, 'transmissionIcon', formatValue(ad.transmissionType)),
    ];

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
        container.style.width = maxTextWidth + '55px';
    });
}




function createEditWrapperDiv() {
    const editWrapper = document.createElement('div');
    editWrapper.id = 'editWrapper';
    editWrapper.style.display = 'flex';
    editWrapper.style.alignItems = 'center';
    return editWrapper;
}

function createFavouriteBottomDiv() {
    const favouriteBottomHeaderDiv = document.createElement("div");
    favouriteBottomHeaderDiv.className = 'favourite-bottom-header';
    return favouriteBottomHeaderDiv;
}

function createFavouriteTextSpan() {
    const favouriteText = document.createElement('span');
    favouriteText.id = 'favouriteText';
    favouriteText.style.border = '5px';
    favouriteText.style.color = 'white';
    favouriteText.style.position = 'relative';
    favouriteText.style.left = '-150px';
    favouriteText.style.opacity = '0';
    favouriteText.style.transition = 'left 0.5s, opacity 0.5s';
    return favouriteText;
}

function createEditTextSpan() {
    const editText = document.createElement('span');
    editText.id = 'editText';
    editText.style.border = '5px';
    editText.style.color = 'white';
    editText.style.position = 'relative';
    editText.style.left = '-150px';
    editText.style.opacity = '0';
    editText.style.transition = 'left 0.5s, opacity 0.5s';
    return editText;
}

function createEditIconDiv() {
    const editIconDiv = document.createElement('div');
    editIconDiv.style.color = 'white';
    editIconDiv.style.fontSize = "26px";
    editIconDiv.style.zIndex = '999';
    return editIconDiv;
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

    if(!isMobileDevice()) {


        (function () {

            const config = {
                rotation: 0.035,
                alpha: 0.2,
                shadow: 10
            };
            const imagesList = document.querySelectorAll('.ph-image');
            const imagesArray = Array.prototype.slice.call(imagesList);
            let imageWidth, imageHeight, imageShadow, imageLighting;

            if (imagesArray.length <= 0) {
                return;
            }
            /*
             * TODO: This could get seriously gnarly with too many images on screen
             * Would be better to defer these to a single listener on a wrapping element.
             */
            imagesArray.forEach(function (image) {
                image.addEventListener('mouseenter', handleMouseEnter);
                image.addEventListener('mousemove', handleMouseMove);
                image.addEventListener('mouseleave', handleMouseLeave);
            });

            function handleMouseEnter() {
                imageWidth = this.offsetWidth || this.clientWidth || this.scrollWidth;
                imageHeight = this.offsetHeight || this.clientHeight || this.scrollheight;

                imageShadow = this.querySelector('.ph-shadow');
                imageLighting = this.querySelector('.ph-lighting');
                this.style.transform = 'perspective(' + imageWidth * 3 + 'px)';
            }

            function handleMouseMove(e) {
                let centerX = imageWidth / 2;
                let centerY = imageHeight / 2;
                let deltaX = e.offsetX - centerX;
                let deltaY = e.offsetY - centerY;
                let rotateX = -deltaY / (config.rotation * 100);
                let rotateY = deltaX / (config.rotation * 100);
                this.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
            }

            function handleMouseLeave() {
                this.style.transform = '';
            }

        })();
    }
}

function applyDarkMode() {

    let darkModeCheckbox = document.getElementById('darkModeCheckbox');
    if (darkModeCheckbox) {
        darkModeCheckbox.addEventListener('change', function () {
            toggleDarkMode();
        });
    }

    if (localStorage.getItem('darkMode') === 'true') {
        let container = document.getElementById('container-main');
        container.style.backgroundColor = 'black';
        document.body.classList.add('dark-mode');
        darkModeCheckbox.checked = true;
    }
}



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
function changeBoxShadowColorToWhite() {
    const allElements = document.querySelectorAll('*');
    allElements.forEach(element => {
        if (element.style.color.includes('darkgoldenrod')) {
            element.style.color = element.style.boxShadow.replace('darkgoldenrod', 'white');
        }
    });
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

function funnyNeonTextPrice(subContainer, price) {

    let priceValue = formatInteger(price);
    let length = priceValue.length;
    let topValue;
    let maxHeight;
    let neon = document.createElement('div');

    let fontSize;
    if (length === 10) {
        fontSize = '62px'
        topValue = '-2px';
        maxHeight = '68px';
    } else if (length === 9) {
        fontSize = '70px'
        topValue = '0px';
    } else if (length === 7) {
        fontSize = '86px';
        topValue = '-3px';
    } else if (length === 6) {
        fontSize = '102px';
        topValue = '-15px';
        maxHeight = '83px';
    } else if (length === 5) {
        fontSize = '124px';
        topValue = '-23px';
        maxHeight = '83px';
        neon.style.transform = 'scale(0.78)';
        neon.style.transformOrigin = 'center';
    }


    neon.className = 'neon';
    neon.style.marginTop = '5px';
    neon.style.maxHeight = maxHeight
    let text = document.createElement('span');
    // text.setAttribute('data-text', priceValue + '€');
    text.setAttribute('data-text', priceValue);
    text.className = 'text';
    text.style.top = topValue;
    text.textContent = priceValue;
    // text.textContent = priceValue + '€';
    text.style.fontSize = fontSize;
    text.style.display = 'inline-block';
    text.style.overflow = 'hidden';
    text.style.textOverflow = 'ellipsis';

    let gradient = document.createElement('span');
    gradient.className = 'gradient';
    let spotlight = document.createElement('span');
    spotlight.className = 'spotlight';
    neon.appendChild(text);
    neon.appendChild(gradient);
    neon.appendChild(spotlight);
    subContainer.appendChild(neon);
    return neon;
}


function createParalaxMiniaturesGallery(images, parentDiv, mainPhoto) {
    let rows = Math.ceil(images.length / 6);
    let imagesPerRow = Math.ceil(images.length / rows);

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
        figure.style.overflow = 'hidden';
        figure.style.cursor = 'pointer';
        figure.style.userSelect = 'none';

        const img = document.createElement('img');
        img.src = '/api/static/photo/' + imageUrl;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        figure.appendChild(img);

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
function createParalaxMiniature(image,parrentDiv) {

        const figure = document.createElement('figure');
        figure.className = 'ph-image';
        figure.style.width = '350px';
        figure.style.minWidth = '250px';
        figure.style.height = '200px';
        figure.style.overflow = 'hidden';
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
        createInfoContainer('mileage', 'MileageIcon', advertisement.mileage),
        createInfoContainer('productionDate', 'ProductionDateIcon', advertisement.productionDate),
        createInfoContainer('fuelType', 'FuelTypeIcon', advertisement.fuelType),
        createInfoContainer('engineHorsePower', 'EngineIcon', advertisement.engineHorsePower + ' HP'),
        createInfoContainer('engineType/' + advertisement.engineType, 'transmissionIcon', advertisement.engineType),
        createInfoContainer('transmissionType/' + advertisement.transmissionType, 'transmissionIcon', advertisement.transmissionType)
    ];


    containers.push(createInfoContainer('price', 'PriceIcon', advertisement.price + ',-'));

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

function getUserName() {
    let userNameElement = document.getElementById('username');
    if (userNameElement) {
        return userNameElement.textContent;
    } else {
        return null;
    }
}


function handleCitySuggestionList(input, form) {
    input.style.position = 'relative';
    input.setAttribute('autocomplete', 'off');

    const inputContainer = document.createElement("div");
    inputContainer.style.position = "relative";
    inputContainer.setAttribute('autocomplete', 'off');

    const suggestionsList = document.createElement('ul');
    suggestionsList.id = 'suggestionsList';
    suggestionsList.className = 'suggestions-list';

    suggestionsList.addEventListener('click', function (event) {
        if (event.target && event.target.nodeName === 'LI') {
            input.value = event.target.textContent;
            suggestionsList.style.display = 'none';
        }
    });

    inputContainer.appendChild(input);
    inputContainer.appendChild(suggestionsList);
    if(form) {
        form.appendChild(inputContainer);

    }

    let timeoutId;
    const debounceDelay = 200;

    input.addEventListener("input", function () {
        clearTimeout(timeoutId);

        const partialCityName = input.value;

        timeoutId = setTimeout(function () {
            fetch(`/api/cities?partialName=${partialCityName}`)
                .then(response => response.json())
                .then(data => {
                    updateCitySuggestions(data);
                })
                .catch(error => {
                    console.error("Błąd podczas pobierania propozycji miast:", error);
                });
        }, debounceDelay);
    });

    return suggestionsList;
}





function createSiteOverlay() {
    const overlay = document.createElement('div');
    overlay.setAttribute('id', 'overlayId');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    return overlay;
}


function createAdvertisementDetailsDiv() {
    const advertisementDetailsDiv = document.createElement("div");
    advertisementDetailsDiv.className = "advertisementDetailsDiv";
    return advertisementDetailsDiv;
}

function createAdvertisementDetailsMain() {
    const advertisementDetailsMain = document.createElement("div");
    advertisementDetailsMain.className = "advertisementDetailsMain";
    return advertisementDetailsMain;
}

function createAdvertisementDetails() {
    const advertisementDetails = document.createElement("div");
    advertisementDetails.className = "advertisementDetails";
    return advertisementDetails;
}

function createMileageUnitSpan() {
    let mileageUnitValue = document.createElement('span');
    mileageUnitValue.style.color = 'darkgoldenrod';
    return mileageUnitValue;
}

function createModelBrandDiv(ad) {
    const modelBrandElement = document.createElement("div");
    modelBrandElement.textContent = ad.brand.name + ' ' + ad.model.name;
    modelBrandElement.style.color = "darkgoldenrod";
    modelBrandElement.style.fontSize = "16px";
    modelBrandElement.style.textAlign = 'left';
    return modelBrandElement;
}


function createAdvertisementDetailsHeaderDiv() {
    const advertisementDetailsHeader = document.createElement("div");
    advertisementDetailsHeader.className = "advertisementDetailsHeader";
    return advertisementDetailsHeader;
}

function createHorsePowerSpan() {
    let horsePower = document.createElement('span');
    horsePower.style.color = 'darkgoldenrod';
    horsePower.textContent = 'HP';
    return horsePower;
}

function createProductionYearSpan() {
    let productionYear = document.createElement('span');
    productionYear.style.color = 'darkgoldenrod';
    productionYear.textContent = 'ROK';
    return productionYear;
}

function createPhotoFadeEffect(photoElement, resultDiv) {
    const fadeEffect = document.createElement('div');
    fadeEffect.classList.add('fade-effect-miniature-search');
    fadeEffect.appendChild(photoElement);
    resultDiv.appendChild(fadeEffect);
}

function createEngineCapacitySpan() {
    let engineCapacity = document.createElement('span');
    engineCapacity.style.color = 'darkgoldenrod';
    engineCapacity.textContent = 'CM';
    applySmallerDigitSpan(engineCapacity);
    return engineCapacity;
}

function applySmallerDigitSpan(engineCapacity) {
    let smallerDigit = document.createElement('span');
    smallerDigit.textContent = '3';
    smallerDigit.style.fontSize = '10px';
    smallerDigit.style.verticalAlign = 'top';
    engineCapacity.appendChild(smallerDigit);
}

function createBottomDetailsHeaderDiv() {
    const bottomDetailsHeader = document.createElement("div");
    bottomDetailsHeader.className = "bottomDetailsHeader";
    return bottomDetailsHeader;
}

function createOverlayDialogBox() {
    const dialogBox = document.createElement('div');
    dialogBox.setAttribute('id', 'dialogBox')
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
    return dialogBox;
}

function createDialogBox(message){
    if(!document.getElementById('overlayId')){

        const overlay = createSiteOverlay();
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                document.body.removeChild(overlay);
            }
        });

        const dialogBox = createOverlayDialogBox();

        const headerTitle = document.createElement('dialogBox');
        headerTitle.setAttribute('id', 'dialogBoxTitle');
        headerTitle.textContent = message;
        headerTitle.style.width = "100%";
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
        suggestionItem.textContent = suggestion.name;
        suggestionItem.setAttribute('data-city-id', suggestion.id);
        suggestionItem.addEventListener('click', function () {
            cityInput.value = suggestion.name;
            cityInput.setAttribute('data-selected-city-id', suggestion.id);
            cityStateInput.value = suggestion.cityState.name;

            cityStateInput.setAttribute('data-selected-city-state-id', suggestion.cityState.id);
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
                option.dataset.id = brand.id;
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
function handleError(response) {
    if (response instanceof Response) {
        response.json().then(body => {
            if (body.errors && Array.isArray(body.errors)) {
                alert("Server error: " + body.errors.join('\n'));
            } else {
                alert("Server error: An unexpected error occurred.");
            }
        }).catch(() => {
            alert("Server error: The server response could not be parsed as JSON.");
        });
    }
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

    const modelSelect = document.getElementById('model');
    const selectedModelOption = modelSelect.options[modelSelect.selectedIndex];
    const modelId = selectedModelOption.dataset.id;

    const brandSelect = document.getElementById('brand');
    const selectedBrandOption = brandSelect.options[brandSelect.selectedIndex];
    const brandId = selectedBrandOption.dataset.id;

    // const citySelect = document.getElementById('data-selected-city-id');
    // const selectedCityOption = citySelect.options[citySelect.selectedIndex];
    // const cityId = selectedCityOption.dataset.id;

    const cityStateSelect = document.getElementById('cityState');
    const selectedCityStateOption = cityStateSelect.options[cityStateSelect.selectedIndex];
    const cityStateId = selectedCityStateOption.dataset.id;

    console.log(cityStateId);



    formData.append('name', getValue('name'));
    formData.append('brand', getValue('brand'));
    formData.append('brandId', brandId);
    formData.append('model', getValue('model'));
    formData.append('modelId', modelId);
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
    formData.append('mainPhotoUrl', getValue('name') + '-' + selectedFiles[0].name)
    formData.append('cityState', getValue('cityState'));
    formData.append('vinNumber', getValue('vinNumber'));
    formData.append('accidentFree', getValue('accidentFree'));
    // formData.append('cityStateId', cityStateId);

    const descriptionContent = quill.container.firstChild.innerHTML;
    formData.append('description', descriptionContent);

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
                        option.dataset.id = model.id;
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

function createInfoContainer(iconPath, altText, value) {
    const advertisementInfoIconContainer = document.createElement('div');
    advertisementInfoIconContainer.className = 'advertisementInfoIconContainer';

    const icon = document.createElement('img');
    icon.src = `/api/static/${iconPath}`;
    icon.alt = altText;
    icon.style.marginBottom = '2px';

    const valueElement = document.createElement('span');
    valueElement.textContent = value;

    advertisementInfoIconContainer.appendChild(icon);
    advertisementInfoIconContainer.appendChild(valueElement);

    return advertisementInfoIconContainer;
}
function createDescriptionEditor() {
    let horizontalContainer = document.getElementById('half-container-horizontal');
    horizontalContainer.style.marginBottom = '200px';
    horizontalContainer.style.padding = '20px';

    let descriptionDivLabel = document.createElement('div');
    descriptionDivLabel.textContent = 'Opis Ogłoszenia:';
    descriptionDivLabel.className = 'descriptionDivLabel';


    let quillEditorContainer = document.createElement('div');
    quillEditorContainer.id = "editor";

    quillEditorContainer.style.scrollbarWidth = 'thin';
    quillEditorContainer.style.scrollbarColor = 'darkgoldenrod transparent';
    quillEditorContainer.style.WebkitScrollbar = 'thin';
    quillEditorContainer.style.WebkitScrollbarTrack = 'transparent';
    quillEditorContainer.style.WebkitScrollbarThumb = 'darkgoldenrod';
    quillEditorContainer.style.WebkitScrollbarThumbHover = 'goldenrod';

    quillEditorContainer.style.width = '1200px';
    quillEditorContainer.style.maxWidth = '100%';
    quillEditorContainer.style.padding = '40px';
    quillEditorContainer.style.height = '700px';
    quillEditorContainer.style.backgroundColor = 'black';
    quillEditorContainer.style.borderRadius = '10px';
    quillEditorContainer.style.border = "1px solid rgba(255, 255, 255, 0.5)";
    quillEditorContainer.style.overflowY = 'auto';

    horizontalContainer.appendChild(descriptionDivLabel);
    horizontalContainer.appendChild(quillEditorContainer);
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
function handleLoginResponse(errorOccurred) {
    if (errorOccurred) {
        clearForm();
        createDialogBox('Nieprawidłowe dane logowania.');
    } else {
        window.location = getRedirectLink();
    }
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

