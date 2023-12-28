// window.addEventListener("load", getDeviceScreenInfo);
document.addEventListener("DOMContentLoaded", preloadLogo);
document.addEventListener("DOMContentLoaded", applySavedZoom);
window.addEventListener('scroll', hideNavBar);
document.addEventListener('DOMContentLoaded', (event) => {
    const slider = document.getElementById('zoom-slider');
    const defaultVal = 1; // ustaw wartość domyślną bezpośrednio

    slider.oninput = (e) => {
        const val = e.target.valueAsNumber;

        // Jeśli wartość suwaka jest bliska domyślnej wartości, przesuń go na tę wartość
        if (Math.abs(val - defaultVal) < 0.02) { // 0.02 to zakres 'snap', dostosuj wg potrzeb
            slider.value = defaultVal;
            changeZoom(defaultVal); // Wywołaj funkcję zmiany skali
        } else {
            changeZoom(val); // Kontynuuj normalną zmianę skali
        }
    };
});

// function resetZoom() {
//     var slider = document.getElementById('zoom-slider');
//     slider.value = 1; // wartość domyślna dla suwaka
//     changeZoom(slider.value);
// }

function preloadLogo() {
    const xhr = new XMLHttpRequest();
    const url = "/api/resources/logo";
    xhr.open("GET", url, true);
    xhr.responseType = "arraybuffer";
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            const arrayBufferView = new Uint8Array(xhr.response);
            const blob = new Blob([arrayBufferView], { type: "image/png" });
            const imageUrl = URL.createObjectURL(blob);
            const logoImageElement = document.getElementById("logo");
            if (logoImageElement) {
                logoImageElement.src = imageUrl;
                logoImageElement.alt = "Logo";
            }
        }
    };
    xhr.send();
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

// window.addEventListener('load', applyDarkModeSetting);
//
// function toggleDarkMode() {
//     // If the 'dark-mode' class is present, then dark mode is currently enabled
//     let isDarkMode = document.body.classList.contains('dark-mode');
//     // Toggle dark mode off if it's on, or on if it's off
//     document.body.classList.toggle('dark-mode');
//     // Save the updated state in localStorage
//     localStorage.setItem('darkMode', !isDarkMode);
// }
//
// function applyDarkModeSetting() {
//     var darkModeSetting = localStorage.getItem('darkMode');
//     // Compare the setting as a string, since localStorage stores strings
//     if (darkModeSetting === 'true') {
//         document.body.classList.add('dark-mode');
//     } else {
//         document.body.classList.remove('dark-mode');
//     }
function paralaxHover() {
    /*
   * Paralax Hover
   */
    (function() {

        // TODO: Make these names suck less.
        var config = {
            rotation: 0.05, // Rotation modifier, larger number = less rotation
            alpha: 0.2, // Alpha channel modifer
            shadow: 5 // How much the shadow moves
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

        function handleMouseEnter(e) {
            imageWidth = this.offsetWidth || this.clientWidth || this.scrollWidth;
            imageHeight = this.offsetHeight || this.clientHeight || this.scrollheight;

            // TODO: Give these a unique ID for better selection later
            imageShadow = this.querySelector('.ph-shadow');
            imageLighting = this.querySelector('.ph-lighting');

            this.style.transform = 'perspective(' + imageWidth * 3 + 'px)';
        }

        function handleMouseMove(e) {
            var bounds = e.target.getBoundingClientRect();
            var centerX = imageWidth / 2;
            var centerY = imageHeight / 2;
            var deltaX = e.offsetX - centerX;
            var deltaY = e.offsetY - centerY;

            // Invert the sign for rotateX to correct the vertical inversion
            var rotateX = -deltaY / (config.rotation * 100); // Inverted rotation around X-axis for vertical movement
            var rotateY = deltaX / (config.rotation * 100); // Rotation around Y-axis for horizontal movement

            var angleRad = Math.atan2(deltaY, deltaX);
            var angleDeg = angleRad * 180 / Math.PI - 90;

            var movement = e.offsetY / bounds.top;
            var lightAlpha = movement * config.alpha;
            var shadowMovement = movement * 5;

            if (angleDeg <= 0) {
                angleDeg = angleDeg + 360;
            }

            this.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
            // imageLighting.style.background = 'linear-gradient(' + angleDeg + 'deg, rgba(255,255,255, ' + lightAlpha + ') 0%, rgba(255,255,255,0) 60%)';
            // imageShadow.style.transform = 'translateX(' + shadowMovement + 'px) translateY(' + shadowMovement + 'px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
        }

        function handleMouseLeave(e) {
            this.style.transform = '';
            imageLighting.style.background = '';
            imageLighting.style.transform = '';
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




function showSuccessNotification(message) {
    setTimeout(function() {
        let navbar = document.createElement('div');
        navbar.setAttribute('id', 'popupNavbar');
        navbar.style.top = '-120px';  // Set the initial position

        let text = document.createElement('p');
        text.style.color = 'white';
        text.textContent = message;

        const successIcon = document.createElement('img');
        successIcon.src = '/api/resources/successIcon';
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


function createParalaxMiniatures(images,paralaxMinatureDiv) {

    images.forEach(imageUrl => {
        const figure = document.createElement('figure');
        figure.className = 'ph-image';
        figure.style.width = '230px';
        figure.style.height = '180px';
        figure.style.marginRight = '20px';

        const img = document.createElement('img');
        img.src = '/api/resources/advertisementPhoto/' + imageUrl;



        figure.appendChild(img);
        paralaxMinatureDiv.appendChild(figure);

        paralaxHover();
    });
}

function createAdvertisementIndexDiv(mainContainer, advertisement) {



    const resultDiv = document.createElement("advertisementResultDiv");
    resultDiv.id = "advertisementResultDiv";
    resultDiv.style.Width = "100%";

    const imageDiv = document.createElement('mainImageDiv');
    imageDiv.style.width = '100%';
    imageDiv.style.maxWidth = '100%';
    imageDiv.style.minHeight = '675px';
    imageDiv.style.justifyContent = 'space-between';
    imageDiv.style.display = 'flex';
    imageDiv.style.alignItems = 'center';
    imageDiv.style.marginTop = '15px';
    imageDiv.style.marginBottom = '15px';


    const mainPhoto = document.createElement('img');
    mainPhoto.className = 'abc';
    mainPhoto.src = '/api/resources/advertisementPhoto/' + advertisement.urlList[0];
    mainPhoto.style.maxHeight = '675px';
    mainPhoto.alt = 'MainUrlPhoto';
    mainPhoto.id = 'mainUrlPhoto';
    mainPhoto.style.backgroundColor = 'transparent';
    mainPhoto.style.borderRadius = '20px';



    const previousArrow = document.createElement('span');
    previousArrow.setAttribute('id', 'previousArrow');
    previousArrow.textContent = '←';
    previousArrow.style.cursor = 'pointer';
    previousArrow.style.fontSize = '72px';
    previousArrow.style.color = 'darkgoldenrod';
    previousArrow.addEventListener('click', () => previousPhoto(mainPhoto));

    const nextArrow = document.createElement('span');
    nextArrow.setAttribute('id', 'nextArrow');
    nextArrow.textContent = '→';
    nextArrow.style.cursor = 'pointer';
    nextArrow.style.fontSize = '72px';
    nextArrow.style.color = 'darkgoldenrod';
    nextArrow.addEventListener('click', () => nextPhoto(mainPhoto));

    const fadeEffect = document.createElement('div');
    fadeEffect.classList.add('fade-effect-big');
    fadeEffect.style.backgroundColor = 'transparent';


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
        // container.style.maxWidth = "100%";
        // container.style.boxSizing = "border-box";
        // container.style.flexBasis = "auto";
        advertisementDetails.appendChild(container);
    });

    advertisementDetailsDiv.appendChild(advertisementDetailsMain);

    advertisementDetailsMain.appendChild(advertisementDetailsHeader);
    advertisementDetailsMain.appendChild(advertisementDetailsOwner);
    advertisementDetailsMain.appendChild(advertisementDetails);

    let paralaxMinatureDiv = document.createElement('div');
    paralaxMinatureDiv.style.display = 'flex';
    paralaxMinatureDiv.style.marginTop = '20px';
    paralaxMinatureDiv.style.marginBottom = '20px';


    resultDiv.appendChild(paralaxMinatureDiv);
    resultDiv.appendChild(advertisementDetailsDiv);

    mainContainer.appendChild(resultDiv);


    let descriptionContainer = document.createElement('div');
    let descriptionElement = document.createElement('div');
    descriptionElement.innerHTML = advertisement.description;
    descriptionContainer.appendChild(descriptionElement);

    let descContainer = document.createElement('div');
    descContainer.className = "ql-editor";
    descContainer.style.width = '1460px';
    descContainer.style.maxWidth = '100%';
    descContainer.style.borderRadius = '20px';
    descContainer.style.margin = '0 auto';
    descContainer.style.marginTop = '30px';


    descContainer.style.backgroundColor = 'transparent';
    descContainer.appendChild(descriptionContainer);

    resultDiv.appendChild(descContainer);

    createParalaxMiniatures(advertisement.urlList,paralaxMinatureDiv);

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
    icon.src = `/api/resources/${iconPath}`;
    icon.alt = altText;
    icon.style.marginBottom = '2px';

    const valueElement = document.createElement('span');
    valueElement.textContent = value;

    container.appendChild(icon);
    container.appendChild(valueElement);

    return container;
}
function getUserName(){
    let userName = document.getElementById('username');
    return userName.textContent;
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
function createDescriptionEditor() {
    let horizontalContainer = document.getElementById('half-container-horizontal');
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
        [{ 'color': ['white','blue','yellow','red','pink','green',] }, { 'background': [] }],
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

    quill.format('color', '#fff'); // Ustawienie domyślnego koloru tekstu na biały
    quill.format(0, quill.getLength(), 'color', '#fff');


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

    if (!response.ok) {
        if (response.status === 400) {
            return response.text().then(errorMessage => {
                throw new Error(errorMessage);
            });
        } else {
            throw new Error('Wystąpił błąd podczas przetwarzania formularza.');
        }
    }
    return response.headers.get('advertisementId');
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

function advertisementFormDataExtract(isEditMode) {
    quill.format(0, quill.getLength(), 'color', '#fff');
    descriptionContent = quill.container.firstChild.innerHTML;

    let mainPhotoUrl;
    if (!isEditMode && selectedFiles && selectedFiles.length > 0) {
        mainPhotoUrl = getValue('name') + '-' + selectedFiles[0].name;
    } else {
        let nameValue = getValue('name');
        if (selectedFiles[0].name.indexOf(nameValue) === -1) {
            mainPhotoUrl = nameValue + '-' + selectedFiles[0].name;
        } else {
            mainPhotoUrl = selectedFiles[0].name;
        }
    }


    return {
        name: getValue('name'),
        description: descriptionContent,
        brand: getValue('brand'),
        model: getValue('model'),
        fuelType: getValue('fuelType'),
        driveType: getValue('driveType'),
        engineType: getValue('engineType'),
        transmissionType: getValue('transmissionType'),
        mileage: getValue('mileage'),
        mileageUnit: getValue('mileageUnit'),
        price: getValue('price'),
        priceUnit: getValue('priceUnit'),
        engineCapacity: getValue('engineCapacity'),
        engineHorsePower: getValue('engineHorsePower'),
        productionDate: getValue('productionDate'),
        firstRegistrationDate: getValue('firstRegistrationDate'),
        city: getValue('city'),
        cityState: getValue('cityState'),
        mainPhotoUrl: mainPhotoUrl
    };
}

function createDropDeleteZone(){
    if(document.getElementById('deleteZone')===null){

        const trashIcon = document.createElement('img');
        trashIcon.src = `/api/resources/trashClosed`;
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
            trashIcon.src = '/api/resources/trashOpen'; // Switch to open trash icon
        });
        deleteZone.addEventListener('mouseout', function() {
            trashIcon.src = '/api/resources/trashClosed'; // Switch back to closed trash icon
        });

        deleteZone.addEventListener('dragover', handleDeleteZoneDragOver);
        deleteZone.addEventListener('drop', handleDeleteZoneDrop);

        deleteZone.addEventListener('dragenter', function() {
            trashIcon.src = '/api/resources/trashOpen'; // Switch to open trash icon
        });
        deleteZone.addEventListener('dragleave', function() {
            trashIcon.src = '/api/resources/trashClosed'; // Switch back to closed trash icon
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