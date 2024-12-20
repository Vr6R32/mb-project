let advertisementId = null;
let isMouseOverMessageIcon = false;
let advertisement = null;
let currentPhotoIndex = 0;

document.addEventListener("DOMContentLoaded", async function () {
    extractAdvertisementId();
    await fetchAdvertisement();
});
function extractAdvertisementId() {
    const urlParams = new URLSearchParams(document.location.search);
    advertisementId = urlParams.get('id');
}
function initializeUrlParameters(data) {
    let urlParams = new URLSearchParams(window.location.search);
    let editedParam = "edited";
    let createdParam = "created";
    let loggedUser = getUserName();

    if (urlParams.has(createdParam) && urlParams.get(createdParam) === "true" && loggedUser === data.user) {
        showSuccessNotification("Twoje ogłoszenie zostało utworzone pomyślnie, po szybkim procesie weryfikacji , dostaniesz informacje na adres e-mail że ogloszenie jest widoczne publicznie.");
    } else if (urlParams.has(editedParam) && urlParams.get(editedParam) === "true" && loggedUser=== data.user)  {
        showSuccessNotification("Twoje ogłoszenie zostało zmodyfikowane pomyślnie, po szybkim procesie weryfikacji , dostaniesz informacje na adres e-mail że ogloszenie jest widoczne publicznie.");
    }
}
function createHeaderTitle(advertisement, container, owner) {

    let loggedUser = getUserName();

    const titleContainer = document.createElement('div');
    titleContainer.setAttribute('id', 'titleDiv');
    titleContainer.classList.add('title-container');
    titleContainer.style.color = 'darkgoldenrod';
    titleContainer.style.textAlign = 'center'
    titleContainer.style.marginTop = '-10px';
    titleContainer.style.width = '100%';
    titleContainer.style.maxWidth = '100%';


    const titleDiv = document.createElement('div');
    titleDiv.style.display = 'grid';
    titleDiv.style.gridTemplateColumns = '1fr 2fr 1fr';
    titleDiv.style.backgroundColor = 'transparent'
    titleDiv.style.maxWidth = '100%';
    titleDiv.style.width = '100%';

    titleContainer.appendChild(titleDiv);

    const titleMidColumn = document.createElement('h2');
    titleMidColumn.style.gridColumn = '2';
    titleMidColumn.textContent = advertisement.name;
    titleMidColumn.style.fontSize = '32px';
    titleMidColumn.style.fontWeight = 'bold';
    titleMidColumn.style.maxWidth = '100%';
    titleMidColumn.style.width = '100%';

    const titleRightColumn = document.createElement('h2');
    titleRightColumn.style.gridColumn = '3';
    titleRightColumn.style.justifyContent = 'space-between';
    titleRightColumn.style.maxWidth = '100%';
    titleRightColumn.style.width = '100%';

    const heartIcon = document.createElement('img');
    heartIcon.setAttribute('id', 'hearticon');
    heartIcon.alt = 'HeartIcon';
    heartIcon.src = '/api/static/heartEmpty';


    heartIcon.addEventListener('click', () => {

        if(getUserName()===null) {
            createDialogBox('Musisz się zalogować !');
            return;
        }

        fetchWithAuth('/api/users/favourites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({userName: loggedUser, advertisementId: advertisementId}),

        })
            .then(response => {
                if (response.ok) {
                    if (heartIcon.src.endsWith('heartEmpty')) {
                        heartIcon.src = '/api/static/heartFull';
                        toolTipFavourite.textContent = 'Usuń z ulubionych';
                    } else {
                        heartIcon.src = '/api/static/heartEmpty';
                        toolTipFavourite.textContent = 'Dodaj do ulubionych';
                    }
                } else {
                    console.error('Błąd podczas wysyłania żądania POST');
                }
            })
            .catch(error => {
                console.error('Błąd sieciowy: ' + error);
            });
    });

    const messageIcon = document.createElement('img');
    messageIcon.setAttribute('id', 'msgicon');
    messageIcon.src = '/api/static/messageClosed';
    messageIcon.alt = 'MessageIcon';
    messageIcon.style.marginBottom = '3px';
    messageIcon.style.marginRight = '15px';


    messageIcon.addEventListener('mouseenter', () => {
        if (!isMouseOverMessageIcon) {
            messageIcon.src = '/api/static/messageOpen';
            messageIcon.style.cursor = 'pointer';
        }
    });

    messageIcon.addEventListener('mouseleave', () => {
        if (!isMouseOverMessageIcon) {
            messageIcon.src = '/api/static/messageClosed';
            messageIcon.style.cursor = 'auto';
        }
    });

    messageIcon.addEventListener('click', () => {
        createMessageBox(messageIcon, loggedUser);
        isMouseOverMessageIcon = true;
        messageIcon.src = '/api/static/messageOpen';
    });

    const editIcon = document.createElement('img');
    editIcon.setAttribute('id', 'editIcon');
    editIcon.src = '/api/static/editIcon';
    editIcon.alt = 'editIcon';
    editIcon.style.marginBottom = '3px';
    editIcon.style.marginRight = '15px';

    const toolTipEdit = document.createElement('span');
    toolTipEdit.textContent = 'Edytuj Ogłoszenie';
    toolTipEdit.className = 'tooltip';
    document.body.appendChild(toolTipEdit);

    const toolTipMessageSend = document.createElement('span');
    toolTipMessageSend.textContent = 'Wyślij wiadomość';
    toolTipMessageSend.className = 'tooltip';
    document.body.appendChild(toolTipMessageSend);


    const toolTipFavourite = document.createElement('span');
    toolTipFavourite.className = 'tooltip';
    document.body.appendChild(toolTipFavourite);


    editIcon.addEventListener('mouseenter', () => {
        toolTipEdit.style.display = 'block';
        editIcon.style.cursor = 'pointer';
        document.addEventListener('mousemove', updateTooltipPosition);
    });

    editIcon.addEventListener('mouseleave', () => {
        toolTipEdit.style.display = 'none';
        document.removeEventListener('mousemove', updateTooltipPosition);
    });

    heartIcon.addEventListener('mouseenter', () => {
        toolTipFavourite.style.display = 'block';
        heartIcon.style.cursor = 'pointer';
        setTooltipText(heartIcon, toolTipFavourite);
        document.addEventListener('mousemove', updateTooltipPosition);
    });

    heartIcon.addEventListener('mouseleave', () => {
        toolTipFavourite.style.display = 'none';
        document.removeEventListener('mousemove', updateTooltipPosition);
    });

    messageIcon.addEventListener('mouseenter', () => {
        toolTipMessageSend.style.display = 'block';
        editIcon.style.cursor = 'pointer';
        document.addEventListener('mousemove', updateTooltipPosition);
    });

    messageIcon.addEventListener('mouseleave', () => {
        toolTipMessageSend.style.display = 'none';
        document.removeEventListener('mousemove', updateTooltipPosition);
    });

    editIcon.addEventListener('click', () => {
        window.location.href = `/advertisement/edit?id=${advertisementId}`;
    });

    if (loggedUser !== owner) {
        titleRightColumn.appendChild(messageIcon);
        titleRightColumn.appendChild(heartIcon);
    } else {
        titleRightColumn.appendChild(editIcon);
    }


    titleDiv.appendChild(titleMidColumn);
    titleDiv.appendChild(titleRightColumn);
    let advertisementDiv = document.getElementById('advertisementResultDiv');
    advertisementDiv.insertBefore(titleContainer,advertisementDiv.firstChild);
}
function setTooltipText(heartIcon, toolTipFavourite) {
    if(heartIcon.src.includes('heartFull')){
        toolTipFavourite.textContent = 'Usuń z ulubionych';
    } else {
        toolTipFavourite.textContent = 'Dodaj do ulubionych';
    }
}
function updateHeartIconSrc() {
    const queryParams = new URLSearchParams({
        advertisementId: advertisementId,
    });

    let heartIcon = document.getElementById('hearticon');

    if(getUserName() !== null && advertisement.user !== getUserName()) {
        fetchWithAuth('/api/users/favourites?' + queryParams.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Błąd podczas pobierania ulubionego statusu');
                }
                return response.json();
            })
            .then(data => {
                if (data === true) {
                    heartIcon.src = '/api/static/heartFull';
                } else if (data === false) {
                    heartIcon.src = '/api/static/heartEmpty';
                }
            })
            .catch(error => {
                console.log(error);
                heartIcon.src = '/api/static/heartEmpty';
            });
    }


}
function createMessageBox(messageIcon, loggedUser) {

    const overlay = createSiteOverlay();
    const dialogBox = createOverlayDialogBox();

    const headerTitle = document.createElement('dialogBox');
    headerTitle.setAttribute('id', 'dialogBoxTitle');
    headerTitle.textContent = 'Napisz wiadomość do sprzedającego';
    headerTitle.style.color = 'darkgoldenrod';
    headerTitle.style.fontSize = '32px';
    headerTitle.style.fontWeight = 'bold';
    headerTitle.style.marginTop = '15px'

    const textArea = document.createElement('textarea');
    textArea.style.backgroundColor = 'transparent';
    textArea.style.color = 'white';
    textArea.style.borderRadius = '10px';
    textArea.style.width = '100%';
    textArea.style.height = '100px';
    textArea.style.width = '500px';
    textArea.style.resize = 'none';

    const sendButton = document.createElement("button");
    sendButton.textContent = 'Wyślij';
    sendButton.className = 'overlay-send-button';

    sendButton.addEventListener("mouseover", function () {
        sendButton.style.boxShadow = '0 0 20px moccasin';
        sendButton.style.color = "white";
    });

    sendButton.addEventListener("mouseout", function () {
        sendButton.style.boxShadow = '0 0 20px darkgoldenrod';
        sendButton.style.color = "black";
    });
    sendButton.addEventListener("click", function () {
        sendNewMessage(textArea.value, advertisementId);
    });
    textArea.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            sendNewMessage(textArea.value, advertisementId);
        }
    });

    if (loggedUser === 'null') {
        headerTitle.textContent = 'Musisz się zalogować !';
        dialogBox.appendChild(headerTitle);
    } else {
        dialogBox.appendChild(headerTitle);
        dialogBox.appendChild(textArea);
        dialogBox.appendChild(sendButton);
    }

    overlay.appendChild(dialogBox);

    document.body.appendChild(overlay);

    textArea.focus();


    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            document.body.removeChild(overlay);
            isMouseOverMessageIcon = false;
            messageIcon.src = '/api/static/messageClosed';
        }
    });
}
function sendNewMessage(messageValue, advertisementId) {

    const formData = new FormData();
    formData.append("message", messageValue);
    formData.append("advertisementId", advertisementId);

    if(getUserName()===null) {
        let dialogBox = document.getElementById('dialogBox');
        let dialogBoxTitle = document.getElementById('dialogBoxTitle');
        dialogBox.innerHTML = '';
        dialogBoxTitle.textContent = "Musisz się zalogować !";
        dialogBox.appendChild(dialogBoxTitle);
        return;
    }

    fetchWithAuth("/api/messages", {
        method: "POST",
        body: formData,
    })
        .then(response => {
            if (response.ok) {
                let dialogBox = document.getElementById('dialogBox');
                let dialogBoxTitle = document.getElementById('dialogBoxTitle');
                dialogBox.innerHTML = '';
                dialogBoxTitle.textContent = "Wiadomość wysłana pomyślnie.";
                dialogBox.appendChild(dialogBoxTitle);
            }
        })
        .catch(error => {
                console.log(error);
                let dialogBox = document.getElementById('dialogBox');
                let dialogBoxTitle = document.getElementById('dialogBoxTitle');
                dialogBox.innerHTML = '';
                dialogBoxTitle.textContent = "Błąd podczas wysyłania wiadomości.";
                dialogBox.appendChild(dialogBoxTitle);
        });
}
function fetchAdvertisement() {
    return fetch('/api/advertisements/' + advertisementId)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.status === "DELETED") {
                window.location = '/';
                return null;
            }
            if (data.status !== "ACTIVE" && !(getUserName() === data.user || getUserRole() === 'ROLE_ADMIN')) {
                window.location = '/';
                return null;
            }
            advertisement = data;

            const containerMain = document.getElementById('container-main');
            containerMain.style.marginBottom = '150px';

            initializeUrlParameters(data);
            createAdvertisementIndexDiv(containerMain, data);
            createHeaderTitle(data, containerMain, data.user);
            updateHeartIconSrc();
            return data;
        })
        .catch(error => {
            console.error('Błąd pobierania danych:', error);
            return null;
        });
}
function getUserRole() {
    let roleElement = document.getElementById('ROLE');
    if (roleElement) {
        return roleElement.textContent;
    }
}
function previousPhoto(mainPhoto) {
    if (currentPhotoIndex > 0) {
        currentPhotoIndex--;
    } else {
        currentPhotoIndex = advertisement.urlList.length - 1;
    }
    changePhoto(currentPhotoIndex, mainPhoto);
}
function nextPhoto(mainPhoto) {
    if (currentPhotoIndex < advertisement.urlList.length - 1) {
        currentPhotoIndex++;
    } else {
        currentPhotoIndex = 0;
    }
    changePhoto(currentPhotoIndex, mainPhoto);
}
function changePhoto(index, mainPhoto) {
    mainPhoto.src = '/api/static/photo/' + advertisement.urlList[index];
}

