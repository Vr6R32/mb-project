let formData = new FormData();
let sortOrder = "asc"; // Set the default sort order to "asc" (ascending) or "desc" (descending) as you prefer
let sortingBy = "price"; // Set the default sort by parameter to "price" (or any other default value you prefer)
let urlSearchParams = null;
let favouritesArray = [];
let clickedButton = "";
let darkModeCheckbox;

document.addEventListener("DOMContentLoaded", function () {
    createSearchFormContainer();
    fetchAllSpecifications();
    getParametersFromCurrentUrl();
    initializeParameters();
});
document.addEventListener('click', function(event) {
    const cityStateInput = document.getElementById('cityState');
    const cityStateLabel = document.getElementById('cityStatelabel');
    const cityInput = document.getElementById('city');
    const cityLabel = document.getElementById('citylabel');
    const suggestionsList = document.getElementById('suggestionsList');

    if (suggestionsList && !suggestionsList.contains(event.target)) {
        if(cityInput.value === null || cityInput.value === '') {
            cityLabel.style.color = 'darkgoldenrod';
        }
        suggestionsList.style.display = 'none';
        // cityStateInput.value = '';
        // cityStateLabel.style.color = 'darkgoldenrod';
    }
});


function initializeParameters() {
    let urlParams = new URLSearchParams(window.location.search);
    let activationParam = "activation";
    if (urlParams.has(activationParam) && urlParams.get(activationParam) === "true") {
        showSuccessNotification('Twoje konto zostało pomyślnie aktywowane, a profil w pełni skonfigurowany. Możesz teraz publikowanić nowe ogłoszenia.');
    }
}
function getParametersFromCurrentUrl() {
    const currentUrl = window.location.href;
    const indexOfQuestionMark = currentUrl.indexOf('?');
    if (indexOfQuestionMark !== -1) {
        const queryString = currentUrl.substring(indexOfQuestionMark + 1);
        urlSearchParams = new URLSearchParams(queryString);
        if (urlSearchParams.toString() !== "" && !urlSearchParams.has("activation")) {
            urlSearchParams.forEach((value, key) => {
                formData.set(key, value);
            });
            executeSearch(formData);
            setFormValuesFromUrlParams(urlSearchParams);
        }
    }
}
function setFormValuesFromUrlParams(urlSearchParams) {
    const paramsMapping = {
        sortBy: null,
        sortOrder: null,
        priceMin: "priceMin",
        priceMax: "priceMax",
        mileageFrom: "mileageFrom",
        mileageTo: "mileageTo",
        engineCapacityFrom: "engineCapacityFrom",
        engineCapacityTo: "engineCapacityTo",
        engineHorsePowerFrom: "engineHorsePowerFrom",
        engineHorsePowerTo: "engineHorsePowerTo",
        productionDateFrom: "productionDateFrom",
        productionDateTo: "productionDateTo",
        city: "city",
        distanceFrom: "distanceFrom"
    };

    for (let param in paramsMapping) {
        if (urlSearchParams.has(param)) {
            if (paramsMapping[param]) {
                let element = document.getElementById(paramsMapping[param]);
                element.value = urlSearchParams.get(param);

                // Pobierz etykietę powiązaną z elementem
                let label = document.querySelector(`label[for='${paramsMapping[param]}']`);
                if (label) {
                    applyLabelColor(element, label); // Zastosuj kolor etykiety
                }
            } else {
                window[param] = urlSearchParams.get(param);
            }
        }
    }

}
setTimeout(function setInputSelect() {
    if (urlSearchParams) {
        let formObj = document.getElementById('advertisementFilterForm');
        let fields = {
            brand: formObj.querySelector('#brand'),
            driveType: formObj.querySelector('#driveType'),
            engineType: formObj.querySelector('#engineType'),
            fuelType: formObj.querySelector('#fuelType'),
            transmissionType: formObj.querySelector('#transmissionType'),
            cityState: formObj.querySelector('#cityState')
        };

        for (let key in fields) {
            if (fields.hasOwnProperty(key)) {
                let paramValue = urlSearchParams.get(key);
                if (paramValue !== null && paramValue.trim() !== "") {
                    fields[key].value = paramValue;
                    fields[key].style.color = 'white';
                    let label = document.querySelector(`label[for='${fields[key].id}']`);
                    if (label) {
                        applyLabelColor(fields[key], label); // Zastosuj kolor etykiety
                    }
                }
            }
        }
    }
}, 200);
setTimeout(function setModelSelect() {
    if (urlSearchParams) {
        let brandValue = urlSearchParams.get("brand");
        if (brandValue !== null && brandValue.trim() !== "") {
            fetch(`/api/models/${encodeURIComponent(brandValue)}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok.');
                    }
                    return response.json();
                })
                .then(data => {
                    populateSelectOptions(data, "model");

                    let formObj = document.getElementById('advertisementFilterForm');
                    let modelSelect = formObj.querySelector('#model');
                    let modelValue = urlSearchParams.get("model");
                    if (modelValue !== null && modelValue.trim() !== "") {
                        modelSelect.value = modelValue;
                        modelSelect.style.color = 'white';
                        // Pobierz etykietę powiązaną z elementem modelSelect
                        let label = document.querySelector(`label[for='model']`);
                        if (label) {
                            applyLabelColor(modelSelect, label); // Zastosuj kolor etykiety
                        }
                    }
                })
                .catch(error => {
                    console.error('There has been a problem with your fetch operation:', error);
                });
        }
    }
}, 300);
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
            populateSelectOptions(data, "brand");
            const modelSelect = document.getElementById("model");
            const brandSelect = document.getElementById("brand");

            brandSelect.addEventListener("change", function (event) {
                const selectedBrand = event.target.value;
                if (selectedBrand !== "") {
                    modelSelect.innerHTML = "";
                    fetch(`/api/models/${selectedBrand}`)
                        .then(response => response.json())
                        .then(data => {
                            populateSelectOptions(data, "model");
                        });
                }
            });

            const changeEvent = new Event("change");
            brandSelect.dispatchEvent(changeEvent);
        });
}
function createMotorcycleForm(){

}
function createCarForm(){

}
function createPartForm(){

}
function createTabbedMenu() {
    const tabbedMenu = document.createElement("div");
    tabbedMenu.setAttribute('id', 'tabbedMenu');
    tabbedMenu.style.display = "flex";
    tabbedMenu.style.justifyContent = "flex-start";
    tabbedMenu.style.position = "absolute";
    tabbedMenu.style.top = "-45px";
    tabbedMenu.style.left = "15px";
    tabbedMenu.style.zIndex = '0';


    const tabs = [
        { name: "Samochody", callback: createCarForm },
        { name: "Motocykle", callback: createMotorcycleForm },
        { name: "Części", callback: createPartForm }
    ];

    tabs.forEach((tab, index) => {
        const tabButton = document.createElement("button");
        tabButton.textContent = tab.name;
        tabButton.style.padding = "10px 20px";
        tabButton.style.border = "none";
        tabButton.style.cursor = "pointer";
        tabButton.style.background = "black";
        tabButton.style.color = "white";
        tabButton.style.width = '100px';
        tabButton.style.height = '69px';
        tabButton.style.lineHeight = '54px';
        tabButton.style.maxHeight = '100%';
        tabButton.style.maxWidth = '100%';
        tabButton.style.display = 'flex';
        tabButton.style.alignItems = 'center';
        tabButton.style.justifyContent = 'center';
        tabButton.style.transform = 'translateY(-20px)';

        tabButton.style.borderRadius = '15px 15px 0 0 ';



        tabButton.addEventListener('click', function() {
            for (let btn of tabbedMenu.children) {
                btn.style.zIndex = "-100";
                btn.style.boxShadow = "none";
            }

            this.style.borderRadius = '15px 15px 0 0 '
            this.style.zIndex = "100";
            this.style.boxShadow = "-9px -9px 12px -6px darkgoldenrod,  9px -9px 12px -6px darkgoldenrod, -2px 0px 7px -17px darkgoldenrod";

            tab.callback();
        });

        tabbedMenu.appendChild(tabButton);

        if (tabbedMenu.children.length > 0) {
            tabbedMenu.children[0].click();
        }
    });
    if (tabs.length > 1) {
        const lastButton = tabbedMenu.children[tabbedMenu.children.length - 1];
        lastButton.style.marginRight = "0";
    }
    let mainContainer = document.getElementById('container-main');
    mainContainer.style.position = "relative";
    mainContainer.insertBefore(tabbedMenu, mainContainer.firstChild);
}
async function createSearchFormContainer() {

    let mainContainer = document.getElementById('container-main');
    const formContainer = document.createElement("div");




    formContainer.setAttribute('id', 'searchFormContainer');
    mainContainer.insertBefore(formContainer, mainContainer.firstChild);
    createSearchForm(formContainer);
    createTabbedMenu();

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


    const driveTypesOptions = [];
    const engineTypesOptions = [];
    const fuelTypesOptions = [];
    const transmissionTypesOptions = [];
    const brandsOptions = [];

    form.appendChild(createRowWithInputElement("np. -> Nissan","Marka:", "select", "brand", "brand", brandsOptions));
    form.appendChild(createRowWithInputElement("np. -> 350Z","Model:", "select", "model", "model"));
    form.appendChild(createRowWithInputElement("np. -> Widlasty","Rodzaj Silnika:", "select", "engineType", "engineType", engineTypesOptions));
    form.appendChild(createRowWithInputElement("np. -> LPG","Rodzaj Paliwa:", "select", "fuelType", "fuelType", fuelTypesOptions));
    form.appendChild(createRowWithInputElement("np. -> RWD","Rodzaj Napędu:", "select", "driveType", "driveType", driveTypesOptions));
    form.appendChild(createRowWithInputElement("np. -> Automat","Skrzynia Biegów:", "select", "transmissionType", "transmissionType", transmissionTypesOptions));
    form.appendChild(createRowWithInputElement("np. -> 10000","Cena od:", "number", "priceMin", "priceMin"));
    form.appendChild(createRowWithInputElement("np. -> 100000","Cena do:", "number", "priceMax", "priceMax"));
    form.appendChild(createRowWithInputElement("np. -> 50000","Przebieg od:", "number", "mileageFrom", "mileageFrom"));
    form.appendChild(createRowWithInputElement("np. -> 200000","Przebieg do:", "number", "mileageTo", "mileageTo"));
    form.appendChild(createRowWithInputElement("np. -> 2997","Pojemność od:", "number", "engineCapacityFrom", "engineCapacityFrom"));
    form.appendChild(createRowWithInputElement("np. -> 4007","Pojemność do:", "number", "engineCapacityTo", "engineCapacityTo"));
    form.appendChild(createRowWithInputElement("(KM) np. -> 299","Moc od:", "number", "engineHorsePowerFrom", "engineHorsePowerFrom"));
    form.appendChild(createRowWithInputElement("(KM) np. -> 820", "Moc do:", "number", "engineHorsePowerTo", "engineHorsePowerTo"));
    form.appendChild(createRowWithInputElement("np. -> 2015", "Rok Produkcji od:", "number", "productionDateFrom", "productionDateFrom"));
    form.appendChild(createRowWithInputElement("np. -> 2019", "Rok Produkcji do:", "number", "productionDateTo", "productionDateTo"));
    form.appendChild(createRowWithInputElement("np. -> Gdańsk", "Miasto:", "text", "city", "city"));
    form.appendChild(createRowWithInputElement("np. -> Pomorskie", "Województwo:", "select", "cityState", "cityState"));
    form.appendChild(createRowWithInputElement("(KM) np. -> 150", "Odległość:", "number", "distanceFrom", "distanceFrom"));
    form.appendChild(createRowWithInputElement(null, "Anglik:", "select", "jaj", "jaj"));

    const searchButton = document.createElement("button");
    searchButton.setAttribute('id', 'searchButton');
    searchButton.type = "submit";
    searchButton.textContent = "Szukaj";
    searchButton.style.fontSize = "16px";
    searchButton.style.fontStyle = "bold";
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
            let delay = 100;

            if (input.name === 'city' || input.name === 'brand') {
                input.value = input.value.trim();
                delay = 500;
            }

            setTimeout(() => {
                formData.set(input.name, input.value);
                if(input.name === 'brand'){
                    let modelLabel = document.getElementById('modellabel');
                    modelLabel.style.color = 'darkgoldenrod';
                    formData.set("model","");
                }
                executeAdvertisementFilterResultCount();
            }, delay);

        });
    });



    formContainer.appendChild(form);

    form.addEventListener("submit", function (event) {
        event.preventDefault();
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
            searchButton.style.fontStyle = 'bold';
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}
function handleProposalOptions(inputId,proposeElements) {
    switch (inputId) {
        case 'productionDateFrom':
            for (let year = 1970; year <= 2024; year++) {
                proposeElements.push(year.toString());
            }
            break;
        case 'productionDateTo':
            for (let year = 2024; year >= 1970; year--) {
                proposeElements.push(year.toString());
            }
            break;
        case 'mileageFrom':
            for (let mileage = 50000; mileage <= 250000; mileage += 50000) {
                proposeElements.push(mileage.toLocaleString('en-US', { maximumFractionDigits: 0 }).replace(/,/g, ' '));
            }
            break;
        case 'mileageTo':
            for (let mileage = 250000; mileage >= 50000; mileage -= 50000) {
                proposeElements.push(mileage.toLocaleString('en-US', { maximumFractionDigits: 0 }).replace(/,/g, ' '));
            }
            break;
        case 'priceMin':
            for (let price = 10000; price <= 250000; price += 10000) {
                proposeElements.push(price.toLocaleString('en-US', { maximumFractionDigits: 0 }).replace(/,/g, ' '));
            }
            break;
        case 'priceMax':
            for (let price = 250000; price >= 10000; price -= 10000) {
                proposeElements.push(price.toLocaleString('en-US', { maximumFractionDigits: 0 }).replace(/,/g, ' '));
            }
            break;
        case 'engineCapacityFrom':
            for (let capacity = 990; capacity <= 6990; capacity += 500) {
                proposeElements.push(capacity.toLocaleString('en-US', { maximumFractionDigits: 0 }).replace(/,/g, ' '));
            }
            break;
        case 'engineCapacityTo':
            for (let capacity = 6990; capacity >= 990; capacity -= 500) {
                proposeElements.push(capacity.toLocaleString('en-US', { maximumFractionDigits: 0 }).replace(/,/g, ' '));
            }
            break;
        case 'engineHorsePowerFrom':
            for (let horsePower = 90; horsePower <= 640; horsePower += 50) {
                proposeElements.push(horsePower.toLocaleString('en-US', { maximumFractionDigits: 0 }).replace(/,/g, ' '));
            }
            break;
        case 'engineHorsePowerTo':
            for (let horsePower = 640; horsePower >= 90; horsePower -= 50) {
                proposeElements.push(horsePower.toLocaleString('en-US', { maximumFractionDigits: 0 }).replace(/,/g, ' '));
            }
            break;
        case 'distanceFrom':
            for (let distance = 20; distance <= 400; distance += 20) {
                proposeElements.push(distance.toLocaleString('en-US', { maximumFractionDigits: 0 }).replace(/,/g, ' '));
            }
            break;
        default:
            proposeElements = ["999"];
            break;
    }
    return proposeElements;
}
function createRowWithInputElement(exampleValue,labelText, inputType, inputId, inputName, selectOptions = null) {
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
    labelColumn.style.marginRight = "5px";
    labelColumn.style.marginLeft = "5px";
    labelColumn.style.maxWidth = "100%";

    const label = document.createElement("label");
    label.setAttribute("for", inputId);
    label.setAttribute("id", inputId+'label');
    label.textContent = labelText;
    label.style.width = "100%"; // Szerokość etykiety - 100% kolumny etykiet
    label.style.textAlign = "center";
    label.style.maxWidth = "100%";
    label.style.color = 'darkgoldenrod';
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
    inputElement.style.width = "100%";
    inputElement.style.padding = "5px";
    inputElement.style.boxSizing = "border-box";
    inputElement.style.backgroundColor = "black";
    inputElement.style.color = "white";
    inputElement.style.maxWidth = "100%";
    inputElement.style.border = "1px solid rgba(255, 255, 255, 0.5)";
    inputElement.style.borderRadius = "5px";
    inputElement.placeholder = exampleValue;




    if (inputType === "number") {
        let dataListId;
        dataListId = `list-${inputId}`;
        inputElement.setAttribute("list", dataListId);
        inputElement.setAttribute("type", "text"); // Zmień na text, aby umożliwić wybór z datalist
        // inputElement.setAttribute("pattern", "\\d*");
        const dataList = document.createElement("datalist");
        dataList.className = "custom-datalist";
        dataList.id = dataListId;
        dataList.style.maxHeight = '300px';
        dataList.style.height = "5.1em";
        dataList.style.overflow = "hidden";
        // inputElement.addEventListener('mouseenter', function() {
        //     this.click();
        // });
        inputElement.addEventListener('input', function(event) {
            this.value = this.value.replace(/[^0-9]/g, '');
        });

        let proposeElements = [];

        proposeElements = handleProposalOptions(inputId, proposeElements);

        proposeElements.forEach(value => {
            const optionElement = document.createElement("option");
            optionElement.value = value;
            dataList.appendChild(optionElement);
        });
        inputColumn.appendChild(dataList);
    }




    if (selectOptions) {
        selectOptions.forEach(option => {
            const optionElement = document.createElement("option");
            optionElement.value = option.name;
            optionElement.textContent = option.name;
            inputElement.appendChild(optionElement);
        });
    }

    if(inputId === 'model'){
        inputElement.style.color = 'gray';
        const defaultOption = document.createElement("option");
        defaultOption.setAttribute('id', 'emptyModel');
        defaultOption.value = "";
        defaultOption.style.color = 'gray';
        defaultOption.textContent = "Wybierz markę...";
        inputElement.appendChild(defaultOption);
    }

    if (inputId === 'city') {

        const inputContainer = document.createElement("div");
        inputContainer.style.position = "relative";
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

    inputElement.addEventListener('change', function() {
        applyLabelColor(inputElement, label);
    });

    inputColumn.appendChild(inputElement);
    rowDiv.appendChild(inputColumn);



    return rowDiv;
}
function applyLabelColor(element, label) {
    if (element.value !== '') {
        label.style.color = 'white';
    } else {
        label.style.color = 'darkgoldenrod';
    }
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

    let mainContainer = document.getElementById('container-main');
    const searchFormContainer = document.getElementById('searchFormContainer');

    let existingResultsDiv = document.getElementById('results');
    if (existingResultsDiv) {
        mainContainer.removeChild(existingResultsDiv);
    }

    const resultsDiv = document.createElement("div");
    resultsDiv.setAttribute('id', 'results');

    resultsDiv.style.marginTop = "50px";
    resultsDiv.style.width = "100%";
    resultsDiv.style.marginBottom = "20px";
    resultsDiv.style.maxWidth = "100%";

    resultsDiv.innerHTML = "";

    if(data.content.length === 0){
        let emptySearchDiv = document.createElement('div');
        emptySearchDiv.textContent = 'Brak wyników wyszukiwania dla podanych filtrów';
        emptySearchDiv.style.color = 'white';
        resultsDiv.appendChild(emptySearchDiv);
        if (searchFormContainer) {
            mainContainer.insertBefore(resultsDiv, searchFormContainer.nextSibling);
        } else {

            mainContainer.appendChild(resultsDiv);
        }
        return;
    }


    darkModeCheckbox = document.getElementById('darkModeCheckbox');


    // Display each advertisement result
    data.content.forEach(ad => {

        const resultDiv = document.createElement("messageResultDiv");

        resultDiv.className = 'searchResult';


        resultDiv.id = "messageResultDiv";
        resultDiv.style.width = "100%";
        resultDiv.style.height = "240px";
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
        resultDiv.style.cursor = "pointer"; // Change cursor to pointer on hover
        resultDiv.style.maxWidth = "100%";
        resultDiv.style.fontSize = "20px";
        // resultDiv.style.opacity = 0; // Set initial opacity to 0
        resultDiv.style.animation = "fade-in 1s ease-in-out forwards";
        // Set the onclick event to redirect to the /id/{ad.id} endpoint
        resultDiv.onclick = (event) => {
            event.preventDefault(); // To zatrzyma domyślne przewijanie strony
            window.location.href = `/id?advertisementId=${ad.id}`;
        };

        handleDarkModeInverse(resultDiv);


        const photoElement = document.createElement("img");
        photoElement.src = `/api/resources/advertisementPhoto/${ad.mainPhotoUrl}`;
        photoElement.style.height = "200px";
        photoElement.style.backgroundColor = 'rgba(0, 0, 0, 1)'
        // photoElement.style.boxShadow =     box-shadow: rgba(255, 255, 255, 0.8) 0 20px 30px -10px !important;
        let maxPhotoWidth = 300;



        const fadeEffect = document.createElement('div');
        fadeEffect.className = 'search-result-image';
        fadeEffect.classList.add('fade-effect-miniature-search');
        fadeEffect.appendChild(photoElement);
        fadeEffect.style.width = maxPhotoWidth + 'px'

        createParalaxMiniature(photoElement, resultDiv);

        // resultDiv.appendChild(fadeEffect);




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
        conversationDetailsDiv.style.marginLeft = '15px';



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

            if(getUserName()!=='ZALOGUJ'){
                fetch('/api/users/favourites', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                })
                    .then(response => response.text())
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



        if (searchFormContainer) {
            mainContainer.insertBefore(resultsDiv, searchFormContainer.nextSibling);
        } else {
            mainContainer.appendChild(resultsDiv);
        }


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

    paginationDiv.innerHTML = "";

    if (!data.first) {
        const prevPageButton = createPaginationButton(data.number - 1, "<", sortBy, sortOrder);
        paginationDiv.appendChild(prevPageButton);
    }

    const sidePages = 2; // Liczba stron do pokazania przed i po aktualnej stronie
    let startPage = Math.max(data.number - sidePages, 0);
    let endPage = Math.min(startPage + sidePages * 2 + 1, data.totalPages);

    if (data.number < sidePages) {
        endPage = sidePages * 2 + 1;
    }

    if (data.number > data.totalPages - sidePages - 1) {
        startPage = data.totalPages - sidePages * 2 - 1;
    }

    // Dodaj "..." jeśli istnieje luka
    if (startPage > 0) {
        paginationDiv.appendChild(createPaginationButton(0, 1, sortBy, sortOrder));
        if (startPage > 1) {
            paginationDiv.appendChild(createPaginationButton(startPage - 1, "...", sortBy, sortOrder, true));
        }
    }

    let currentPage = null;

    // Aktualne bloki stron
    for (let i = startPage; i < endPage && i < data.totalPages; i++) {
        const pageButton = createPaginationButton(i, i + 1, sortBy, sortOrder);
        if (i === data.number) {
            pageButton.disabled = true;
            pageButton.classList.add("active");
            pageButton.style.top = '-6px';
            pageButton.onmouseover = null;
            pageButton.onmouseout = null;
            currentPage = i;
        }
        paginationDiv.appendChild(pageButton);
    }

    // Dodaj "..." jeśli istnieje luka
    if (endPage < data.totalPages) {
        if (endPage < data.totalPages - 1) {
            paginationDiv.appendChild(createPaginationButton(endPage, "...", sortBy, sortOrder, true));
        }
        paginationDiv.appendChild(createPaginationButton(data.totalPages - 1, data.totalPages, sortBy, sortOrder));
    }

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

    const container = document.createElement("div");
    container.style.display = "inline-block";
    container.style.marginRight = '3px';
    container.style.position = 'relative'; // Position relative for the container
    container.style.transition = "top 0.3s ease"; // Apply transition to the 'top' property


    const button = document.createElement("button");
    button.textContent = label;

    button.style.backgroundColor = "black";
    button.style.color = "white";
    button.style.border = "1px solid darkgoldenrod";
    button.style.padding = "10px 20px";
    button.style.cursor = "pointer";
    button.style.transition = "0.3s";
    button.style.borderRadius = '15px';
    // button.style.marginRight = '3px';
    button.style.position = 'relative'; // Add position relative for hover effect


    let currentPageNumber = extractPageNumber();

    if(currentPageNumber+1 === label){
        button.style.boxShadow = '0 0 20px darkgoldenrod';
        button.style.color = 'white';
        button.style.fontSize = '18px';
        button.style.fontStyle = 'bold';
    }

    container.onmouseover = function() {
        container.style.top = '-6px';
    };
    container.onmouseout = function() {
        container.style.top = '0';
    };


    button.addEventListener("click", function () {

        formData.set("pageNumber", pageNumber);


        if (sortOrder == null) {
            sortOrder = "asc";
            sortBy = "price";
        }

        formData.set("sortBy", sortBy);
        formData.set("sortOrder", sortOrder);

        executeSearch(formData);
        setTimeout(function() {
            window.scroll({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
        }, 500);
    });
    container.appendChild(button);
    return container;
}
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

    if(getUserName()!=='ZALOGUJ'){
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
            paralaxHover();
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


    selectElement.style.color = 'gray';
        const defaultOption = document.createElement("option");
        defaultOption.setAttribute('id', 'emptyOption');
        defaultOption.value = "";
        defaultOption.style.color = 'gray';
        defaultOption.textContent = "Wybierz...";
        selectElement.appendChild(defaultOption);
    // defaultOption.selected = true; // Optional: make it selected by default

    if(options !== null) {
        options.forEach(option => {
            const optionElement = document.createElement("option");
            optionElement.value = option.name;
            optionElement.textContent = option.name;
            optionElement.style.color = 'white';
            selectElement.appendChild(optionElement);
        });
    }

    selectElement.value = "";
    selectElement.addEventListener('change', function() {
        this.style.color = this.value === "" ? 'gray' : 'white';
    });

    if (selectId === "model") {
        const emptyModelOption = document.getElementById('emptyModel');
        if (emptyModelOption) {
            selectElement.removeChild(emptyModelOption);
        }
    }
}

