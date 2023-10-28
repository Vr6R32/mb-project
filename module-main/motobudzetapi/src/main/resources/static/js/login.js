
document.addEventListener('DOMContentLoaded', function () {
    createLoginForm();
    let containerMain = document.getElementById('container-main');
    containerMain.style.minHeight = '1000px';
    containerMain.style.justifyContent = 'center';
    containerMain.style.alignItems = 'center';
    containerMain.style.backgroundColor = 'transparent';
    containerMain.style.border = '0px';
    containerMain.style.boxShadow = 'none'; // lub containerMain.style.boxShadow = '';
});

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

const createRegisterForm = () => {
    let formContainer = document.getElementById("registerFormContainer");

    formContainer.innerHTML = '';

    const addEnterKeyListener = (element)=> {
        element.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' && !document.getElementById('overlayId')) {
                event.preventDefault(); // Zapobiegaj domyślnemu zachowaniu Enter (np. przeładowanie strony)
                submitForm(); // Wywołaj funkcję submitForm
            }
        });
    }

    const submitForm = () => {
        const formData = {
            userName: document.getElementById("newusername").value,
            password: document.getElementById("password").value,
            email: document.getElementById("email").value
        };

        fetch("/api/user/register", {
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
                console.log(responseText);
                createDialogBox(responseText);
                if(responseText==='Zarejerstrowano pomyślnie !'){
                    resetForm(); // Resetuj pola formularza po pomyślnym wysłaniu
                }
            })
    };

    formContainer.style.boxShadow = "0px 0px 30px darkgoldenrod";
    formContainer.style.width = "400px";
    formContainer.style.height = "500px";
    formContainer.style.borderRadius = "30px";
    formContainer.style.border = "0px dashed moccasin";
    formContainer.style.position = 'relative';
    formContainer.style.bottom = '150px';


    const form = document.createElement("form");
    form.className = "form-signin";
    form.style.backgroundColor = 'black';
    form.style.animation = "fade-in 1s ease-in-out forwards";

    const heading = document.createElement("h2");
    heading.className = "form-signin-heading";
    heading.textContent = "Zarejerstruj się";

    const usernameLabel = document.createElement("label");
    usernameLabel.htmlFor = "username";
    usernameLabel.className = "sr-only";
    usernameLabel.textContent = "Nazwa użytkownika";

    const usernameInput = document.createElement("input");
    usernameInput.type = "text";
    usernameInput.id = "newusername";
    usernameInput.name = "username";
    usernameInput.style.width = "283px";
    usernameInput.className = "form-control";
    usernameInput.placeholder = "Username";
    usernameInput.required = true;
    usernameInput.autofocus = true;
    addEnterKeyListener(usernameInput);

    const passwordLabel = document.createElement("label");
    passwordLabel.htmlFor = "password";
    passwordLabel.className = "sr-only";
    passwordLabel.textContent = "Hasło";

    const passwordInput = document.createElement("input");
    passwordInput.setAttribute('id', 'password');
    passwordInput.type = "password";
    passwordInput.name = "password";
    passwordInput.style.width = "283px";
    passwordInput.className = "form-control";
    passwordInput.placeholder = "Password";
    passwordInput.required = true;
    addEnterKeyListener(passwordInput);


    const emailLabel = document.createElement("label");
    emailLabel.htmlFor = "Email";
    emailLabel.className = "sr-only";
    emailLabel.textContent = "Email";

    const emailInput = document.createElement("input");
    emailInput.type = "text";
    emailInput.id = "email";
    emailInput.name = "email";
    emailInput.style.width = "283px";
    emailInput.className = "form-control";
    emailInput.placeholder = "Email";
    emailInput.required = true;
    addEnterKeyListener(emailInput);

    const submitButtonDiv = document.createElement('div');
    submitButtonDiv.style.display = 'flex';
    submitButtonDiv.style.justifyContent = 'center';


    const submitButton = document.createElement("button");
    submitButton.type = "button"; // Zmiana typu na "button"
    submitButton.textContent = "Zarejerstruj";
    submitButton.style.backgroundColor = "darkgoldenrod";
    submitButton.style.border = "none";
    submitButton.style.width = "150px";
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

    submitButtonDiv.appendChild(submitButton);

    // Dodaj elementy do formularza
    form.appendChild(heading);
    form.appendChild(usernameLabel);
    form.appendChild(usernameInput);
    form.appendChild(passwordLabel);
    form.appendChild(passwordInput);
    form.appendChild(emailLabel);
    form.appendChild(emailInput);
    form.appendChild(submitButtonDiv);
    form.appendChild(loginLink);

    // Dodaj formularz do kontenera
    formContainer.appendChild(form);

    const resetForm = () => {
        document.getElementById("newusername").value = "";
        document.getElementById("password").value = "";
        document.getElementById("email").value = "";
        createLoginForm();
    };

};


function createLoginForm(){
    let formContainer = document.getElementById("registerFormContainer");

    formContainer.innerHTML = '';

    formContainer.style.boxShadow = "0px 0px 30px darkgoldenrod";
    formContainer.style.width = "400px";
    formContainer.style.height = "500px";
    formContainer.style.borderRadius = "30px";
    formContainer.style.border = "0px dashed moccasin";
    formContainer.style.animation = "fade-in 1s ease-in-out forwards";
    formContainer.style.position = 'relative';
    formContainer.style.bottom = '150px';

    const form = document.createElement("form");
    form.className = "form-signin";
    form.method = "post";
    form.style.backgroundColor = 'black';
    form.action = "/login";
    form.style.animation = "fade-in 1s ease-in-out forwards";

    const heading = document.createElement("h2");
    heading.className = "form-signin-heading";
    heading.textContent = "Zaloguj się";

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

    const checkBoxDiv = document.createElement('div');
    checkBoxDiv.style.display = 'flex';

    const rememberCheckbox = document.createElement("input");
    rememberCheckbox.type = "checkbox";
    rememberCheckbox.name = "remember-me";
    rememberCheckbox.style.marginBottom = '15px';
    rememberCheckbox.style.marginRight = '10px';

    const rememberLabel = document.createElement("label");
    rememberLabel.textContent = "Zapamiętaj mnie na tym urządzeniu.";


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

    const forgotPasswordLink = document.createElement("p");
    forgotPasswordLink.textContent = "Zapomniane hasło ? Kliknij tutaj";
    forgotPasswordLink.style.textAlign = "center";
    forgotPasswordLink.style.cursor = "pointer";
    forgotPasswordLink.style.marginTop = "20px";
    forgotPasswordLink.style.color = "darkgoldenrod";

    forgotPasswordLink.addEventListener("mouseover", function () {
        forgotPasswordLink.style.textShadow = '0 0 20px darkgoldenrod';
        forgotPasswordLink.style.color = "moccasin";
    });

    // Przywrócenie efektu fade po opuszczeniu przycisku
    forgotPasswordLink.addEventListener("mouseout", function () {
        forgotPasswordLink.style.color = "darkgoldenrod";
    });

    forgotPasswordLink.addEventListener("click", createForgotPasswordForm);

    checkBoxDiv.appendChild(rememberCheckbox);
    checkBoxDiv.appendChild(rememberLabel);

    form.appendChild(heading);
    form.appendChild(usernameLabel);
    form.appendChild(usernameInput);
    form.appendChild(passwordLabel);
    form.appendChild(passwordInput);
    form.appendChild(checkBoxDiv);
    form.appendChild(submitButton);
    form.appendChild(registerLink);
    form.appendChild(forgotPasswordLink);

    formContainer.appendChild(form);

}


function createForgotPasswordForm()  {
    let formContainer = document.getElementById("registerFormContainer");

    formContainer.innerHTML = '';

    const addEnterKeyListener = (element)=> {
        element.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' && !document.getElementById('overlayId')) {
                event.preventDefault(); // Zapobiegaj domyślnemu zachowaniu Enter (np. przeładowanie strony)
                submitForm(); // Wywołaj funkcję submitForm
            }
        });
    }

    const submitForm = () => {
        let message;
        const formData = {
            email: document.getElementById("email").value
        };

        fetch("/api/user/reset", {
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
                if(responseText==='1'){
                    message = "Na podany adres e-mail przyjdzie link resetujacy hasło."
                    resetForm(); // Resetuj pola formularza po pomyślnym wysłaniu
                } else {
                    message = "Nieprawidłowy adres e-mail";
                }
                createDialogBox(message);

            })
    }

    formContainer.style.boxShadow = "0px 0px 30px darkgoldenrod";
    formContainer.style.width = "400px";
    formContainer.style.height = "500px";
    formContainer.style.borderRadius = "30px";
    formContainer.style.border = "0px dashed moccasin";
    formContainer.style.position = 'relative';
    formContainer.style.bottom = '150px';


    const form = document.createElement("form");
    form.className = "form-signin";
    form.style.backgroundColor = 'black';
    form.style.animation = "fade-in 1s ease-in-out forwards";

    const heading = document.createElement("h2");
    heading.className = "form-signin-heading";
    heading.textContent = "Podaj swój e-mail aby zresetować hasło";

    const emailLabel = document.createElement("label");
    emailLabel.htmlFor = "Email";
    emailLabel.className = "sr-only";
    emailLabel.textContent = "Email";

    const emailInput = document.createElement("input");
    emailInput.type = "text";
    emailInput.id = "email";
    emailInput.name = "email";
    emailInput.style.width = "283px";
    emailInput.className = "form-control";
    emailInput.placeholder = "Email";
    emailInput.required = true;
    addEnterKeyListener(emailInput);

    const submitButtonDiv = document.createElement('div');
    submitButtonDiv.style.display = 'flex';
    submitButtonDiv.style.justifyContent = 'center';


    const submitButton = document.createElement("button");
    submitButton.type = "button"; // Zmiana typu na "button"
    submitButton.textContent = "Wyślij";
    submitButton.style.backgroundColor = "darkgoldenrod";
    submitButton.style.border = "none";
    submitButton.style.width = "150px";
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

    submitButtonDiv.appendChild(submitButton);

    // Dodaj elementy do formularza
    form.appendChild(heading);
    form.appendChild(emailLabel);
    form.appendChild(emailInput);
    form.appendChild(submitButtonDiv);
    form.appendChild(loginLink);
    form.appendChild(registerLink);

    // Dodaj formularz do kontenera
    formContainer.appendChild(form);

    const resetForm = () => {
        document.getElementById("email").value = "";
        createLoginForm();
    };
}