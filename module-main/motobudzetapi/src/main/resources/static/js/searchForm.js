let formData = new FormData();
let sortOrder = "asc"; // Set the default sort order to "asc" (ascending) or "desc" (descending) as you prefer
let sortingBy = "price"; // Set the default sort by parameter to "price" (or any other default value you prefer)
let urlSearchParams = null;

document.addEventListener("DOMContentLoaded", function () {
    let mainContainer = document.getElementById('container-main');
    createSearchFormContainer(mainContainer);
    fetchAllSpecifications();
    getParametersFromCurrentUrl();
    // const brandSelect = document.getElementById("brand");
    // brandSelect.value = '1';

});





function getParametersFromCurrentUrl() {
    // Pobieramy aktualny URL z okna przeglądarki
    const currentUrl = window.location.href;

    // Sprawdzamy, czy istnieją znaki '?' w URL
    const indexOfQuestionMark = currentUrl.indexOf('?');

    if (indexOfQuestionMark !== -1) {
        // Jeśli znaleziono znak '?', pobieramy tylko fragment URL po '?'
        const queryString = currentUrl.substring(indexOfQuestionMark + 1);

        // Tworzymy obiekt URLSearchParams z parametrami URL
        urlSearchParams = new URLSearchParams(queryString);

        // Sprawdzamy, czy istnieją jakieś parametry w URL
        if (urlSearchParams.toString() !== "") {
            console.log("Parametry istnieją w URL:", urlSearchParams.toString());
            // Tworzymy nowy obiekt FormData
            // Przechodzimy przez każdy parametr w URLSearchParams i dodajemy go do formData
            urlSearchParams.forEach((value, key) => {
                formData.set(key, value);
            });

            executeSearch(formData);
            setFormValuesFromUrlParams(urlSearchParams);

        }
    }
}
function setFormValuesFromUrlParams(urlSearchParams) {

    if (urlSearchParams.has("sortBy")) {
        sortingBy = urlSearchParams.get("sortBy");
    }
    if (urlSearchParams.has("sortOrder")) {
        sortOrder = urlSearchParams.get("sortOrder");
    }
    if (urlSearchParams.has("priceMin")) {
        let priceMin = document.getElementById("priceMin");
        priceMin.value = urlSearchParams.get("priceMin");
    }
    if (urlSearchParams.has("priceMax")) {
        let priceMax = document.getElementById("priceMax");
        priceMax.value = urlSearchParams.get("priceMax");
    }
    if (urlSearchParams.has("mileageFrom")) {
        let mileageFrom = document.getElementById("mileageFrom");
        mileageFrom.value = urlSearchParams.get("mileageFrom");
    }
    if (urlSearchParams.has("mileageTo")) {
        let mileageTo = document.getElementById("mileageTo");
        mileageTo.value = urlSearchParams.get("mileageTo");
    }
    if (urlSearchParams.has("engineCapacityFrom")) {
        let engineCapacityFrom = document.getElementById("engineCapacityFrom");
        engineCapacityFrom.value = urlSearchParams.get("engineCapacityFrom");
    }
    if (urlSearchParams.has("engineCapacityTo")) {
        let engineCapacityTo = document.getElementById("engineCapacityTo");
        engineCapacityTo.value = urlSearchParams.get("engineCapacityTo");
    }
    if (urlSearchParams.has("engineHorsePowerFrom")) {
        let engineHorsePowerFrom = document.getElementById("engineHorsePowerFrom");
        engineHorsePowerFrom.value = urlSearchParams.get("engineHorsePowerFrom");
    }
    if (urlSearchParams.has("engineHorsePowerTo")) {
        let engineHorsePowerTo = document.getElementById("engineHorsePowerTo");
        engineHorsePowerTo.value = urlSearchParams.get("engineHorsePowerTo");
    }
    if (urlSearchParams.has("productionDateFrom")) {
        let productionDateFrom = document.getElementById("productionDateFrom");
        productionDateFrom.value = urlSearchParams.get("productionDateFrom");
    }
    if (urlSearchParams.has("productionDateTo")) {
        let productionDateTo = document.getElementById("productionDateTo");
        productionDateTo.value = urlSearchParams.get("productionDateTo");
    }
}

setTimeout(function setInputSelect() {
    if(urlSearchParams){
        let formObj = document.getElementById('advertisementFilterForm');
        let brand = formObj.querySelector('#brand');
        let driveType = formObj.querySelector('#driveType');
        let engineType = formObj.querySelector('#engineType');
        let fuelType = formObj.querySelector('#fuelType');
        let transmissionType = formObj.querySelector('#transmissionType');
        brand.value = urlSearchParams.get("brand");
        driveType.value = urlSearchParams.get("driveType");
        engineType.value = urlSearchParams.get("engineType");
        fuelType.value = urlSearchParams.get("fuelType");
        transmissionType.value = urlSearchParams.get("transmissionType");
    }
}, 200);

setTimeout(function setModelSelect() {
    if (urlSearchParams) {
        fetch(`/api/models/${urlSearchParams.get("brand")}`)
            .then(response => response.json())
            .then(data => {
                populateSelectOptions(data, "model");
                let formObj = document.getElementById('advertisementFilterForm');
                let model = formObj.querySelector('#model');
                model.value = urlSearchParams.get("model");
            });
    }
}, 300); // Drugi setTimeout z opóźnieniem 1000 ms (1 sekunda)


function fetchAllSpecifications() {
    fetch("/api/spec/driveTypes")
        .then(response => response.json())
        .then(data => populateSelectOptions(data, "driveType"));

    fetch("/api/spec/engineTypes")
        .then(response => response.json())
        .then(data => populateSelectOptions(data, "engineType"));

    fetch("/api/spec/fuelTypes")
        .then(response => response.json())
        .then(data => populateSelectOptions(data, "fuelType"));

    fetch("/api/spec/transmissionTypes")
        .then(response => response.json())
        .then(data => populateSelectOptions(data, "transmissionType"));

    fetch("/api/brands")
        .then(response => response.json())
        .then(data => {
            // Populate brand options
            populateSelectOptions(data, "brand");
            // Add event listener to the brand select element after populating the options
            const brandSelect = document.getElementById("brand");
            const modelSelect = document.getElementById("model");

            brandSelect.addEventListener("change", function (event) {
                const selectedBrand = event.target.value;

                // Check if a brand is selected before making the model fetch
                if (selectedBrand !== "") {
                    fetch(`/api/models/${selectedBrand}`)
                        .then(response => response.json())
                        .then(data => {
                            // Clear existing model options
                            modelSelect.innerHTML = "";
                            // Populate new model options
                            populateSelectOptions(data, "model");
                        });
                } else {
                    // If no brand is selected, clear model options
                    modelSelect.innerHTML = `<option value=""> </option>`;
                }
            });

            // Trigger the change event to populate models initially with the default brand (empty value)
            const changeEvent = new Event("change");
            brandSelect.dispatchEvent(changeEvent);
        });
}


async function createSearchFormContainer(mainContainer) {
    const formContainer = document.createElement("div");
    formContainer.setAttribute('id', 'searchFormContainer');
    mainContainer.insertBefore(formContainer, mainContainer.firstChild);
    createSearchForm(formContainer);
}

function createSearchForm(formContainer) {
    const form = document.createElement("form");
    form.setAttribute('id', 'advertisementFilterForm');
    form.style.display = "flex";
    form.style.color = 'white';
    form.style.flexWrap = "wrap";
    form.style.justifyContent = "center";
    form.style.boxSizing = "border-box";
    form.style.maxWidth = "100%";



// Tworzymy pola formularza - najpierw pola typu select, a następnie pola typu input
    const driveTypesOptions = []; // Pobierz dane opcji dla elementu typu select (np. za pomocą fetch)
    const engineTypesOptions = []; // Pobierz dane opcji dla elementu typu select (np. za pomocą fetch)
    const fuelTypesOptions = []; // Pobierz dane opcji dla elementu typu select (np. za pomocą fetch)
    const transmissionTypesOptions = []; // Pobierz dane opcji dla elementu typu select (np. za pomocą fetch)
    const brandsOptions = []; // Pobierz dane opcji dla elementu typu select (np. za pomocą fetch)

    form.appendChild(createRowWithInputElement("Marka:", "select", "brand", "brand", brandsOptions));
    form.appendChild(createRowWithInputElement("Model:", "select", "model", "model"));
    form.appendChild(createRowWithInputElement("Rodzaj Silnika:", "select", "engineType", "engineType", engineTypesOptions));
    form.appendChild(createRowWithInputElement("Rodzaj Paliwa:", "select", "fuelType", "fuelType", fuelTypesOptions));
    form.appendChild(createRowWithInputElement("Rodzaj Napędu:", "select", "driveType", "driveType", driveTypesOptions));
    form.appendChild(createRowWithInputElement("Skrzynia Biegów:", "select", "transmissionType", "transmissionType", transmissionTypesOptions));
    form.appendChild(createRowWithInputElement("Cena od:", "number", "priceMin", "priceMin"));
    form.appendChild(createRowWithInputElement("Cena do:", "number", "priceMax", "priceMax"));
    form.appendChild(createRowWithInputElement("Przebieg od:", "number", "mileageFrom", "mileageFrom"));
    form.appendChild(createRowWithInputElement("Przebieg do:", "number", "mileageTo", "mileageTo"));
    form.appendChild(createRowWithInputElement("Pojemność od:", "number", "engineCapacityFrom", "engineCapacityFrom"));
    form.appendChild(createRowWithInputElement("Pojemność do:", "number", "engineCapacityTo", "engineCapacityTo"));
    form.appendChild(createRowWithInputElement("Moc od:", "number", "engineHorsePowerFrom", "engineHorsePowerFrom"));
    form.appendChild(createRowWithInputElement("Moc do:", "number", "engineHorsePowerTo", "engineHorsePowerTo"));
    form.appendChild(createRowWithInputElement("Rok Produkcji od:", "number", "productionDateFrom", "productionDateFrom"));
    form.appendChild(createRowWithInputElement("Rok Produkcji do:", "number", "productionDateTo", "productionDateTo"));

    // function setStyleForElements(elements, styleName, styleValue) {
    //     for (let i = 0; i < elements.length; i++) {
    //         elements[i].style[styleName] = styleValue;
    //     }
    // }
    //
    // const formElements = form.querySelectorAll("select, input");
    // setStyleForElements(formElements, "background", "black")
    // setStyleForElements(formElements, "color", "white");

    const searchButton = document.createElement("button");
    searchButton.type = "submit";
    searchButton.textContent = "Szukaj";
    searchButton.style.backgroundColor = "darkgoldenrod";
    searchButton.style.border = "none";
    searchButton.style.color = "black";
    searchButton.style.padding = "10px 20px";
    searchButton.style.borderRadius = "5px";
    searchButton.style.boxShadow = "0 0 20px darkgoldenrod";
    searchButton.style.transition = "background-position 0.3s ease-in-out";

    searchButton.addEventListener("mouseover", function () {
        searchButton.style.boxShadow = '0 0 20px moccasin';
        searchButton.style.color = "white";
    });

// Przywrócenie efektu fade po opuszczeniu przycisku
    searchButton.addEventListener("mouseout", function () {
        searchButton.style.boxShadow = '0 0 20px darkgoldenrod';
        searchButton.style.color = "black";
    });

    searchButton.style.flexBasis = "15%"; // Przycisk na 100% szerokości czterech kolumn
    form.appendChild(searchButton);


    formContainer.appendChild(form);

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        // Get the form data
        formData = new FormData(event.target);

        executeSearch(formData);

    });

}

function createRowWithInputElement(labelText, inputType, inputId, inputName, selectOptions = null) {
    const rowDiv = document.createElement("div");
    rowDiv.style.flexBasis = "25%"; // Cztery kolumny - 25% szerokości wiersza
    rowDiv.style.display = "flex";
    rowDiv.style.alignItems = "center";
    rowDiv.style.marginBottom = "10px";
    rowDiv.style.maxWidth = "100%";

    const labelColumn = document.createElement("div");
    labelColumn.style.flexBasis = "40%"; // Trzy kolumny - 30% szerokości wiersza
    labelColumn.style.display = "flex";
    labelColumn.style.alignItems = "center";
    labelColumn.style.marginRight = "10px";
    labelColumn.style.maxWidth = "100%";

    const label = document.createElement("label");
    label.setAttribute("for", inputId);
    label.textContent = labelText;
    label.style.width = "100%"; // Szerokość etykiety - 100% kolumny etykiet
    label.style.textAlign = "center";
    label.style.maxWidth = "100%";
    labelColumn.appendChild(label);
    rowDiv.appendChild(labelColumn);

    const inputColumn = document.createElement("div");
    inputColumn.style.flexBasis = "60%"; // Siedem kolumn - 70% szerokości wiersza
    inputColumn.style.display = "flex";
    inputColumn.style.alignItems = "center";
    inputColumn.style.maxWidth = "100%";


    const inputElement = inputType === "select" ? document.createElement("select") : document.createElement("input");
    inputElement.type = inputType;
    inputElement.setAttribute('id',inputId);
    inputElement.name = inputName;
    inputElement.style.width = "100%"; // Szerokość pola - 100% kolumny pól
    inputElement.style.padding = "5px";
    inputElement.style.boxSizing = "border-box";
    inputElement.style.backgroundColor = "black";
    inputElement.style.color = "white";
    inputElement.style.maxWidth = "100%";
    // inputElement.style.border = "1px dashed goldenrod"; // Dodanie ramki o szerokości 2px, stylu 'solid' i kolorze białym
    inputElement.style.border = "1px solid rgba(255, 255, 255, 0.5)"; // Dodanie ramki o szerokości 2px, stylu 'solid' i kolorze białym
    inputElement.style.borderRadius = "5px"; // Zaokrąglone rogi

    // if (inputType === "number") {
    //     inputElement.style.appearance = "textfield"; // Ukryj strzałki zwiększania i zmniejszania
    //     inputElement.style.appearance = "none"; // Usunięcie domyślnego wyglądu
    //     inputElement.style.MozAppearance = "textfield"; // Dla przeglądarek Gecko (np. Firefox)
    //     inputElement.style.WebkitAppearance = "none"; // Dla przeglądarek WebKit (np. Chrome, Safari)
    // }

    if (selectOptions) {
        // Jeśli to element typu select, dodaj opcje
        selectOptions.forEach(option => {
            const optionElement = document.createElement("option");
            optionElement.value = option.name;
            optionElement.textContent = option.name;
            inputElement.appendChild(optionElement);
        });
    }

    inputColumn.appendChild(inputElement);
    rowDiv.appendChild(inputColumn);



    return rowDiv;
}



function displayResults(data) {
    // This function will be responsible for displaying the results and pagination
    let mainContainer = document.getElementById('container-main');
    const searchFormContainer = document.getElementById('searchFormContainer');

    // Usuwamy istniejący element o id "results", jeśli istnieje
    let existingResultsDiv = document.getElementById('results');
    if (existingResultsDiv) {
        mainContainer.removeChild(existingResultsDiv);
    }

    // Tworzymy nowy element "results"
    const resultsDiv = document.createElement("div");
    resultsDiv.setAttribute('id', 'results');

    resultsDiv.style.marginTop = "50px";
    resultsDiv.style.width = "100%";
    resultsDiv.style.marginBottom = "20px";
    resultsDiv.style.maxWidth = "100%";

    // Clear previous results and pagination
    resultsDiv.innerHTML = "";

    if(data.content.length === 0){
        let emptySearchDiv = document.createElement('div');
        emptySearchDiv.textContent = 'Brak wyników wyszukiwania dla podanych filtrów';
        emptySearchDiv.style.color = 'white';
        resultsDiv.appendChild(emptySearchDiv);
        if (searchFormContainer) {
            mainContainer.insertBefore(resultsDiv, searchFormContainer.nextSibling);
        } else {
            // Jeśli "searchFormContianer" nie istnieje, dodajemy "resultsDiv" jako pierwsze dziecko
            mainContainer.appendChild(resultsDiv);
        }
        return;
    }



    // Display each advertisement result
    data.content.forEach(ad => {

        const resultDiv = document.createElement("messageResultDiv");

        resultDiv.id = "messageResultDiv";
        resultDiv.style.width = "100%";
        resultDiv.style.height = "200px";
        resultDiv.style.backgroundColor = "#000000";
        // resultDiv.style.backgroundColor = "#181818";
        // adDiv.style.backgroundColor = "black";
        resultDiv.style.color = 'darkgoldenrod';
        resultDiv.style.marginBottom = "20px";
        resultDiv.style.padding = "10px";
        resultDiv.style.display = "flex";
        resultDiv.style.alignItems = "center";
        resultDiv.style.justifyContent = "flex-start";
        resultDiv.style.borderRadius = "30px"; // Add rounded corners
        resultDiv.style.boxShadow = "0 0 40px darkgoldenrod"; // Add initial box shadow
        resultDiv.style.cursor = "pointer"; // Change cursor to pointer on hover
        resultDiv.style.maxWidth = "100%";
        resultDiv.style.opacity = 0; // Set initial opacity to 0
        resultDiv.style.animation = "fade-in 1s ease-in-out forwards";

        // Set the onclick event to redirect to the /id/{ad.id} endpoint
        resultDiv.onclick = () => {
            window.location.href = `/id?advertisementId=${ad.id}`;
        };

        // Add hover effect on mouseover
        resultDiv.onmouseover = () => {
            resultDiv.style.boxShadow = "0 0 20px moccasin";
        };

        // Remove hover effect on mouseout
        resultDiv.onmouseout = () => {
            resultDiv.style.boxShadow = "0 0 40px darkgoldenrod";
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
        conversationDetailsDiv.style.marginBottom = '30px';


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

        // Dodawanie kontenerów do infoContainerFirst
        // containers.forEach(container => {
        //     advertisementDetails.appendChild(container);
        // });


        //
        // if (ad.fuelType !== 'ELEKTRYK') {
        //     containers.push(
        //         createInfoContainer('engineType/' + ad.engineType, 'transmissionIcon', ad.engineType),
        //         createInfoContainer('transmissionType/' + ad.transmissionType, 'transmissionIcon', ad.transmissionType)
        //     );
        // }



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

        // const conversationLastMessage = document.createElement("conversationLastMessage");
        // conversationLastMessage.style.width = '100%'; // Dostosowanie do szerokości
        // conversationLastMessage.style.overflow = 'hidden'; // Ukrywa nadmiarowy tekst
        // conversationLastMessage.style.textOverflow = 'ellipsis'; // Dodaje trzy kropki na końcu, gdy tekst jest zbyt długi
        // conversationLastMessage.style.whiteSpace = 'nowrap'; // Tekst nie lami się na wiele linii


        conversationDetailsMain.appendChild(advertisementDetails);
        // conversationDetailsMain.appendChild(conversationLastMessage);

        conversationDetailsDiv.appendChild(conversationDetailsHeader);
        conversationDetailsDiv.appendChild(conversationDetailsMain);

        resultDiv.appendChild(conversationDetailsDiv);


        resultsDiv.appendChild(resultDiv);


        // Sprawdzamy, czy istnieje "searchFormContianer"
        if (searchFormContainer) {
            // Jeśli "searchFormContianer" istnieje, dodajemy "resultsDiv" po nim
            mainContainer.insertBefore(resultsDiv, searchFormContainer.nextSibling);
        } else {
            // Jeśli "searchFormContianer" nie istnieje, dodajemy "resultsDiv" jako pierwsze dziecko
            mainContainer.appendChild(resultsDiv);
        }

        // updatePaginationButtons(data, formData.get("sortBy"), formData.get("sortOrder"));

    });

// Display sort buttons if there are results
    if (data.content.length > 0) {
        const sortDiv = document.createElement("div");
        sortDiv.setAttribute('id', 'sortButtonDiv');
        sortDiv.className = "sort-buttons";

        const actualSortParam = document.createElement('div');

        let sortingByView = sortingBy;

        switch (sortingBy) {
            case 'price':
                sortingByView = 'Ceny';
                break;
            case 'mileage':
                sortingByView = 'Przebiegu';
                break;
            case 'engineCapacity':
                sortingByView = 'Pojemności silnika';
                break;
            case 'engineHorsePower':
                sortingByView = 'Mocy silnika';
                break;
            case 'productionDate':
                sortingByView = 'Daty produkcji';
                break;
            default :
                sortingByView = 'Ceny';
                break;
        }

        actualSortParam.textContent = (sortOrder !== 'desc' ? 'Sortowanie według ' + sortingByView + ' rosnąco 🢁' : 'Sortowanie według ' + sortingByView + ' malejąco 🢃');
        actualSortParam.style.color = 'darkgoldenrod';
        actualSortParam.style.display = 'flex';
        actualSortParam.style.justifyContent = 'center';
        actualSortParam.style.marginBottom = '15px';

        sortDiv.appendChild(actualSortParam);

        // List of sortable parameters
        const sortableParams = ["price", "mileage", "engineCapacity", "engineHorsePower", "productionDate"];
        // Create and append sort buttons for each sortable parameter
        sortableParams.forEach(sortBy => {
            const sortButton = createSortButton(sortBy);
            sortDiv.appendChild(sortButton);
        });

        resultsDiv.insertBefore(sortDiv, resultsDiv.firstChild);
    }

    // Display pagination links if there are multiple pages
    if (data.totalPages > 1) {
        const paginationDiv = document.createElement("div");
        paginationDiv.className = "pagination";

        // Add previous page button
        if (!data.first) {
            const prevPageButton = createPaginationButton(data.number - 1, "<", formData);
            paginationDiv.appendChild(prevPageButton);
        }

        // Add page number buttons
        for (let i = 0; i < data.totalPages; i++) {
            const pageButton = createPaginationButton(i, i + 1, formData);
            if (i === data.number) {
                pageButton.disabled = true;
                pageButton.classList.add("active");
            }
            paginationDiv.appendChild(pageButton);
        }
        // Add next page button
        if (!data.last) {
            const nextPageButton = createPaginationButton(data.number + 1, ">", formData);
            paginationDiv.appendChild(nextPageButton);
        }

        resultsDiv.appendChild(paginationDiv);
    }
}

function updatePaginationButtons(data, sortBy, sortOrder) {
    const paginationDiv = document.querySelector(".pagination");
    if (!paginationDiv) return;

    // Clear existing pagination buttons
    paginationDiv.innerHTML = "";

    // Add previous page button
    if (!data.first) {
        const prevPageButton = createPaginationButton(data.number - 1, "<", sortBy, sortOrder);
        paginationDiv.appendChild(prevPageButton);
    }

    // Add page number buttons
    for (let i = 0; i < data.totalPages; i++) {
        const pageButton = createPaginationButton(i, i + 1, sortBy, sortOrder);
        if (i === data.number) {
            pageButton.disabled = true;
            pageButton.classList.add("active");
        }
        paginationDiv.appendChild(pageButton);
    }

    // Add next page button
    if (!data.last) {
        const nextPageButton = createPaginationButton(data.number + 1, ">", sortBy, sortOrder);
        paginationDiv.appendChild(nextPageButton);
    }
}

function extractSortParam() {
    const urlParams = new URLSearchParams(document.location.search);
    return urlParams.get('sortBy');
}

function extractPageNumber() {
    const urlParams = new URLSearchParams(document.location.search);
    return Number(urlParams.get('pageNumber'));
}

function createPaginationButton(pageNumber, label, sortBy, sortOrder) {
    const button = document.createElement("button");
    button.textContent = label;



    button.style.backgroundColor = "black";
    button.style.color = "white";
    button.style.border = "1px solid darkgoldenrod";
    button.style.padding = "10px 20px";  // Dodane dla lepszego wyglądu przycisku
    button.style.cursor = "pointer";     // Zmienia kursor na dłoń, gdy najedziesz na przycisk
    button.style.transition = "0.3s";    // Dodane dla efektu płynnego przejścia
    button.style.borderRadius = '15px';
    button.style.marginRight = '3px';

    let currentPageNumber = extractPageNumber();

    if(currentPageNumber+1 === label){
        button.style.boxShadow = '0 0 20px moccasin';
    }


    // if(pageNumber+1 === label){
    //     button.style.color = 'green';
    // }



    button.addEventListener("click", function () {
        // Get the current form data
        // const formData = new FormData(document.getElementById("advertisementFilterForm"));


        // Set the new page number in the formData
        formData.set("pageNumber", pageNumber);

        if (sortOrder == null) {
            sortOrder = "asc";
            sortBy = "price";
        }

        // Set the sorting parameters in the formData
        formData.set("sortBy", sortBy);
        formData.set("sortOrder", sortOrder);
        // Call the search function with updated data
        executeSearch(formData);
    });
    return button;
}
let clickedButton = "";
function createSortButton(sortBy) {
    const button = document.createElement("button");
    // button.textContent = sortBy;

    button.style.backgroundColor = "black";
    button.style.color = "white";
    button.style.border = "1px solid darkgoldenrod";
    button.style.padding = "10px 20px";  // Dodane dla lepszego wyglądu przycisku
    button.style.cursor = "pointer";     // Zmienia kursor na dłoń, gdy najedziesz na przycisk
    button.style.transition = "0.3s";    // Dodane dla efektu płynnego przejścia
    button.style.borderRadius = '15px';
    button.style.marginRight = '10px';

    if(extractSortParam() === sortBy){
        button.style.boxShadow = '0 0 20px moccasin';
    }



    // let currentPageNumber = extractPageNumber();
    //
    // if(sortingByView === sortBy){
    //     button.style.boxShadow = '0 0 20px moccasin';
    // }



    switch (sortBy) {
        case 'price':
            if(extractSortParam() === null){
                button.style.boxShadow = '0 0 20px moccasin';
            }
            button.textContent = 'Cena';
            break;
        case 'mileage':
            button.textContent = 'Przebieg';
            break;
        case 'engineCapacity':
            button.textContent = 'Pojemność silnika';
            break;
        case 'engineHorsePower':
            button.textContent = 'Moc silnika';
            break;
        case 'productionDate':
            button.textContent = 'Data produkcji';
            break;
        default:
            button.textContent = 'Inny tekst';
            break;
    }


    clickedButton = "";

    button.style.marginBottom = '20px';
    button.addEventListener("click", function () {
        sortOrder = sortOrder === "desc" ? "asc" : "desc";
        formData.set("sortOrder", sortOrder);
        formData.set("sortBy", sortBy);
        formData.set("pageNumber", "0");
        clickedButton = button.textContent;
        sortingBy = sortBy;
        executeSearch(formData);
        // Call the search function with updatedw data
    });

    return button;
}
function executeSearch(formData) {

    let searchParams;
    // Remove the sortBy and sortOrder parameters from formData to avoid confusion
    if(formData){
        searchParams = new URLSearchParams();
        formData.forEach((value, key) => {
            if (value) {
                searchParams.append(key, value);
            }
            // formData.get("pageNumber")
            sortingBy = formData.get("sortBy");
            sortOrder = formData.get("sortOrder");


            const newUrl = window.location.pathname + "?" + searchParams.toString();
            history.pushState(null, null, newUrl);
        });
    }



    // Make the GET request to the API endpoint with the sorting parameters
    fetch("/api/advertisements/filter/search?" + searchParams.toString())
        .then(response => response.json())
        .then(data => {
            // Display the results and pagination with sorting parameters
            displayResults(data, sortingBy, sortOrder);
            updatePaginationButtons(data, sortingBy, sortOrder);
            // updateSortButtons(data, sortBy, sortOrder);
        })
        .catch(error => console.error("Error fetching data:", error));
}


function createInfoContainer(iconPath, altText, value) {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.flexGrow = '1'; // Równomiernie rozłożenie elementów
    container.style.textAlign = 'center';
    container.style.marginRight = '30px';
    container.style.color = 'white';
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

function populateSelectOptions(options, selectId) {
    const selectElement = document.getElementById(selectId);
    // Clear existing options
    selectElement.innerHTML = `<option value=""> </option>`;
    options.forEach(option => {
        const optionElement = document.createElement("option");
        optionElement.value = option.name;
        optionElement.textContent = option.name;
        selectElement.appendChild(optionElement);

    });
}

