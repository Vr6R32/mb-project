document.addEventListener('DOMContentLoaded', async function () {
    handleLogout();
    createLoginForm();
});

function handleLogout(){
    const urlParams = new URLSearchParams(window.location.search);
    if(urlParams.get('logout') !== null){
        localStorage.clear();
    }
}

const createRegisterForm = () => {
    const addEnterKeyListener = (element)=> {
        element.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' && !document.getElementById('overlayId')) {
                event.preventDefault();
                submitForm();
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
                return response.text();
            })
            .then(responseText => {
                console.log(responseText);
                createDialogBox(responseText);
                if(responseText==='Zarejerstrowano pomyślnie !'){
                    resetForm();
                }
            })
    };

    let formContainer = document.getElementById("registerFormContainer");
    formContainer.innerHTML = '';

    const form = document.createElement("form");
    form.className = "form-signin";
    form.style.backgroundColor = 'black';
    const heading = createHeaderDiv("Zarejerstruj się");

    const usernameLabel = createUsernameLabel();

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

    const passwordLabel = createPasswordLabel();
    const passwordInput = createPasswordInput(addEnterKeyListener);

    const emailLabel = createEmailLabel();
    const emailInput = createEmailInput(addEnterKeyListener);

    const submitButtonDiv = document.createElement('div');
    submitButtonDiv.style.display = 'flex';
    submitButtonDiv.style.justifyContent = 'center';

    const submitButton = createSubmitButton("Zarejerstruj");

    submitButton.addEventListener("click", submitForm);

    const loginLink = createLoginLinkDiv();

    submitButtonDiv.appendChild(submitButton);

    form.appendChild(heading);
    form.appendChild(usernameLabel);
    form.appendChild(usernameInput);
    form.appendChild(passwordLabel);
    form.appendChild(passwordInput);
    form.appendChild(emailLabel);
    form.appendChild(emailInput);
    form.appendChild(submitButtonDiv);
    form.appendChild(loginLink);

    formContainer.appendChild(form);

    const resetForm = () => {
        document.getElementById("newusername").value = "";
        document.getElementById("password").value = "";
        document.getElementById("email").value = "";
        createLoginForm();
    };

};

function createLoginForm(){
    setContainerMainStyles();
    let formContainer = document.getElementById("registerFormContainer");
    formContainer.innerHTML = '';


    const form = document.createElement("form");
    form.className = "form-signin";
    form.style.backgroundColor = 'black';
    form.setAttribute('id', 'loginForm');


    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => { data[key] = value });

        let url = '/api/v1/auth/authenticate';

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => {
                if (response.ok) {
                    handleLoginResponse();
                } else if (response.status === 401) {
                    handleLoginResponse(true);
                } else {
                    throw new Error('Wystąpił problem z logowaniem. Proszę spróbować ponownie.');
                }
            })
    });


    const heading = createHeaderDiv("Zaloguj się");
    const usernameLabel = createUsernameLabel();
    const usernameInput = createUsernameInput();
    const passwordLabel = createPasswordLabel();
    const passwordInput = createPasswordInput();
    const submitButton = createSubmitButton("Zaloguj");
    const registerLink = createRegisterLinkDiv();
    const forgotPasswordLink = createForgotPasswordLink();

    form.appendChild(heading);
    form.appendChild(usernameLabel);
    form.appendChild(usernameInput);
    form.appendChild(passwordLabel);
    form.appendChild(passwordInput);
    form.appendChild(submitButton);
    form.appendChild(registerLink);
    form.appendChild(forgotPasswordLink);

    formContainer.appendChild(form);

}

function clearForm() {
    let form = document.getElementById('loginForm');
    Array.from(form.elements).forEach(function(input) {
        if (input.tagName === 'INPUT') {
            input.value = '';
        }
    });
}

function createForgotPasswordFormEmail()  {
    const addEnterKeyListener = (element)=> {
        element.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' && !document.getElementById('overlayId')) {
                event.preventDefault();
                submitForm();
            }
        });
    }

    const submitForm = () => {
        let message;
        const formData = {
            email: document.getElementById("email").value
        };

        fetch("/api/user/resetCode", {
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
                if(responseText==='1'){
                    message = "Na podany adres e-mail przyjdzie link resetujacy hasło."
                    resetForm();
                } else {
                    message = "Nieprawidłowy adres e-mail";
                }
                createDialogBox(message);
            })
    }

    let formContainer = document.getElementById("registerFormContainer");
    formContainer.innerHTML = '';

    const form = document.createElement("form");
    form.className = "form-signin";
    form.style.backgroundColor = 'black';

    const heading = createHeaderDiv("Podaj swój e-mail aby zresetować hasło");

    const emailLabel = createEmailLabel();
    const emailInput = createEmailInput(addEnterKeyListener);

    const submitButtonDiv = document.createElement('div');
    submitButtonDiv.style.display = 'flex';
    submitButtonDiv.style.justifyContent = 'center';

    const submitButton = createSubmitButton("Wyślij");
    submitButton.onclick = submitForm;
    submitButton.type = "button";
    const registerLink = createRegisterLinkDiv();
    const loginLink = createLoginLinkDiv();

    submitButtonDiv.appendChild(submitButton);

    form.appendChild(heading);
    form.appendChild(emailLabel);
    form.appendChild(emailInput);
    form.appendChild(submitButtonDiv);
    form.appendChild(loginLink);
    form.appendChild(registerLink);
    formContainer.appendChild(form);

    const resetForm = () => {
        document.getElementById("email").value = "";

        // createLoginForm();
    };
}