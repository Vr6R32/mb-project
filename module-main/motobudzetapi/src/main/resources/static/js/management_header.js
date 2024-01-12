
document.addEventListener('DOMContentLoaded', function() {


    setTimeout(function() {
        if(advertisement.active === false || advertisement.deleted === true || advertisement.verified === false){
            createManagementDiv();
        }
    }, 150);

});

function createManagementDiv() {
    const containerMain = document.getElementById('container-main');
    if (containerMain) {
        const advertisementResultDiv = document.getElementById('advertisementResultDiv');
        let advertisementContainerStyle = window.getComputedStyle(advertisementResultDiv);

        const managementDiv = document.createElement('div');
        managementDiv.className = 'management';
        managementDiv.style.display = 'flex';
        managementDiv.style.flexDirection = 'column';
        managementDiv.style.justifyContent = 'center';
        managementDiv.style.alignItems = 'center';
        managementDiv.style.marginTop = '200px';
        managementDiv.style.width = '100%'; // Ensure the parent element takes the full width
        managementDiv.style.maxWidth = advertisementContainerStyle.width
        managementDiv.style.marginLeft = 'auto';
        managementDiv.style.marginRight = 'auto';
        managementDiv.style.backgroundColor = 'black';
        managementDiv.style.border = '1px solid #ccc'; // Set the border
        managementDiv.style.borderRadius = '200px';

        managementDiv.style.marginBottom = '20px';


        // Create the management header
        const managementHeader = document.createElement('div');
        managementHeader.className = 'management-header';
        managementHeader.textContent = "Panel Weryfikacji";
        managementHeader.style.width = '80%'; // Take full width
        managementHeader.style.backgroundColor = 'transparent';
        managementHeader.style.color = 'white';
        managementHeader.style.textAlign = 'center';
        managementHeader.style.padding = '10px 0';
        managementHeader.style.fontSize = '32px';
        managementHeader.style.fontWeight = 'bold';
        managementHeader.style.boxShadow = '0 2px 4px rgba(0,0,0,0.5)';

        // Append the management header to the management div
        managementDiv.appendChild(managementHeader);

        // Create the buttons container div
        const buttonsDiv = document.createElement('div');
        buttonsDiv.style.display = 'flex';
        buttonsDiv.style.justifyContent = 'center';
        buttonsDiv.style.alignItems = 'center';
        buttonsDiv.style.marginTop = '20px';
        buttonsDiv.style.marginBottom = '20px';
        buttonsDiv.style.width = '100%'; // Make sure it takes full width

        // Create the verify and reject buttons
        const verifyButton = createButton('Zatwierdź', 'verifyButton', '/api/static/successIcon');
        const rejectButton = createButton('Nie zatwierdzaj', 'rejectButton', '/api/static/rejectIcon');

        // Append buttons to the buttons container
        buttonsDiv.appendChild(verifyButton);
        buttonsDiv.appendChild(rejectButton);

        // Append the buttons container to the management div
        managementDiv.appendChild(buttonsDiv);


        containerMain.style.marginTop = '0px';


        rejectButton.addEventListener('click', function (event) {
            event.preventDefault();

            const urlParams = new URLSearchParams(window.location.search);
            const id = urlParams.get('id'); // Pobranie wartości parametru 'id'

            fetch(`/api/advertisements/reject/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (response.ok) {
                        return response.text();
                    }
                    throw new Error('Wystąpił problem z żądaniem');
                })
                .then(data => {
                    console.log('Ogłoszenie odrzucone:', data);
                })
                .catch(error => {
                    console.error('Błąd:', error);
                });
        });


        verifyButton.addEventListener('click', function (event) {
            event.preventDefault();

            const urlParams = new URLSearchParams(window.location.search);
            const id = urlParams.get('id'); // Pobranie wartości parametru 'id'

            fetch(`/api/advertisements/verify/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (response.ok) {
                        response.text().then(text => {
                            if (text === "verified !") {
                                window.location.href = '/management';
                            } else {
                                console.log("Response Text:", text);
                            }
                        });
                    }
                    throw new Error('Wystąpił problem z żądaniem');
                })
                .then(data => {
                    console.log('Ogłoszenie zweryfikowane:', data);
                })
                .catch(error => {
                    console.error('Błąd:', error);
                });
        });


        containerMain.parentNode.insertBefore(managementDiv, containerMain);

    }
}

function createButton(text, id, iconSrc) {
    const button = document.createElement('button');
    button.href = "#";
    button.id = id;
    button.style.width = '300px';
    button.style.height = '100px';
    button.style.margin = '0 10px';
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';
    button.style.position = 'relative'; // Set position for absolute positioning of the icon
    button.style.border = '1px solid #ccc'; // Set the border
    button.style.borderRadius = '10px'; // Set the border radius
    button.style.backgroundColor = 'transparent'; // Set the background to be transparent
    button.style.color = 'white';
    button.style.fontSize = 'bold';

    const icon = document.createElement('img');
    icon.src = iconSrc;
    icon.alt = 'icon';
    icon.style.height = '50px'; // Set the icon size
    if(id==='rejectButton'){
        icon.style.height = '35px'; // Set the icon size
    }
    icon.style.marginRight = '10px'; // Add some space between the icon and text

    const buttonText = document.createTextNode(text)
    button.appendChild(icon);
    button.appendChild(buttonText);

    button.addEventListener('mouseover', function() {
        button.style.cursor = 'pointer';
    });

    button.addEventListener('mouseout', function() {
        button.style.cursor = 'default';
    });

    return button;
}
