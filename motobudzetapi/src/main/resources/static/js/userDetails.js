document.addEventListener('DOMContentLoaded', function () {
    createLoginForm();

});

function createLoginForm()   {
    setContainerMainStyles();

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
        event.preventDefault();

        const formData = new FormData(form);
        const data = {};

        formData.forEach((value, key) => {
            data[key] = value;
        });

        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };

        fetch(form.action, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                if (data.redirectUrl) {

                    setTimeout(function() {
                            window.location.href = data.redirectUrl;
                    }, 500);

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

    const cityLabel = createLabel("city", "Miasto");
    const cityInput = createInput("text", "city", "Miasto",form);
    const phoneLabel = createLabel("phoneNumber", "Telefon");
    const phoneInput = createInput("text", "phoneNumber", "Telefon");
    const cityStateLabel = createLabel("cityState", "Województwo");
    const cityStateInput = createInput("text", "cityState", "Województwo");
    const nameLabel = createLabel("name", "Imię");
    const nameInput = createInput("text", "name", "Imię");
    const surnameLabel = createLabel("surname", "Nazwisko");
    const surnameInput = createInput("text", "surname", "Nazwisko");

    const submitButton = createSubmitButton("Wyślij");

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
        let suggestionList = handleCitySuggestionList(input, form);
        suggestionList.style.right = '-19px';
        suggestionList.style.top = '140px';
    }


return input;
}



