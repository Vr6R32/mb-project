let resetCode = null;
document.addEventListener('DOMContentLoaded', function () {

    let urlParams = new URLSearchParams(window.location.search);

    // if (urlParams.has("resetPassword") && urlParams.get("resetPassword") === "true" && urlParams.has("resetCode")){
    //     console.log(urlParams.get("resetPassword"));
    //     console.log(urlParams.get("resetCode"));
    // }

    if (urlParams.has("code")){
        resetCode = urlParams.get("code");
        createForgotPasswordForm();
    } else {
        window.location = '/';
    }

    let containerMain = document.getElementById('container-main');
    containerMain.style.minHeight = '1000px';
    containerMain.style.justifyContent = 'center';
    containerMain.style.alignItems = 'center';
    containerMain.style.backgroundColor = 'transparent';
    containerMain.style.border = '0px';
    containerMain.style.boxShadow = 'none'; // lub containerMain.style.boxShadow = '';



});

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
        let password = document.getElementById("password").value;
        let passwordRepeat = document.getElementById("passwordRepeat").value;

        if (password !== passwordRepeat) {
            createDialogBox("Hasła nie są takie same!");
        }
        let message;

        const formData = {
            password: password,
            passwordRepeat: passwordRepeat,
            resetCode: resetCode
        };

        fetch("/api/user/resetPassword", {
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
                    message = "Twoje hasło zostało zaktualizowane :)"
                    resetForm(); // Resetuj pola formularza po pomyślnym wysłaniu
                } else {
                    message = "Coś poszło nie tak :(";
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
    heading.textContent = "Podaj swoje nowe hasło";

    const password = document.createElement("label");
    password.htmlFor = "Password";
    password.className = "sr-only";
    password.textContent = "Password";

    const passwordInput = document.createElement("input");
    passwordInput.type = "password";
    passwordInput.id = "password";
    passwordInput.name = "password";
    passwordInput.style.width = "283px";
    passwordInput.className = "form-control";
    passwordInput.placeholder = "Password";
    passwordInput.required = true;
    addEnterKeyListener(passwordInput);

    const passwordLabel = document.createElement("label");
    passwordLabel.htmlFor = "Password";
    passwordLabel.className = "sr-only";
    passwordLabel.textContent = "Nowe hasło";

    const passwordRepeat = document.createElement("label");
    passwordRepeat.htmlFor = "PasswordRepeat";
    passwordRepeat.className = "sr-only";
    passwordRepeat.textContent = "PasswordRepeat";

    const passwordRepeatInput = document.createElement("input");
    passwordRepeatInput.type = "password";
    passwordRepeatInput.id = "passwordRepeat";
    passwordRepeatInput.name = "password";
    passwordRepeatInput.style.width = "283px";
    passwordRepeatInput.className = "form-control";
    passwordRepeatInput.placeholder = "Password";
    passwordRepeatInput.required = true;
    addEnterKeyListener(passwordRepeatInput);

    const passwordRepeatLabel = document.createElement("label");
    passwordRepeatLabel.htmlFor = "Password";
    passwordRepeatLabel.className = "sr-only";
    passwordRepeatLabel.textContent = "Powtórz nowe hasło";

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

    submitButtonDiv.appendChild(submitButton);

    // Dodaj elementy do formularza
    form.appendChild(heading);
    form.appendChild(passwordLabel);
    form.appendChild(passwordInput);
    form.appendChild(passwordRepeatLabel);
    form.appendChild(passwordRepeatInput);
    form.appendChild(submitButtonDiv);

    // Dodaj formularz do kontenera
    formContainer.appendChild(form);

    const resetForm = () => {
        document.getElementById("password").value = "";
        document.getElementById("passwordRepeat").value = "";
    };
}