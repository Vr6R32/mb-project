let row = 1;
let conversationRow = 1;
let currentRow = 1;
document.addEventListener("DOMContentLoaded", function () {
    createButtons();
    loadFunctionHref();
});

function loadFunctionHref(){
    let loadFunctionValue = document.getElementById("loadFunction").textContent;
    window[loadFunctionValue](loadFunctionValue);
    if (loadFunctionValue === "Wiadomosci" || loadFunctionValue === "Ulubione" || loadFunctionValue === "Ogloszenia") {
        UkryjMenu();
    }
}
function Profil(buttonName) {
    createHeader(buttonName);
}
function Ogloszenia(buttonName) {
    createHeader(buttonName);
    loadUserAdvertisements();
}
function Wiadomosci(buttonName) {
    createHeader(buttonName);
    loadUserConversations();
}
function Ulubione(buttonName) {
    createHeader(buttonName);
    loadUserFavourites();
}
function Ustawienia(buttonName) {
    createHeader(buttonName);
}
function UkryjMenu() {
    let leftContainer = document.getElementById('left-container');
    leftContainer.remove();
}
function loadUserAdvertisements(){
    fetchWithAuth('/api/advertisements/all')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('resultContainerRight');
            if (data.length === 0) {
                container.textContent = "Nie masz jeszcze żadnych ogłoszeń";
            } else {
                data.forEach(advertisementData => {
                    createSingleAdvertisementResultPanelDiv(advertisementData,container);
                    row++;
                });
            }
        })
        .catch(error => {
            console.error('Błąd pobierania danych:', error);
        });
}

function loadUserFavourites() {

    fetchWithAuth('/api/users/favourites/advertisements', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            if(data.length < 1) {
                let resultContainerRight = document.getElementById('resultContainerRight');
                resultContainerRight.textContent = "Nie posiadasz jeszcze żadnych obserwowanych ogłoszeń";
            } else {
                let resultContainerRight = document.getElementById('resultContainerRight');
                data.forEach(advertisement => {
                    createSingleAdvertisementResultPanelDiv(advertisement,resultContainerRight);
                    row++;
                });
            }
        })
        .catch(error => {
            console.error('Błąd: ' + error.message);
        });
}
function loadUserConversations() {

    let resultContainerRight = document.getElementById("resultContainerRight");

    fetchWithAuth(`/api/conversations`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            if (data.length === 0) {
                resultContainerRight.textContent = "Nie posiadasz jeszcze żadnych konwersacji";
            } else {
                data.forEach(conversation => {
                    const resultDiv = createConversationResults(conversation,resultContainerRight);
                    conversationRow++
                    resultContainerRight.appendChild(resultDiv);
                });
            }
        })
        .catch((error) => {
            console.error("Fetch error:", error);
        });
}

function setStylesForMessagingPanel(resultContainerRight) {
    resultContainerRight.style.display = 'grid';
    resultContainerRight.style.gridTemplateColumns = '49% 1fr 1fr 49%';
    resultContainerRight.style.overflowY = 'scroll';
    resultContainerRight.style.overflowX = 'hidden';
    resultContainerRight.style.paddingBottom = '30px';
    resultContainerRight.style.paddingLeft = '20px';
    resultContainerRight.style.paddingRight = '20px';
    resultContainerRight.style.scrollbarWidth = 'thin';
    resultContainerRight.style.scrollbarColor = 'darkgoldenrod transparent';
    const grid1 = document.createElement('div');
    const grid2 = document.createElement('div');
    const grid3 = document.createElement('div');
    const grid4 = document.createElement('div')
    grid1.style.maxWidth = '100%';
    grid1.style.textAlign = 'left';
    grid1.style.justifyContent = 'flex-start';
    grid4.style.maxWidth = '100%';
    grid4.style.textAlign = 'right';
    grid4.style.justifyContent = 'flex-end';
    resultContainerRight.appendChild(grid1);
    resultContainerRight.appendChild(grid2);
    resultContainerRight.appendChild(grid3);
    resultContainerRight.appendChild(grid4);
}

function fetchConversationMessages(conversation, resultContainerRight, resultDiv) {

    let rightContainer = document.getElementById("rightContainer");
    rightContainer.style.color = 'darkgoldenrod';
    rightContainer.insertBefore(resultDiv,resultContainerRight);
    resultDiv.style.marginTop = '20px';
    resultDiv.style.paddingleft = '20px';
    resultDiv.style.paddingRight = '20px';
    let conversationResultDiv = document.getElementById('messageResultDiv');
    conversationResultDiv.style.marginTop = '60px';
    resultDiv.onmouseover = () => {
        resultDiv.style.boxShadow = "0 0 20px cyan";
        resultDiv.style.cursor = 'pointer';
    };
    resultDiv.onclick = () => {
        window.location.href = `/advertisement?id=${conversation.advertisement.id}` + '&title=' + conversation.advertisement.name;
    };
    resultContainerRight.style.marginTop = '0px';
    resultContainerRight.style.paddingTop = '0px';
    resultContainerRight.style.maxHeight = "535px";
    const conversationId = conversation.conversationId;
    const url = `/api/messages?conversationId=${conversationId}`;

    fetchWithAuth(url)
        .then(response => response.json())
        .then(messages => {
                messages.forEach(message => {
                    createSingleMessageContainer(message,resultContainerRight,conversation,currentRow);
                    currentRow++;
                });
            setStylesForMessagingPanel(resultContainerRight);
            createMessageInputContainer(resultContainerRight,conversation);
                resultContainerRight.scrollTop = resultContainerRight.scrollHeight;
            }
        )
        .catch(error => {
            console.error("Wystąpił błąd podczas pobierania wiadomości:", error);
        })
}
function createButtons() {
    const leftContainer = document.getElementById('left-container');
    const buttonNames = ["Profil", "Ogloszenia", "Wiadomosci", "Ulubione", "Ustawienia" , "Ukryj_Menu"];

    buttonNames.forEach(buttonName => {
        const settingsButton = document.createElement("button");
        settingsButton.setAttribute('id', 'menuPanelButton');
        settingsButton.textContent = buttonName.replace("_", " ");

        settingsButton.addEventListener("mouseover", function () {
            settingsButton.style.boxShadow = '0 0 20px moccasin';
            settingsButton.style.color = "white";
        });

        settingsButton.addEventListener("mouseout", function () {
            settingsButton.style.boxShadow = '0 0 20px darkgoldenrod';
            settingsButton.style.color = "black";
        });
        settingsButton.addEventListener("click", function () {
            window[buttonName.replace("_", "")].call(this, buttonName.replace("_", ""));
        });
        leftContainer.appendChild(settingsButton);
    });
}

