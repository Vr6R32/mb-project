// window.addEventListener("load", getDeviceScreenInfo);
window.addEventListener('scroll', hideNavBar);
window.addEventListener("load", displayLogo);

function displayLogo() {
    const xhr = new XMLHttpRequest();
    const url = "/api/resources/logo";
    xhr.open("GET", url, true);
    xhr.responseType = "arraybuffer";
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            const image = new Image();
            const arrayBufferView = new Uint8Array(xhr.response);
            const blob = new Blob([arrayBufferView], { type: "image/png" });
            const imageUrl = URL.createObjectURL(blob);
            image.src = imageUrl;
            image.alt = "Logo";
            document.getElementById("logo").src = imageUrl;
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
        document.body.appendChild(navbar); // add the navbar to the body

        // Start animation after 0.5 seconds
        setTimeout(function() {
            navbar.style.top = '0'; // slides the navbar into view
        }, 500);

        // Auto hide navbar after another 7 seconds
        setTimeout(function() {
            navbar.style.top = '-120px'; // slides the navbar out of view
        }, 7000);
    });
}
function createAdvertisementIndexDiv(mainContainer, advertisement) {
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
        createAdvertisementIndexDetailsContainer('mileage', 'MileageIcon', advertisement.mileage),
        createAdvertisementIndexDetailsContainer('productionDate', 'ProductionDateIcon', advertisement.productionDate),
        createAdvertisementIndexDetailsContainer('fuelType', 'FuelTypeIcon', advertisement.fuelType),
        createAdvertisementIndexDetailsContainer('engineHorsePower', 'EngineIcon', advertisement.engineHorsePower + ' HP'),
        createAdvertisementIndexDetailsContainer('engineType/' + advertisement.engineType, 'transmissionIcon', advertisement.engineType),
        createAdvertisementIndexDetailsContainer('transmissionType/' + advertisement.transmissionType, 'transmissionIcon', advertisement.transmissionType)
    ];

    // if (advertisement.fuelType !== 'EV') {
    //     containers.push(
    //
    //     );
    // }

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
    descContainer.style.margin = '0 auto'; // Wyśrodkowanie w poziomie


    descContainer.style.backgroundColor = 'black';
    descContainer.appendChild(descriptionContainer);

    document.body.appendChild(descContainer);
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
    // Pobierz pole tekstowe i stwórz listę propozycji miast
    const cityInput = document.getElementById('city');
    const cityStateInput = document.getElementById('cityState');
    const suggestionsList = document.getElementById('suggestionsList'); // Zakładam, że masz element listy o id 'suggestionsList'

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
    // editor.style.marginBottom = '10px';
    // editor.style.marginLeft = '30px';
    // editor.style.marginRight = '30px';
    editor.style.height = '700px';
    editor.style.backgroundColor = 'black';
    editor.style.borderRadius = '10px';
    // input.style.border = '0px';
    // input.style.color = 'white';
    // input.style.textAlign = 'center';
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

function advertisementFormDataExtract() {
    quill.format(0, quill.getLength(), 'color', '#fff');
    descriptionContent = quill.container.firstChild.innerHTML;

    const formData = {
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
        mainPhotoUrl: getValue('name') + '-' + selectedFiles[0].name
    };
    return formData;
}

function createDropDeleteZone(){
    if(document.getElementById('deleteZone')===null){

        const trashIcon = document.createElement('img');
        trashIcon.src = `/api/resources/trashClosed`;
        trashIcon.alt = 'trashIcon';


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