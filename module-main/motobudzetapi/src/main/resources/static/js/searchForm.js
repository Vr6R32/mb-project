let formData;
let sortBy = "price"; // Set the default sort by parameter to "price" (or any other default value you prefer)
let sortOrder = "asc"; // Set the default sort order to "asc" (ascending) or "desc" (descending) as you prefer

document.addEventListener("DOMContentLoaded", function () {
    const titleContainer = document.getElementById("title-container-hidden")

    const formContainer = document.getElementById("searchFormContainer");


// const title = document.createElement('h2');
// title.textContent = 'Wyszukaj Ogłoszenie';
//
// titleContainer.style.fontWeight = "bold"
// titleContainer.style.color = "darkgoldenrod";
// titleContainer.style.marginBottom = "20px";
// titleContainer.appendChild(title);


    const form = document.createElement("form");
    form.id = "advertisementFilterForm";
    form.style.display = "flex";
    form.style.flexWrap = "wrap";
    form.style.justifyContent = "center";
    form.style.boxSizing = "border-box";
    form.style.maxWidth = "100%";


    form.addEventListener("submit", function (event) {
        event.preventDefault();
        // Get the form data
        formData = new FormData(event.target);

        // Set the default value of pageNumber to 0 if it is not provided
        if (!formData.has("pageNumber")) {
            formData.append("pageNumber", 0);
        }

        // Get the sorting options from the form data
        sortBy = formData.get("sortBy");
        sortOrder = formData.get("sortOrder");

        // Convert the form data to URL parameters
        const searchParams = new URLSearchParams(formData);

        // Make the GET request to the API endpoint
        fetch("/api/advertisements/filter/search?" + searchParams.toString())
            .then(response => response.json())
            .then(data => displayResults(data))
            .catch(error => console.error("Error fetching data:", error));
    });


// Funkcja do tworzenia wiersza z etykietą i elementem wyboru
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
        inputElement.id = inputId;
        inputElement.name = inputName;
        inputElement.style.width = "100%"; // Szerokość pola - 100% kolumny pól
        inputElement.style.padding = "5px";
        inputElement.style.boxSizing = "border-box";
        inputElement.style.boxShadow = "0 0 10px moccasin"; // Dodanie cienia do pola input/select
        inputElement.style.border = "darkgoldenrod";
        inputElement.style.backgroundColor = "darkgrey";
        inputElement.style.maxWidth = "100%";

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

// Dodajemy formularz do kontenera
    formContainer.appendChild(form);
    formContainer.style.display = "flex";
    formContainer.style.flexWrap = "wrap";
    formContainer.style.justifyContent = "center";
    formContainer.style.boxSizing = "border-box";
    formContainer.style.maxWidth = "100%";
    formContainer.style.color = 'darkgoldenrod';

    function populateSelectOptions(options, selectId) {
        const selectElement = document.getElementById(selectId);
        // Clear existing options
        selectElement.innerHTML = `<option value="">------</option>`;
        options.forEach(option => {
            const optionElement = document.createElement("option");
            optionElement.value = option.name;
            optionElement.textContent = option.name;
            selectElement.appendChild(optionElement);
        });
    }

    function displayResults(data) {
        // This function will be responsible for displaying the results and pagination
        const resultsDiv = document.getElementById("results");

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

            // const nameContainer = document.createElement('div');
            // nameContainer.style.color = 'white'; // Dostosuj styl według potrzeb
            //
            // const nameValue = document.createElement('span');
            // nameValue.textContent = ad.name;
            //
            // nameContainer.appendChild(nameValue);


            const adImage = document.createElement("img");
            adImage.src = `/api/resources/advertisementPhoto/miniature/${ad.mainPhotoUrl}`;
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


            adDiv.appendChild(infoContainerFirst);

            resultsDiv.appendChild(adDiv);
            updatePaginationButtons(data, formData.get("sortBy"), formData.get("sortOrder"));

        });


        function createSortButton(sortBy) {
            const button = document.createElement("button");
            button.textContent = sortBy;
            button.style.marginBottom = '10px';
            button.addEventListener("click", function () {
                // Set the new sortBy parameter
                formData.set("sortBy", sortBy);
                // Check if the sortOrder parameter is already set in the form data
                const currentSortOrder = formData.get("sortOrder");
                // Set the new sortOrder parameter based on the current value
                sortOrder = sortOrder === "desc" ? "asc" : "desc";
                formData.set("sortOrder", sortOrder);

                // Call the search function with updated data
                executeSearch(formData);
            });

            return button;
        }


// Display sort buttons if there are results
        if (data.content.length > 0) {
            const sortDiv = document.createElement("div");
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


        // const adDetailsButton = document.createElement("button");
        // adDetailsButton.textContent = "View Details";
        // adDetailsButton.style.backgroundColor = "darkgoldenrod";
        // adDetailsButton.style.color = "white";
        // adDetailsButton.style.border = "none";
        // adDetailsButton.style.padding = "5px 10px";
        // adDetailsButton.style.cursor = "pointer";
        // adDetailsButton.style.marginLeft = "10px";
        // adDetailsButton.addEventListener("click", () => {
        //     // Redirect to endpoint with ad.id
        //     window.location.href = `/id/${ad.id}`;
        // });
        // adDiv.appendChild(adDetailsButton);


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


// Helper function to create pagination buttons
    function createPaginationButton(pageNumber, label, sortBy, sortOrder) {
        const button = document.createElement("button");
        button.textContent = label;
        button.addEventListener("click", function () {
            // Get the current form data
            const formData = new FormData(document.getElementById("advertisementFilterForm"));

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

    function executeSearch(formData) {
        // Get the sorting options from the form data
        const sortBy = formData.get("sortBy");
        const sortOrder = formData.get("sortOrder");

        // Remove the sortBy and sortOrder parameters from formData to avoid confusion
        formData.delete("sortBy");
        formData.delete("sortOrder");

        // Add the sorting parameters to the URLSearchParams using the global variables
        const searchParams = new URLSearchParams(formData);
        if (sortBy && sortOrder) {
            searchParams.set("sortBy", sortBy);
            searchParams.set("sortOrder", sortOrder);
        }

        // Make the GET request to the API endpoint with the sorting parameters
        fetch("/api/advertisements/filter/search?" + searchParams.toString())
            .then(response => response.json())
            .then(data => {
                // Display the results and pagination with sorting parameters
                displayResults(data, sortBy, sortOrder);
                // Update the pagination buttons
                updatePaginationButtons(data, sortBy, sortOrder);
            })
            .catch(error => console.error("Error fetching data:", error));
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


// Fetch data for select fields and populate options
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
                    modelSelect.innerHTML = `<option value="">------</option>`;
                }
            });

            // Trigger the change event to populate models initially with the default brand (empty value)
            const changeEvent = new Event("change");
            brandSelect.dispatchEvent(changeEvent);
        });
});