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

        executeSearch(formData,null);

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
    inputElement.style.border = "none"; // Usunięcie ramki
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


    // Display each advertisement result
    data.content.forEach(ad => {
        const adDiv = document.createElement("div");
        adDiv.style.width = "100%";
        adDiv.style.height = "200px";
        adDiv.style.backgroundColor = "#181818";
        // adDiv.style.backgroundColor = "black";
        adDiv.style.marginBottom = "20px";
        adDiv.style.padding = "10px";
        adDiv.style.display = "flex";
        adDiv.style.alignItems = "center";
        adDiv.style.justifyContent = "flex-start";
        adDiv.style.borderRadius = "30px"; // Add rounded corners
        adDiv.style.boxShadow = "0 0 40px darkgoldenrod"; // Add initial box shadow
        adDiv.style.cursor = "pointer"; // Change cursor to pointer on hover
        adDiv.style.maxWidth = "100%";
        adDiv.style.opacity = 0; // Set initial opacity to 0
        adDiv.style.animation = "fade-in 1s ease-in-out forwards";

        // Set the onclick event to redirect to the /id/{ad.id} endpoint
        adDiv.onclick = () => {
            window.location.href = `/id/${ad.id}`;
        };

        // Add hover effect on mouseover
        adDiv.onmouseover = () => {
            adDiv.style.boxShadow = "0 0 20px moccasin";
        };

        // Remove hover effect on mouseout
        adDiv.onmouseout = () => {
            adDiv.style.boxShadow = "0 0 40px darkgoldenrod";
        };


        const adImage = document.createElement("img");
        adImage.src = `/api/resources/advertisementPhoto/${ad.mainPhotoUrl}`;
        adImage.style.height = "200px";
        adImage.style.width = "150px";
        adImage.style.objectFit = "cover";

        const fadeEffect = document.createElement('div');
        fadeEffect.classList.add('fade-effect-miniature-search');
        fadeEffect.appendChild(adImage);

        adDiv.appendChild(fadeEffect);

        const infoContainerFirst = document.createElement('div');
        infoContainerFirst.style.display = 'flex';
        infoContainerFirst.style.alignItems = 'flex-start'; // Dla umieszczenia po lewej stronie
        infoContainerFirst.style.color = 'darkgoldenrod';
        // infoContainerFirst.style.maxWidth = '100%';
        // infoContainerFirst.style.display = 'grid';
        // infoContainerFirst.style.gridTemplateColumns = '1fr 1fr 1fr'; // Trzy kolumny
        // infoContainerFirst.style.gridGap = '10px'; // Odstęp między elementami


        const containers = [
            createInfoContainer('mileage', 'MileageIcon', ad.mileage),
            createInfoContainer('productionDate', 'ProductionDateIcon', ad.productionDate),
            createInfoContainer('fuelType', 'FuelTypeIcon', ad.fuelType),
            createInfoContainer('engineHorsePower', 'EngineIcon', ad.engineHorsePower + ' HP'),
        ];

        // Dodawanie kontenerów do infoContainerFirst
        containers.forEach(container => {
            infoContainerFirst.appendChild(container);
        });

        if (ad.fuelType !== 'ELEKTRYCZNY') {
            containers.push(
                createInfoContainer('engineType/' + ad.engineType, 'transmissionIcon', ad.engineType),
                createInfoContainer('transmissionType/' + ad.transmissionType, 'transmissionIcon', ad.transmissionType)
            );
        }

        containers.forEach(container => {
            infoContainerFirst.appendChild(container);
        });

        const maxTextWidth = Math.max(
            ...containers.map(container => container.querySelector('span').offsetWidth)
        );

        // Ustaw taką samą szerokość dla wszystkich kontenerów
        containers.forEach(container => {
            container.style.width = maxTextWidth + '65px';
        });

        adDiv.appendChild(infoContainerFirst);

        resultsDiv.appendChild(adDiv);
        const searchFormContainer = document.getElementById('searchFormContainer');

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
            const prevPageButton = createPaginationButton(data.number - 1, "Previous", formData);
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
            const nextPageButton = createPaginationButton(data.number + 1, "Next", formData);
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
        const prevPageButton = createPaginationButton(data.number - 1, "Previous", sortBy, sortOrder);
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
        const nextPageButton = createPaginationButton(data.number + 1, "Next", sortBy, sortOrder);
        paginationDiv.appendChild(nextPageButton);
    }
}

function createPaginationButton(pageNumber, label, sortBy, sortOrder) {
    const button = document.createElement("button");
    button.textContent = label;


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

    switch (sortBy) {
        case 'price':
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
            button.textContent = 'Data produkcji' + (sortOrder === 'asc' ? ' 🢁' : ' 🢃');
            break;
        default:
            button.textContent = 'Inny tekst';
            break;
    }

    clickedButton = "";

    button.style.marginBottom = '10px';
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
