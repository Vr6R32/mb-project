let resetCode = null;
document.addEventListener('DOMContentLoaded', function () {

    let urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has("code")) {
        resetCode = urlParams.get("code");
        createForgotPasswordForm();
    } else {
        window.location = '/';
    }

    setContainerMainStyles();
});

function createForgotPasswordForm() {

    const addEnterKeyListener = (element) => {
        element.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' && !document.getElementById('overlayId')) {
                event.preventDefault();
                submitForm();
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
                return response.text();
            })
            .then(responseText => {
                if (responseText === '1') {
                    message = "Twoje hasło zostało zaktualizowane :)"
                    resetForm();
                    setTimeout(function () {
                        window.location = '/';
                    }, 1000);
                } else {
                    message = "Coś poszło nie tak :(";
                }
                createDialogBox(message);
            })
    }

    let formContainer = document.getElementById("registerFormContainer");
    formContainer.innerHTML = '';


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

    const passwordInput = createPasswordInput(addEnterKeyListener);

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


    const submitButton = createSubmitButton("Wyślij");
    submitButton.addEventListener("click", submitForm);



    submitButtonDiv.appendChild(submitButton);

    form.appendChild(heading);
    form.appendChild(passwordLabel);
    form.appendChild(passwordInput);
    form.appendChild(passwordRepeatLabel);
    form.appendChild(passwordRepeatInput);
    form.appendChild(submitButtonDiv);

    formContainer.appendChild(form);

    const resetForm = () => {
        document.getElementById("password").value = "";
        document.getElementById("passwordRepeat").value = "";
    };
}