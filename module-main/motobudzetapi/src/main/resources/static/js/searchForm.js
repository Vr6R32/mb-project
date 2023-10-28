let formData = new FormData();
let sortOrder = "asc"; // Set the default sort order to "asc" (ascending) or "desc" (descending) as you prefer
let sortingBy = "price"; // Set the default sort by parameter to "price" (or any other default value you prefer)
let urlSearchParams = null;
let favouritesArray = [];

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
        if (urlSearchParams.toString() !== "" && !urlSearchParams.has("activation")) {
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
    if (urlSearchParams.has("city")) {
        let city = document.getElementById("city");
        city.value = urlSearchParams.get("city");
    }
    if (urlSearchParams.has("distanceFrom")) {
        let distanceFrom = document.getElementById("distanceFrom");
        distanceFrom.value = urlSearchParams.get("distanceFrom");
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
        let cityState = formObj.querySelector('#cityState');
        brand.value = urlSearchParams.get("brand");
        driveType.value = urlSearchParams.get("driveType");
        engineType.value = urlSearchParams.get("engineType");
        fuelType.value = urlSearchParams.get("fuelType");
        transmissionType.value = urlSearchParams.get("transmissionType");
        cityState.value = urlSearchParams.get("cityState");
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

    fetch("/api/cities/states")
        .then(response => response.json())
        .then(data => populateSelectOptions(data, "cityState"));

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
    form.appendChild(createRowWithInputElement("Miasto:", "text", "city", "city"));
    form.appendChild(createRowWithInputElement("Województwo:", "select", "cityState", "cityState"));
    form.appendChild(createRowWithInputElement("Odległość:", "number", "distanceFrom", "distanceFrom"));
    form.appendChild(createRowWithInputElement("Anglik:", "select", "jaj", "jaj"));


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
    searchButton.setAttribute('id', 'searchButton');
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

    let inputs = form.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
        input.addEventListener('change', function() {
            if (input.name === 'city') {
                input.value = input.value.trim();
                setTimeout(() => {
                    formData.set(input.name, input.value); // Update the FormData
                    executeAdvertisementFilterResultCount(); // Execute your fetch request
                }, 500);
            } else {
                formData.set(input.name, input.value);  // Update the FormData immediately for other inputs
                executeAdvertisementFilterResultCount();  // Execute your fetch request immediately for other inputs
            }
        });
    });



    formContainer.appendChild(form);

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        // Get the form data
        formData = new FormData(event.target);

        executeSearch(formData);

    });

}

function executeAdvertisementFilterResultCount() {
    // Define the endpoint URL
    let url = 'api/advertisements/filter/count';

    // Append FormData values to the URL if you need query parameters
    let params = new URLSearchParams();
    for (let pair of formData.entries()) {
        params.append(pair[0], pair[1]);
    }
    if(params.toString()) {
        url += '?' + params.toString();
    }

    // Execute the GET request
    fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            // Add any other necessary headers here
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            let searchButton = document.getElementById('searchButton');
            searchButton.textContent = "Szukaj "+"("+data+")";
        })
        .catch(error => {
            console.error('Error fetching data:', error);
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

    if (inputId === 'city') {

        const inputContainer = document.createElement("div");
        inputContainer.style.position = "relative"; // Ustawiamy pozycję na "relative", aby umożliwić pozycjonowanie względem tego kontenera

        inputColumn.style.position = 'relative';

        const suggestionsList = document.createElement('ul');
        suggestionsList.id = 'suggestionsList';
        suggestionsList.style.listStyleType = 'none';
        suggestionsList.style.padding = '0';
        suggestionsList.style.margin = '0';
        suggestionsList.style.position = 'absolute';
        suggestionsList.style.backgroundColor = 'black';
        suggestionsList.style.color = 'white';
        suggestionsList.style.border = '1px solid #ccc';
        suggestionsList.style.borderRadius = '5px';
        suggestionsList.style.maxHeight = '150px';
        suggestionsList.style.minWidth = '200px';
        suggestionsList.style.overflowY = 'auto';
        suggestionsList.style.display = 'none';
        suggestionsList.style.zIndex = '1000'; // Ensure it appears above other content
        // suggestionsList.style.marginTop = '200px';
        // suggestionsList.style.bottom = "-30px";
        suggestionsList.style.top = "100%";

        suggestionsList.style.scrollbarWidth = 'thin';
        suggestionsList.style.scrollbarColor = 'darkgoldenrod transparent';
        suggestionsList.style.WebkitScrollbar = 'thin';
        suggestionsList.style.WebkitScrollbarTrack = 'transparent';
        suggestionsList.style.WebkitScrollbarThumb = 'darkgoldenrod';
        suggestionsList.style.WebkitScrollbarThumbHover = 'goldenrod';


        // Dodaj obsługę kliknięcia na propozycję miasta
        suggestionsList.addEventListener('click', function (event) {
            if (event.target && event.target.nodeName === 'LI') {
                inputElement.value = event.target.textContent;
                suggestionsList.style.display = 'none';
            }
        });

        // Dodaj listę propozycji do pola miasta
        inputContainer.appendChild(inputElement);
        inputColumn.appendChild(suggestionsList);
        rowDiv.appendChild(inputContainer);

        // Obsługa wprowadzania tekstu w polu miasta
        let timeoutId;
        const debounceDelay = 200; // Opóźnienie dynamiczne (1 sekunda)

        inputElement.addEventListener("input", function () {
            // Anuluje poprzednie żądanie, jeśli istnieje
            clearTimeout(timeoutId);

            // Pobiera częściową nazwę miasta wprowadzoną przez użytkownika
            const partialCityName = inputElement.value;

            // Ustawia nowe opóźnienie
            timeoutId = setTimeout(function () {
                // Wykonuje żądanie do backendu REST API, przesyłając częściową nazwę miasta
                fetch(`/api/cities?partialName=${partialCityName}`)
                    .then(response => response.json())
                    .then(data => {
                        // Aktualizuje listę propozycji miast na podstawie odpowiedzi od serwera
                        updateCitySuggestions(data);
                    })
                    .catch(error => {
                        console.error("Błąd podczas pobierania propozycji miast:", error);
                    });
            }, debounceDelay); // Odczekuje 1 sekundę po zakończeniu wpisywania użytkownika
        });
    }

    inputColumn.appendChild(inputElement);
    rowDiv.appendChild(inputColumn);



    return rowDiv;
}

document.addEventListener('click', function(event) {
    const suggestionsList = document.getElementById('suggestionsList');

    // Sprawdza, czy istnieje lista propozycji i czy kliknięcie miało miejsce poza nią
    if (suggestionsList && !suggestionsList.contains(event.target)) {
        suggestionsList.style.display = 'none';
    }
});

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

function getUserName(){
    let userName = document.getElementById('username');
    return userName.textContent;
}


function getUserFavourites() {


    fetch("/api/users/favourites/" + getUserName())
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            // Przekształć ciąg znaków w tablicę UUID
            let ids = data.replace(/[\[\]]/g, '').split(',').filter(Boolean);

            ids.forEach(id => {
                id = id.trim();  // Usuń ewentualne białe znaki

                // Usuń cudzysłowy z początku i końca ciągu znaków
                id = id.replace(/^"|"$/g, '');

                favouritesArray.push(id);
            });
        })
        .catch(error => console.error("Error fetching data:", error));
}

function displayResults(data) {

    // Make the GET request to the API endpoint with the sorting parameters



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
        resultDiv.style.backgroundColor =   'rgba(0, 0, 0, 1)';
        // resultDiv.style.backgroundColor = "#000000";
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
        // resultDiv.style.opacity = 0; // Set initial opacity to 0
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
        photoElement.style.backgroundColor = 'rgba(0, 0, 0, 1)'
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
        conversationDetailsDiv.style.marginBottom = '30px';


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
        locationDetailsDiv.style.bottom = '10px';

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

        favouriteIconDiv.addEventListener('mouseover', function() {
            favouriteIconDiv.style.cursor = "pointer";
            favouriteText.style.left = '-15px';  // Przesuń tekst do pozycji początkowej
            favouriteText.style.opacity = '1';  // Ustaw opacity na 1
        });
        favouriteIconDiv.addEventListener('mouseout', function() {
            favouriteIconDiv.style.cursor = "auto";
            favouriteText.style.left = '-150px';  // Chowa tekst z powrotem poza widok
            favouriteText.style.opacity = '0';  // Ustaw opacity na 0
        });


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



        const editBottomHeaderDiv = document.createElement("div");
        editBottomHeaderDiv.style.color = "darkgoldenrod"; // Dostosuj kolor tekstu
        editBottomHeaderDiv.style.fontSize = "18px"; // Dostosuj rozmiar tekstu
        editBottomHeaderDiv.style.position = 'relative'; // Dostosuj rozmiar tekstu
        editBottomHeaderDiv.style.bottom = '-25px'; // Dostosuj rozmiar tekstu
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









        const editIcon = document.createElement('img');

        editIconDiv.addEventListener('click', function(event) {
            event.stopPropagation();
            window.location = '/advertisement/edit?advertisementId=' + ad.id;
        });

        editWrapper.appendChild(editText);
        editWrapper.appendChild(editIconDiv);

        if (ad.user !== getUserName()) {
            heartIcon.style.marginBottom = '2px';
            favouriteIconDiv.appendChild(heartIcon);
            favouriteBottomHeaderDiv.appendChild(favouriteWrapper);
            bottomDetailsHeader.appendChild(favouriteBottomHeaderDiv);
            if (favouritesArray.includes(ad.id)) {
                heartIcon.src = "/api/resources/heartFull";
                favouriteText.innerHTML = "Usuń z ulubionych";
            } else {
                heartIcon.src = "/api/resources/heartEmpty";
                favouriteText.innerHTML = "Dodaj do ulubionych";
            }
        } else if (getUserName() === ad.user) {
            editIcon.src = "/api/resources/editIcon";
            editText.innerHTML = "Edytuj ogłoszenie";
            editBottomHeaderDiv.appendChild(editWrapper);
            editIcon.style.marginBottom = '2px';
            editIconDiv.appendChild(editIcon);
            bottomDetailsHeader.appendChild(editBottomHeaderDiv);
        }


        favouriteIconDiv.addEventListener('click', function(event) {
            event.stopPropagation();

            if (heartIcon.src.includes("heartFull")) {
                heartIcon.src = "/api/resources/heartEmpty";
                favouriteText.innerHTML = "Dodaj do ulubionych";
            } else if (heartIcon.src.includes("heartEmpty")) {
                heartIcon.src = "/api/resources/heartFull";
                favouriteText.innerHTML = "Usuń z ulubionych";
            }

            const requestBody = {
                advertisementId: ad.id
            };

            if(getUserName()!=='KONTO'){
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
            }
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
        setTimeout(function() {
            window.scroll({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
        }, 500);
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

    if(getUserName()!=='KONTO'){
        getUserFavourites();
    }


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

