let formData = new FormData();
let sortOrder = "asc";
let sortingBy = "price";
let urlSearchParams = null;
let favouritesArray = [];
let clickedButton = "";
let lastSortTime = 0;
let isMobile = false;

document.addEventListener("DOMContentLoaded", async function () {
    await createSearchFormContainer();
    fetchAllSpecifications();
    getParametersFromCurrentUrl();
    initializeParameters();
});
document.addEventListener('click', function(event) {

    const cityInput = document.getElementById('city');
    const cityLabel = document.getElementById('citylabel');
    const cityStateInput = document.getElementById('cityState');
    const cityStateLabel = document.getElementById('cityStatelabel');
    const suggestionsList = document.getElementById('suggestionsList');

    cityInput.addEventListener('change', function() {
        if (cityInput.value === '') {
            cityStateInput.value = '';
            formData.set('cityState', '');
            cityStateInput.style.color = 'gray';
            cityStateLabel.style.color = 'darkgoldenrod';
        }
    })

    if (suggestionsList && !suggestionsList.contains(event.target)) {
        if(cityInput.value === null || cityInput.value === '') {
            cityLabel.style.color = 'darkgoldenrod';
        }
        suggestionsList.style.display = 'none';
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
            executeAdvertisementFilterResultCount();
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
        distanceFrom: "distanceFrom",
        title: "title"
    };

    for (let param in paramsMapping) {
        if (urlSearchParams.has(param)) {
            if (paramsMapping[param]) {
                let element = document.getElementById(paramsMapping[param]);
                element.value = urlSearchParams.get(param);

                let label = document.querySelector(`label[for='${paramsMapping[param]}']`);
                if (label) {
                    applyLabelColor(element, label);
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
                        applyLabelColor(fields[key], label);
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
                        let label = document.querySelector(`label[for='model']`);
                        if (label) {
                            applyLabelColor(modelSelect, label);
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

    tabs.forEach((tab, ) => {
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

function createSearchFormButton(form) {
    const searchButton = document.createElement("button");
    searchButton.setAttribute('id', 'searchButton');
    searchButton.type = "submit";
    searchButton.textContent = "Szukaj";
    searchButton.className = 'search-button';

    searchButton.addEventListener("mouseover", function () {
        searchButton.style.boxShadow = '0 0 20px moccasin';
        searchButton.style.color = "white";
    });

    searchButton.addEventListener("mouseout", function () {
        searchButton.style.boxShadow = '0 0 20px darkgoldenrod';
        searchButton.style.color = "black";
    });

    searchButton.style.flexBasis = "15%";
    form.appendChild(searchButton);
}

function handleFilterAutoResultCountFetch(form) {
    let inputs = form.querySelectorAll('input, select, textarea');
    const debounce = (func, delay) => {
        let inDebounce;
        return function () {
            const context = this;
            const args = arguments;
            clearTimeout(inDebounce);
            inDebounce = setTimeout(() => func.apply(context, args), delay);
        };
    };

    inputs.forEach(input => {
        if (input.name === 'city') {
            input.addEventListener('change', debounce(function () {
                let cityStateValue = document.getElementById('cityState');
                formData.set(input.name, input.value);
                formData.set('cityState', cityStateValue.value);
                executeAdvertisementFilterResultCount();
            }, 500));
            //     input.value = input.value.trim();
            //     formData.set(input.name, input.value);
            //     executeAdvertisementFilterResultCount();
            // }, 500));
        } else {
            input.addEventListener('input', debounce(function () {
                input.value = input.value.trim();

                formData.set(input.name, input.value);
                if (input.name === 'brand') {
                    let modelLabel = document.getElementById('modellabel');
                    modelLabel.style.color = 'darkgoldenrod';
                    formData.set("model", "");
                }
                executeAdvertisementFilterResultCount();
            }, 500));
        }
    });
}

function createSearchForm(formContainer) {
    const form = document.createElement("form");
    form.setAttribute('id', 'advertisementFilterForm');
    form.style.display = "flex";
    form.style.color = 'white';
    form.style.flexWrap = "wrap";
    form.style.justifyContent = "flex-end";
    form.style.boxSizing = "border-box";
    form.style.maxWidth = "100%";

    const driveTypesOptions = [];
    const engineTypesOptions = [];
    const fuelTypesOptions = [];
    const transmissionTypesOptions = [];
    const brandsOptions = [];
    const accidentFreeOptions = [
        { name: "Tak", value: "true" },
        { name: "Nie", value: "false" }
    ];


    if (/Mobi|Android/i.test(navigator.userAgent)) {
        isMobile = true;
        handleTabletChange({ matches: true });
    }
    function handleTabletChange(e) {
        if (e.matches) {
            form.style.flexDirection = "column";
            form.style.alignItems = "center";
        }
    }


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
    form.appendChild(createRowWithInputElement(null, "Bezwypadkowy:", "select", "accidentFree", "accidentFree",accidentFreeOptions));


    let queryWithButtonDiv = document.createElement('div');
    queryWithButtonDiv.style.display = 'flex';
    queryWithButtonDiv.style.width = '100%';
    queryWithButtonDiv.style.justifyContent = 'center';
    queryWithButtonDiv.style.alignItems = 'center';
    queryWithButtonDiv.style.marginTop = '20px';


    let queryTextInput = createRowWithInputElement("np. -> gruz drift kjs", "Filtruj po tytułach ogłoszeń", "text", "title", "title");
    queryTextInput.style.marginRight = '20px';

    queryWithButtonDiv.appendChild(queryTextInput);
    createSearchFormButton(queryWithButtonDiv);
    form.appendChild(queryWithButtonDiv);

    executeAdvertisementFilterResultCount();

    handleFilterAutoResultCountFetch(form);

    formContainer.appendChild(form);

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        formData = new FormData(event.target);
        executeSearch(formData);
    });

    let cityInput = document.getElementById('city');
    let cityStateInput = document.getElementById('cityState');

    cityInput.addEventListener("input", function() {
        cityStateInput.disabled = cityInput.value !== '';
    });

}

function executeAdvertisementFilterResultCount() {
    // Define the endpoint URL
    let url = 'api/advertisements/filter/count';

    let params = new URLSearchParams();
    for (let pair of formData.entries()) {
        params.append(pair[0], pair[1]);
    }
    if(params.toString()) {
        url += '?' + params.toString();
    }

    fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
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
function createRowWithInputElement(exampleValue,labelText, inputType, inputId, inputName, selectOptions) {
    let rowFlexBasis = '25%';
    let labelFlexBasis = '40%';
    let inputFlexBasis = '60%'

    const rowDiv = document.createElement("div");
    if(isMobile === true){
        rowFlexBasis = '100%';
        labelFlexBasis = '100%';
        inputFlexBasis = '100%';
        rowDiv.style.minWidth = '100%';
    }

    rowDiv.classList.add('searchDivElement');
    rowDiv.style.flexBasis = rowFlexBasis;
    rowDiv.style.display = "flex";
    rowDiv.style.alignItems = "center";
    rowDiv.style.marginBottom = "10px";
    rowDiv.style.maxWidth = "100%";


    const labelColumn = document.createElement("div");
    labelColumn.classList.add('searchDivLabel');
    labelColumn.style.flexBasis = labelFlexBasis;
    labelColumn.style.display = "flex";
    labelColumn.style.alignItems = "center";
    labelColumn.style.marginRight = "5px";
    labelColumn.style.marginLeft = "5px";
    labelColumn.style.maxWidth = "100%";

    const label = document.createElement("label");
    label.setAttribute("for", inputId);
    label.setAttribute("id", inputId+'label');
    label.textContent = labelText;
    label.style.width = "100%";
    label.style.textAlign = "center";
    label.style.maxWidth = "100%";
    label.style.color = 'darkgoldenrod';
    label.style.fontWeight = 'bold';
    label.style.fontSize = '17px';
    labelColumn.appendChild(label);
    rowDiv.appendChild(labelColumn);

    const inputColumn = document.createElement("div");
    inputColumn.classList.add('searchDivInput');
    inputColumn.style.flexBasis = inputFlexBasis;
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
        inputElement.setAttribute("type", "text");
        const dataList = document.createElement("datalist");
        dataList.className = "custom-datalist";
        dataList.id = dataListId;
        dataList.style.maxHeight = '300px';
        dataList.style.height = "5.1em";
        dataList.style.overflow = "hidden";
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


    if(inputId ==='title') {
        rowDiv.style.flexBasis = "40%";
        rowDiv.style.marginBottom = "0px";
    }

    if(inputId === 'accidentFree') {
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        inputElement.style.color = 'gray';
        defaultOption.textContent = "Wybierz...";
        defaultOption.selected = true;
        // defaultOption.disabled = true;
        // defaultOption.hidden = true;
        inputElement.appendChild(defaultOption);
        inputElement.addEventListener('change', function() {
            this.style.color = this.value === "" ? 'gray' : 'white';
        });
    }

    if (selectOptions) {
        selectOptions.forEach(option => {
            const optionElement = document.createElement("option");
            optionElement.value = option.value;
            optionElement.textContent = option.name;
            optionElement.style.color = 'white';
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
        suggestionsList.style.zIndex = '1000';
        suggestionsList.style.top = "100%";
        suggestionsList.style.scrollbarWidth = 'thin';
        suggestionsList.style.scrollbarColor = 'darkgoldenrod transparent';
        suggestionsList.style.WebkitScrollbar = 'thin';
        suggestionsList.style.WebkitScrollbarTrack = 'transparent';
        suggestionsList.style.WebkitScrollbarThumb = 'darkgoldenrod';
        suggestionsList.style.WebkitScrollbarThumbHover = 'goldenrod';

        suggestionsList.addEventListener('click', function (event) {
            if (event.target && event.target.nodeName === 'LI') {
                inputElement.value = event.target.textContent;
                suggestionsList.style.display = 'none';
            }
        });

        inputContainer.appendChild(inputElement);
        inputColumn.appendChild(suggestionsList);
        rowDiv.appendChild(inputContainer);

        let timeoutId;
        const debounceDelay = 200;

        inputElement.addEventListener("input", function () {
            clearTimeout(timeoutId);
            if (inputElement.value.length > 0) {
                inputElement.value = inputElement.value.charAt(0).toUpperCase() + inputElement.value.slice(1);
            }

            const partialCityName = inputElement.value;
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
    fetch("/api/users/favourites/ids")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            data.forEach(advertisementId => {
                favouritesArray.push(advertisementId);
            });
        })
        .catch(error => console.error("Error fetching data:", error));
}


function createSortParamContainer(sortDiv) {

    let sortingByView = sortingBy;

    switch (sortingBy) {
        case 'price':
            sortingByView = 'Ceny pojazdu';
            break;
        case 'mileage':
            sortingByView = 'Przebiegu pojazdu';
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
            sortingByView = 'Ceny pojazdu';
            break;
    }

    const actualSortParamTextDiv = document.createElement('div');
    actualSortParamTextDiv.textContent = (sortOrder !== 'desc' ? 'Sortowanie według ' + sortingByView + ' rosnąco ⇧' : 'Sortowanie według ' + sortingByView + ' malejąco ⇩');
    actualSortParamTextDiv.className = 'actualSortParamTextDiv';

    const sortableParams = ["price", "mileage", "engineHorsePower", "productionDate", "engineCapacity"];
    sortableParams.forEach(sortBy => {
        const sortButton = createSortButton(sortBy);
        sortDiv.appendChild(sortButton);
    });
    return actualSortParamTextDiv;
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
        mainContainer.insertBefore(resultsDiv, searchFormContainer.nextSibling);
        return;
    }

    data.content.forEach(ad => {

        const resultDiv = document.createElement("messageResultDiv");
        resultDiv.id = "messageResultDiv";
        resultDiv.style.width = "100%";
        resultDiv.style.height = "210px";
        resultDiv.style.backgroundColor =   'rgba(0, 0, 0, 1)';
        resultDiv.style.color = 'darkgoldenrod';
        resultDiv.style.marginBottom = "30px";
        resultDiv.style.padding = "10px";
        resultDiv.style.display = "flex";
        resultDiv.style.alignItems = "center";
        resultDiv.style.justifyContent = "flex-start";
        resultDiv.style.borderRadius = "30px";
        resultDiv.style.cursor = "pointer";
        resultDiv.style.maxWidth = "100%";
        resultDiv.style.fontSize = "20px";
        resultDiv.style.animation = "fade-in 1s ease-in-out forwards";

        resultDiv.onclick = (event) => {
            event.preventDefault();
            window.location.href = `/advertisement?id=${ad.id}&title=${ad.name}`;
        };
        resultDiv.addEventListener('mouseup', (event) => {
            if (event.button === 1) {
                event.preventDefault();
                window.open(`/advertisement?id=${ad.id}&title=${ad.name}`, '_blank');
            }
        });

        handleDarkModeInverse(resultDiv);

        const photoElement = document.createElement("img");
        photoElement.src = `/api/static/photo/${ad.mainPhotoUrl}`;
        photoElement.style.height = "200px";
        photoElement.style.minWidth = '250px';
        photoElement.style.objectFit = 'cover';

        createParalaxMiniature(photoElement, resultDiv);

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

        const modelBrandElement = createModelBrandDiv(ad);

        headerTitleNameDiv.appendChild(titleElement);
        headerTitleNameDiv.appendChild(modelBrandElement);

        conversationDetailsHeader.appendChild(headerTitleNameDiv);

        const priceHeader = createPriceHeader(ad);
        conversationDetailsHeader.appendChild(priceHeader);


        const conversationDetailsDiv = document.createElement("conversationDetailsDiv");
        conversationDetailsDiv.style.width = '100%';
        conversationDetailsDiv.style.flexBasis = 'auto';
        conversationDetailsDiv.style.display = 'flex-start';
        conversationDetailsDiv.style.flexDirection = 'column';
        conversationDetailsDiv.style.marginBottom = '30px';
        conversationDetailsDiv.style.marginLeft = '25px';

        const conversationDetailsMain = document.createElement("conversationDetailsMain");
        conversationDetailsMain.style.width = '90%';
        conversationDetailsMain.style.maxWidth = '90%';
        conversationDetailsMain.style.flexBasis = 'auto';
        conversationDetailsMain.style.display = 'grid';
        conversationDetailsMain.style.gridTemplateRows = 'auto 1fr auto';
        // conversationDetailsMain.style.fontFamily = '"Courier New", monospace';


        const advertisementDetails = document.createElement("conversationDetailsBottom");
        advertisementDetails.style.width = '100%';
        advertisementDetails.style.maxWidth = '100%';
        advertisementDetails.style.flexGrow = '1';
        advertisementDetails.style.flexShrink = '1';
        advertisementDetails.style.flexBasis = 'auto';
        advertisementDetails.style.display = 'flex';
        advertisementDetails.style.marginTop = '35px';
        advertisementDetails.style.marginLeft = '5%';
        advertisementDetails.style.overflow = 'auto';
        advertisementDetails.style.msOverflowStyle = 'none';
        advertisementDetails.style.scrollbarWidth = 'none';


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
        locationDetailsDiv.style.bottom = '10px';

        const locationDetails = document.createElement("div");
        locationDetails.style.color = "white";
        locationDetails.style.fontSize = "16px";
        locationDetails.style.position = 'relative';
        locationDetails.style.bottom = '-40px';
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

        favouriteIconDiv.addEventListener('mouseover', function() {
            favouriteIconDiv.style.cursor = "pointer";
            favouriteText.style.left = '-15px';
            favouriteText.style.opacity = '1';
        });
        favouriteIconDiv.addEventListener('mouseout', function() {
            favouriteIconDiv.style.cursor = "auto";
            favouriteText.style.left = '-150px';
            favouriteText.style.opacity = '0';
        });

        const favouriteText = createFavouriteTextSpan();

        favouriteWrapper.appendChild(favouriteText);
        favouriteWrapper.appendChild(favouriteIconDiv);

        const heartIcon = document.createElement('img');

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
        editIconDiv.addEventListener('click', function(event) {
            event.stopPropagation();
            window.location = '/advertisement/edit?id=' + ad.id;
        });




        if (ad.user !== getUserName()) {
            heartIcon.style.marginBottom = '2px';
            favouriteIconDiv.appendChild(heartIcon);
            favouriteBottomHeaderDiv.appendChild(favouriteWrapper);
            bottomDetailsHeader.appendChild(favouriteBottomHeaderDiv);
            if (favouritesArray.includes(ad.id)) {
                heartIcon.src = "/api/static/heartFull";
                favouriteText.innerHTML = "Usuń z ulubionych";
            } else {
                heartIcon.src = "/api/static/heartEmpty";
                favouriteText.innerHTML = "Dodaj do ulubionych";
            }
        } else if (getUserName() === ad.user) {
            editIcon.src = "/api/static/editIcon";
            editText.innerHTML = "Edytuj ogłoszenie";
            editBottomHeaderDiv.appendChild(editWrapper);
            editIcon.style.marginBottom = '2px';
            editIconDiv.appendChild(editIcon);
            bottomDetailsHeader.appendChild(editBottomHeaderDiv);
        }


        favouriteIconDiv.addEventListener('click', function(event) {
            event.stopPropagation();

            if (heartIcon.src.includes("heartFull")) {
                heartIcon.src = "/api/static/heartEmpty";
                favouriteText.innerHTML = "Dodaj do ulubionych";
            } else if (heartIcon.src.includes("heartEmpty")) {
                heartIcon.src = "/api/static/heartFull";
                favouriteText.innerHTML = "Usuń z ulubionych";
            }

            if(getUserName()!==null){
                fetch('/api/users/favourites', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ advertisementId: ad.id })
                })
                    .then(response => response.text())
                    .catch(error => {
                        console.error('Error:', error);
                    });
            } else {
                createDialogBox("Musisz się zalogować!");
            }
        });




        addContainerSpans(ad, mileageUnitValue, horsePower, productionYear, engineCapacity, advertisementDetails);

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


    if (data.content.length > 0) {
        const sortDiv = document.createElement("div");
        sortDiv.style.width = '100%';
        sortDiv.style.display = 'flex';
        sortDiv.style.justifyContent = 'center';
        sortDiv.style.alignItems = 'center';
        sortDiv.style.marginBottom = '15px'

        const actualSortParam = createSortParamContainer(sortDiv);

        resultsDiv.insertBefore(sortDiv, resultsDiv.firstChild);
        resultsDiv.insertBefore(actualSortParam, resultsDiv.firstChild);
    }

    if (data.totalPages > 1) {
        const paginationDiv = document.createElement("div");
        paginationDiv.className = "pagination";
        paginationDiv.style.width = '100%';
        paginationDiv.style.display = 'flex';
        paginationDiv.style.justifyContent = 'center';
        paginationDiv.style.alignItems = 'center';
        paginationDiv.style.marginTop = '30px';

        if (!data.first) {
            const prevPageButton = createPaginationButton(data.number - 1, "<", formData);
            paginationDiv.appendChild(prevPageButton);
        }

        for (let i = 0; i < data.totalPages; i++) {
            const pageButton = createPaginationButton(i, i + 1, formData);
            if (i === data.number) {
                pageButton.disabled = true;
                pageButton.classList.add("active");
            }
            paginationDiv.appendChild(pageButton);
        }

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

    const sidePages = 2;
    let startPage = Math.max(data.number - sidePages, 0);
    let endPage = Math.min(startPage + sidePages * 2 + 1, data.totalPages);

    if (data.number < sidePages) {
        endPage = Math.min(sidePages * 2 + 1, data.totalPages);
        startPage = 0;
    }

    if (data.number > data.totalPages - sidePages - 1) {
        startPage = Math.max(data.totalPages - sidePages * 2 - 1, 0);
        endPage = data.totalPages;
    }


    if (startPage > 0) {
        paginationDiv.appendChild(createPaginationButton(0, 1, sortBy, sortOrder));
        if (startPage > 1) {
            paginationDiv.appendChild(createPaginationButton(startPage - 1, "...", sortBy, sortOrder, true));
        }
    }

    let currentPage = null;

    for (let i = startPage; i < endPage && i < data.totalPages; i++) {
        const pageButton = createPaginationButton(i, i + 1, sortBy, sortOrder);
        if (i === data.number) {
            pageButton.disabled = true;
            pageButton.classList.add("active");
            pageButton.style.top = '-10px';
            pageButton.onmouseover = null;
            pageButton.onmouseout = null;
            currentPage = i;
        }
        paginationDiv.appendChild(pageButton);
    }

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

    let currentPageNumber = extractPageNumber();

    const paginationButtonDiv = document.createElement("div");
    paginationButtonDiv.className = "paginationButtonDiv";

    paginationButtonDiv.onmouseover = function() {
        paginationButtonDiv.style.top = '-5px';
    };
    paginationButtonDiv.onmouseout = function() {
        paginationButtonDiv.style.top = '0';
    };
    const paginationButton = document.createElement("button");
    paginationButton.textContent = label;
    paginationButton.className = "paginationButton";

    if(currentPageNumber+1 === label){
        paginationButton.style.boxShadow = '0 0 20px darkgoldenrod';
        paginationButton.style.fontSize = '34px';
    }

    paginationButton.addEventListener("click", function () {
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
    paginationButtonDiv.appendChild(paginationButton);
    return paginationButtonDiv;
}
function createSortButton(sortBy) {

    clickedButton = "";

    const sortButton = document.createElement("button");
    sortButton.className = "sortButton";

    if(extractSortParam() === sortBy){
        sortButton.style.boxShadow = '0 0 20px moccasin';
    }

    switch (sortBy) {
        case 'price':
            if(extractSortParam() === null){
                sortButton.style.boxShadow = '0 0 20px moccasin';
            }
            sortButton.textContent = 'Cena pojazdu';
            break;
        case 'mileage':
            sortButton.textContent = 'Przebieg pojazdu';
            break;
        case 'engineCapacity':
            sortButton.textContent = 'Pojemność silnika';
            break;
        case 'engineHorsePower':
            sortButton.textContent = 'Moc silnika';
            break;
        case 'productionDate':
            sortButton.textContent = 'Data produkcji';
            break;
        default:
            sortButton.textContent = 'Inny tekst';
            break;
    }

    sortButton.style.marginBottom = '20px';
    sortButton.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();

        const now = Date.now();
        if (now - lastSortTime < 650) {
            return;
        }
        lastSortTime = now;

        sortOrder = sortOrder === "desc" ? "asc" : "desc";
        formData.set("sortOrder", sortOrder);
        formData.set("sortBy", sortBy);
        formData.set("pageNumber", "0");
        clickedButton = sortButton.textContent;
        sortingBy = sortBy;
        executeSearch(formData);
    });
    return sortButton;
}
function executeSearch(formData) {

    let cityStateInput = document.getElementById('cityState');
    let cityInput = document.getElementById('city');

    if(cityStateInput && cityInput.value !== ''){
        formData.append('cityState', cityStateInput.value);
    }
    //TODO think about it ^^

    let searchParams= new URLSearchParams();
    if(getUserName()!==null){
        getUserFavourites();
    }
    formData.forEach((value, key) => {
        if (value) {
            searchParams.append(key, value);
        }
        sortingBy = formData.get("sortBy");
        sortOrder = formData.get("sortOrder");
        history.replaceState(null, null,  "?" + searchParams.toString());
    });

    fetch("/api/advertisements/filter/search?" + searchParams.toString())
        .then(response => response.json())
        .then(data => {
            displayResults(data, sortingBy, sortOrder);
            updatePaginationButtons(data, sortingBy, sortOrder);
            if(!isMobileDevice()){
                paralaxHover();
            }
        })
        .catch(error => console.error("Error fetching data:", error));
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

