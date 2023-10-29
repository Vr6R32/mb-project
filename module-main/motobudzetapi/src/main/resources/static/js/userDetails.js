document.addEventListener('DOMContentLoaded', function () {
    createLoginForm();
});


function createLoginForm()   {

    let containerMain = document.getElementById('container-main');
    containerMain.style.minHeight = '1000px';
    containerMain.style.justifyContent = 'center';
    containerMain.style.alignItems = 'center';
    containerMain.style.backgroundColor = 'transparent';
    containerMain.style.border = '0px';
    containerMain.style.boxShadow = 'none'; // lub containerMain.style.boxShadow = '';

    let formContainer = document.getElementById("userDetailsForm");

    formContainer.innerHTML = '';

    formContainer.style.boxShadow = "0px 0px 30px darkgoldenrod";
    formContainer.style.width = "400px";
    formContainer.style.height = "700px";
    formContainer.style.borderRadius = "30px";
    formContainer.style.border = "0px dashed moccasin";
    formContainer.style.animation = "fade-in 1s ease-in-out forwards";
    formContainer.style.position = 'relative';
    formContainer.style.bottom = '150px';
    formContainer.style.height = "auto";
    formContainer.style.width = "auto";

    const form = document.createElement("form");
    form.setAttribute('id','detailsForm');
    form.className = "form-signin";
    form.style.backgroundColor = 'black';
    form.action = "/api/user/updateDetails";
    form.style.animation = "fade-in 1s ease-in-out forwards";
    form.style.display = "flex";
    form.style.flexDirection = "column";
    form.style.justifyContent = "center";
    form.style.alignItems = "center";

    form.addEventListener('submit', function (event) {
        event.preventDefault();  // Zapobiegaj domyślnemu zachowaniu submit

        const formData = new FormData(form);  // Pobieraj dane z formularza
        const data = {};

        formData.forEach((value, key) => {
            data[key] = value;
        });

        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)  // Przekształć dane formularza na JSON
        };

        // fetch(form.action, requestOptions)
        //     .then(response => response.json())
        //     .then(data => {
        //         console.log('Success:', data);
        //         window.location.href = data.redirectUrl;
        //     })
        //     .catch((error) => {
        //         console.error('Error:', error);
        //     });


        fetch(form.action, requestOptions)
            .then(response => response.text())  // Get the response as text
            .then(text => {
                console.log('Success:', text);
                if (text === "/?activation=true") {
                    window.location.href = text;
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });

    const inputs = form.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.style.marginTop = "10px";
        input.style.marginBottom = "10px";
    });

    const heading = document.createElement("h2");
    heading.className = "form-signin-heading";
    heading.textContent = "Uzupełnij swoje dane kontaktowe";

    // City
    const cityLabel = createLabel("city", "Miasto");
    const cityInput = createInput("text", "city", "Miasto",form);

    // Phone Number
    const phoneLabel = createLabel("phoneNumber", "Telefon");
    const phoneInput = createInput("text", "phoneNumber", "Telefon");

    // City State
    const cityStateLabel = createLabel("cityState", "Województwo");
    const cityStateInput = createInput("text", "cityState", "Województwo");

    // Name
    const nameLabel = createLabel("name", "Imię");
    const nameInput = createInput("text", "name", "Imię");

    // Surname
    const surnameLabel = createLabel("surname", "Nazwisko");
    const surnameInput = createInput("text", "surname", "Nazwisko");


    const usernameLabel = document.createElement("label");
    usernameLabel.htmlFor = "username";
    usernameLabel.className = "sr-only";
    usernameLabel.textContent = "Nazwa użytkownika";

    const usernameInput = document.createElement("input");
    usernameInput.type = "text";
    usernameInput.id = "username";
    usernameInput.name = "username";
    usernameInput.className = "form-control";
    usernameInput.placeholder = "Username";
    usernameInput.required = true;
    usernameInput.autofocus = true;

    const passwordLabel = document.createElement("label");
    passwordLabel.htmlFor = "password";
    passwordLabel.className = "sr-only";
    passwordLabel.textContent = "Hasło";

    const passwordInput = document.createElement("input");
    passwordInput.type = "password";
    passwordInput.id = "password";
    passwordInput.name = "password";
    passwordInput.className = "form-control";
    passwordInput.placeholder = "Password";
    passwordInput.required = true;


    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Zaloguj";
    submitButton.style.backgroundColor = "darkgoldenrod";
    submitButton.style.border = "none";
    submitButton.style.width = "150px";
    submitButton.style.margin = "auto";
    submitButton.style.display = "block";
    submitButton.style.color = "black";
    submitButton.style.padding = "10px 20px";
    submitButton.style.borderRadius = "5px";
    submitButton.style.boxShadow = "0 0 20px darkgoldenrod";
    submitButton.style.transition = "background-position 0.3s ease-in-out";
    submitButton.style.marginRight = "auto";


    submitButton.addEventListener("mouseover", function () {
        submitButton.style.boxShadow = '0 0 20px moccasin';
        submitButton.style.color = "white";
    });

    // Przywrócenie efektu fade po opuszczeniu przycisku
    submitButton.addEventListener("mouseout", function () {
        submitButton.style.boxShadow = '0 0 20px darkgoldenrod';
        submitButton.style.color = "black";
    });

    submitButton.style.flexBasis = "15%"; // Przycisk na 100% szerokości czterech kolumn

    form.appendChild(heading);
    form.appendChild(cityLabel);
    form.appendChild(cityInput);
    form.appendChild(cityStateLabel);
    form.appendChild(cityStateInput);
    form.appendChild(phoneLabel);
    form.appendChild(phoneInput);
    form.appendChild(nameLabel);
    form.appendChild(nameInput);
    form.appendChild(surnameLabel);
    form.appendChild(surnameInput);
    form.appendChild(submitButton);
    formContainer.appendChild(form);

}
function createLabel(forId, textContent) {
    const label = document.createElement("label");
    label.htmlFor = forId;
    label.className = "sr-only";
    label.textContent = textContent;
    return label;
}

function createInput(type, id, placeholder,form) {
    const input = document.createElement("input");
    input.type = type;
    input.id = id;
    input.name = id;
    input.className = "form-control";
    input.placeholder = placeholder;
    input.required = true;

    if(id === 'city') {

    const inputContainer = document.createElement("div");
    inputContainer.style.position = "relative"; // Ustawiamy pozycję na "relative", aby umożliwić pozycjonowanie względem tego kontenera
    inputContainer.setAttribute('autocomplete', 'off');


    input.style.position = 'relative';
    input.setAttribute('autocomplete', 'off');

    const suggestionsList = document.createElement('ul');

    suggestionsList.style.right = '-19px';
    suggestionsList.style.top = '140px';

    // suggestionsList.style.top = 'calc(100% + 5px)'; // Dodaje 5px marginesu pomiędzy polem input a listą sugestii


    suggestionsList.id = 'suggestionsList';
    suggestionsList.setAttribute('autocomplete', 'off');
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
    // suggestionsList.style.top = "100%";

    suggestionsList.style.scrollbarWidth = 'thin';
    suggestionsList.style.scrollbarColor = 'darkgoldenrod transparent';
    suggestionsList.style.WebkitScrollbar = 'thin';
    suggestionsList.style.WebkitScrollbarTrack = 'transparent';
    suggestionsList.style.WebkitScrollbarThumb = 'darkgoldenrod';
    suggestionsList.style.WebkitScrollbarThumbHover = 'goldenrod';


    // Dodaj obsługę kliknięcia na propozycję miasta
    suggestionsList.addEventListener('click', function (event) {
        if (event.target && event.target.nodeName === 'LI') {
            input.value = event.target.textContent;
            suggestionsList.style.display = 'none';
        }
    });

    // Dodaj listę propozycji do pola miasta
    inputContainer.appendChild(input);
    inputContainer.appendChild(suggestionsList);
    form.appendChild(inputContainer);

    // Obsługa wprowadzania tekstu w polu miasta
    let timeoutId;
    const debounceDelay = 200;

    input.addEventListener("input", function () {
        // Anuluje poprzednie żądanie, jeśli istnieje
        clearTimeout(timeoutId);

        // Pobiera częściową nazwę miasta wprowadzoną przez użytkownika
        const partialCityName = input.value;

        // Ustawia nowe opóźnienie
        timeoutId = setTimeout(function () {
            // Wykonuje żądanie do backendu REST API, przesyłając częściową nazwę miasta
            fetch(`/api/cities?partialName=${partialCityName}`)
                .then(response => response.json())
                .then(data => {
                    // Aktualizuje listę propozycji miast na podstawie odpowiedzi od serwera
                    updateCitySuggestions(data); // przekazujemy listę sugestii jako drugi argument
                })
                .catch(error => {
                    console.error("Błąd podczas pobierania propozycji miast:", error);
                });
        }, debounceDelay);
    });
}


return input;
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

