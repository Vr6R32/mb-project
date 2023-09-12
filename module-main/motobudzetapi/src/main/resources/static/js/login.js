
document.addEventListener('DOMContentLoaded', function () {
    createLoginForm();
});


const createRegisterForm = () => {
    let formContainer = document.getElementById("registerFormContainer");

    formContainer.innerHTML = '';


    const submitForm = () => {
        const formData = {
            userName: document.getElementById("newusername").value,
            password: document.getElementById("password").value,
            email: document.getElementById("email").value
        };

        fetch("/api/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
            .then(response => {
                return response.text(); // Pobieramy treść ciała odpowiedzi jako tekst
            })
            .then(responseText => {
                if (responseText) {
                    const responseDiv = document.getElementById("response-message");
                    if (responseDiv) {
                        responseDiv.textContent = responseText; // Wyświetlamy treść ciała odpowiedzi na stronie
                        responseDiv.style.display = "block"; // Pokazujemy element div z odpowiedzią
                    } else {
                        console.log(responseText); // Jeśli element nie istnieje, logujemy odpowiedź
                    }
                }
            })
            .catch(error => {
                console.error("An error occurred:", error);
            });
    };


    formContainer.style.boxShadow = "0px 0px 30px darkgoldenrod";
    formContainer.style.width = "400px";
    formContainer.style.height = "500px";
    formContainer.style.borderRadius = "30px";
    formContainer.style.border = "0px dashed moccasin";


    const form = document.createElement("form");
    form.className = "form-signin";
    form.style.animation = "fade-in 1s ease-in-out forwards";

    const heading = document.createElement("h2");
    heading.className = "form-signin-heading";
    heading.textContent = "Please register in";

    const usernameLabel = document.createElement("label");
    usernameLabel.htmlFor = "username";
    usernameLabel.className = "sr-only";
    usernameLabel.textContent = "Username";

    const usernameInput = document.createElement("input");
    usernameInput.type = "text";
    usernameInput.id = "newusername";
    usernameInput.name = "username";
    usernameInput.className = "form-control";
    usernameInput.placeholder = "Username";
    usernameInput.required = true;
    usernameInput.autofocus = true;

    const passwordLabel = document.createElement("label");
    passwordLabel.htmlFor = "password";
    passwordLabel.className = "sr-only";
    passwordLabel.textContent = "Password";

    const passwordInput = document.createElement("input");
    passwordInput.type = "password";
    passwordInput.id = "password";
    passwordInput.name = "password";
    passwordInput.className = "form-control";
    passwordInput.placeholder = "Password";
    passwordInput.required = true;

    const emailLabel = document.createElement("label");
    emailLabel.htmlFor = "Email";
    emailLabel.className = "sr-only";
    emailLabel.textContent = "Email";

    const emailInput = document.createElement("input");
    emailInput.type = "text";
    emailInput.id = "email";
    emailInput.name = "email";
    emailInput.className = "form-control";
    emailInput.placeholder = "Email";
    emailInput.required = true;

    const submitButton = document.createElement("button");
    submitButton.type = "button"; // Zmiana typu na "button"
    submitButton.textContent = "Submit";
    submitButton.style.backgroundColor = "darkgoldenrod";
    submitButton.style.border = "none";
    submitButton.style.color = "black";
    submitButton.style.padding = "10px 20px";
    submitButton.style.borderRadius = "5px";
    submitButton.style.boxShadow = "0 0 20px darkgoldenrod";
    submitButton.style.transition = "background-position 0.3s ease-in-out";

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

    submitButton.addEventListener("click", submitForm); // Wywołaj funkcję submitForm po kliknięciu

    const loginLink = document.createElement("p");
    loginLink.textContent = "Masz już konto ? Zaloguj się!";
    loginLink.style.textAlign = "center";
    loginLink.style.cursor = "pointer";
    loginLink.style.marginTop = "20px";
    loginLink.style.color = "darkgoldenrod";

    loginLink.addEventListener("mouseover", function () {
        loginLink.style.textShadow = '0 0 20px darkgoldenrod';
        loginLink.style.color = "moccasin";
    });

    // Przywrócenie efektu fade po opuszczeniu przycisku
    loginLink.addEventListener("mouseout", function () {
        loginLink.style.color = "darkgoldenrod";
    });

    loginLink.addEventListener("click", createLoginForm);

    // Dodaj elementy do formularza
    form.appendChild(heading);
    form.appendChild(usernameLabel);
    form.appendChild(usernameInput);
    form.appendChild(passwordLabel);
    form.appendChild(passwordInput);
    form.appendChild(emailLabel);
    form.appendChild(emailInput);
    form.appendChild(submitButton);
    form.appendChild(loginLink);

    // Dodaj formularz do kontenera
    formContainer.appendChild(form);
};


const createLoginForm = () => {
    let formContainer = document.getElementById("registerFormContainer");

    formContainer.innerHTML = '';

    formContainer.style.boxShadow = "0px 0px 30px darkgoldenrod";
    formContainer.style.width = "400px";
    formContainer.style.height = "500px";
    formContainer.style.borderRadius = "30px";
    formContainer.style.border = "0px dashed moccasin";
    formContainer.style.animation = "fade-in 1s ease-in-out forwards";

    const form = document.createElement("form");
    form.className = "form-signin";
    form.method = "post";
    form.action = "/login";
    form.style.animation = "fade-in 1s ease-in-out forwards";

    const heading = document.createElement("h2");
    heading.className = "form-signin-heading";
    heading.textContent = "Please sign in";

    const usernameLabel = document.createElement("label");
    usernameLabel.htmlFor = "username";
    usernameLabel.className = "sr-only";
    usernameLabel.textContent = "Username";

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
    passwordLabel.textContent = "Password";

    const passwordInput = document.createElement("input");
    passwordInput.type = "password";
    passwordInput.id = "password";
    passwordInput.name = "password";
    passwordInput.className = "form-control";
    passwordInput.placeholder = "Password";
    passwordInput.required = true;

    const rememberCheckbox = document.createElement("input");
    rememberCheckbox.type = "checkbox";
    rememberCheckbox.name = "remember-me";

    const rememberLabel = document.createElement("label");
    rememberLabel.textContent = "Remember me on this computer.";

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Submit";
    submitButton.style.backgroundColor = "darkgoldenrod";
    submitButton.style.border = "none";
    submitButton.style.color = "black";
    submitButton.style.padding = "10px 20px";
    submitButton.style.borderRadius = "5px";
    submitButton.style.boxShadow = "0 0 20px darkgoldenrod";
    submitButton.style.transition = "background-position 0.3s ease-in-out";

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

    const registerLink = document.createElement("p");
    registerLink.textContent = "Nie masz jeszcze konta? Zarejestruj się!";
    registerLink.style.textAlign = "center";
    registerLink.style.cursor = "pointer";
    registerLink.style.marginTop = "20px";
    registerLink.style.color = "darkgoldenrod";

    registerLink.addEventListener("mouseover", function () {
        registerLink.style.textShadow = '0 0 20px darkgoldenrod';
        registerLink.style.color = "moccasin";
    });

    // Przywrócenie efektu fade po opuszczeniu przycisku
    registerLink.addEventListener("mouseout", function () {
        registerLink.style.color = "darkgoldenrod";
    });

    registerLink.addEventListener("click", createRegisterForm);

    form.appendChild(heading);
    form.appendChild(usernameLabel);
    form.appendChild(usernameInput);
    form.appendChild(passwordLabel);
    form.appendChild(passwordInput);
    form.appendChild(rememberCheckbox);
    form.appendChild(rememberLabel);
    form.appendChild(submitButton);
    form.appendChild(registerLink);

    formContainer.appendChild(form);

}
