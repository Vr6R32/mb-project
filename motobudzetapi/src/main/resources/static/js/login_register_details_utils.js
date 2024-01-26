function createUsernameLabel() {
    const usernameLabel = document.createElement("label");
    usernameLabel.htmlFor = "username";
    usernameLabel.className = "sr-only";
    usernameLabel.textContent = "Nazwa użytkownika";
    return usernameLabel;
}

function createHeaderDiv(textContent) {
    const heading = document.createElement("h2");
    heading.className = "form-signin-heading";
    heading.textContent = textContent;
    return heading;
}

function createForgotPasswordLink() {
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

    forgotPasswordLink.addEventListener("mouseout", function () {
        forgotPasswordLink.style.color = "darkgoldenrod";
    });

    forgotPasswordLink.addEventListener("click", createForgotPasswordForm);
    return forgotPasswordLink;
}

function createUsernameInput() {
    const usernameInput = document.createElement("input");
    usernameInput.type = "text";
    usernameInput.id = "username";
    usernameInput.name = "username";
    usernameInput.className = "form-control";
    usernameInput.placeholder = "Username";
    usernameInput.required = true;
    usernameInput.autofocus = true;
    return usernameInput;
}

function createPasswordInput() {
    const passwordInput = document.createElement("input");
    passwordInput.type = "password";
    passwordInput.id = "password";
    passwordInput.name = "password";
    passwordInput.style.maxWidth = '283px';
    passwordInput.className = "form-control";
    passwordInput.placeholder = "Password";
    passwordInput.required = true;
    return passwordInput;
}
function createSubmitButton(buttonContent) {
    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = buttonContent;
    submitButton.className = "submitButtonStyle";

    submitButton.addEventListener("mouseover", function () {
        submitButton.style.boxShadow = '0 0 20px moccasin';
        submitButton.style.color = "white";
    });

    submitButton.addEventListener("mouseout", function () {
        submitButton.style.boxShadow = '0 0 20px darkgoldenrod';
        submitButton.style.color = "black";
    });

    submitButton.style.flexBasis = "15%";
    return submitButton;
}

function createPasswordLabel() {
    const passwordLabel = document.createElement("label");
    passwordLabel.htmlFor = "password";
    passwordLabel.className = "sr-only";
    passwordLabel.textContent = "Hasło";
    return passwordLabel;
}

function createRegisterLinkDiv() {
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

    registerLink.addEventListener("mouseout", function () {
        registerLink.style.color = "darkgoldenrod";
    });

    registerLink.addEventListener("click", createRegisterForm);
    return registerLink;
}

function createLoginLinkDiv() {
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


    loginLink.addEventListener("mouseout", function () {
        loginLink.style.color = "darkgoldenrod";
    });

    loginLink.addEventListener("click", createLoginForm);
    return loginLink;
}

function createEmailLabel() {
    const emailLabel = document.createElement("label");
    emailLabel.htmlFor = "Email";
    emailLabel.className = "sr-only";
    emailLabel.textContent = "Email";
    return emailLabel;
}

function createEmailInput(addEnterKeyListener) {
    const emailInput = document.createElement("input");
    emailInput.type = "text";
    emailInput.id = "email";
    emailInput.name = "email";
    emailInput.style.width = "283px";
    emailInput.className = "form-control";
    emailInput.placeholder = "Email";
    emailInput.required = true;
    addEnterKeyListener(emailInput);
    return emailInput;
}
function setContainerMainStyles() {
    let containerMain = document.getElementById('container-main');
    containerMain.style.minHeight = '1000px';
    containerMain.style.justifyContent = 'center';
    containerMain.style.alignItems = 'center';
    containerMain.style.backgroundColor = 'transparent';
    containerMain.style.border = '0px';
    containerMain.style.boxShadow = 'none';
}