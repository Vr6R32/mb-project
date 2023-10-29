
document.addEventListener("DOMContentLoaded", function () {
    createButtons();
    loadFunctionHref();
    // loadPreviousButton();
});

function loadFunctionHref(){
    let loadFunctionValue = document.getElementById("loadFunction").textContent;
    window[loadFunctionValue](loadFunctionValue);
    if (loadFunctionValue === "Wiadomosci" || loadFunctionValue === "Ulubione") {
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
    loadConversations();
}
function Ulubione(buttonName) {
    createHeader(buttonName);
    loadFavourites();
}
function Ustawienia(buttonName) {
    createHeader(buttonName);
}
function UkryjMenu(buttonName) {
    let leftContainer = document.getElementById('left-container');
    leftContainer.remove();
}

function loadUserAdvertisements(){
    fetchAdvertisements();
}

let row = 1;
let resultCount = 0;

function fetchAdvertisements(){
    let loggedUser = document.getElementById('username').textContent;
    let resultContainerRight = document.getElementById('resultContainerRight');
    fetch('/api/advertisements/user/' + loggedUser)
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('resultContainerRight');
            if (data.length === 0) {
                container.textContent = "Nie masz jeszcze żadnych ogłoszeń";
            } else {

                // resultContainerRight.style.maxHeight = "900px";
                // resultContainerRight.style.overflowY = "auto";
                // resultContainerRight.style.overflowX = "hidden";
                // resultContainerRight.style.paddingBottom = "30px"; // Dodaj dolny padding
                // resultContainerRight.style.paddingLeft = "20px"; // Dodaj dolny padding
                // resultContainerRight.style.paddingRight = "20px"; // Dodaj dolny padding
                // resultContainerRight.style.scrollbarWidth = "thin"; // Ustaw szerokość paska przewijania
                // resultContainerRight.style.scrollbarColor = "darkgoldenrod transparent"; // Ustaw kolory paska przewijania

                data.forEach(advertisementData => {
                        createUserAdvertisementsResultDiv(advertisementData,container);
                        row++;
                        resultCount++
                    });
            }
        })
        .catch(error => {
            console.error('Błąd pobierania danych:', error);
        });
}


// function createAdvertisementDetailsContainer(iconPath, altText, value) {
//     const container = document.createElement('advertisementInfoContainer');
//     container.setAttribute('id', 'advertisementInfoContainer');
//     container.style.color = 'darkgoldenrod';
//
//     const icon = document.createElement('img');
//     icon.src = `/api/resources/${iconPath}`;
//     icon.alt = altText;
//     icon.style.marginBottom = '2px';
//
//     const valueElement = document.createElement('span');
//     valueElement.textContent = value;
//
//     container.appendChild(icon);
//     container.appendChild(valueElement);
//
//     return container;
// }

function loadFavourites() {
    let loggedUser = document.getElementById('username').textContent;
    fetch('/api/users/favourites/' + loggedUser, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Błąd podczas pobierania ulubionego statusu');
            }
            return response.text(); // Odczytaj dane jako tekst
        })
        .then(data => {
            // Usuń nawiasy kwadratowe z początku i końca ciągu znaków

            data = data.slice(1, -1);
            // Podziel ciąg znaków na tablicę po przecinkach i usuń spacje
            const uuidArray = data.split(',').map(item => item.trim());

            const uuidList = [];

            uuidArray.forEach(item => {
                uuidList.push(item);
            });

            if (data.length < 1) {
                let resultContainerRight = document.getElementById('resultContainerRight');
                resultContainerRight.textContent = "Nie masz jeszcze żadnych ogłoszeń";
                return;
            }
            fetchFavouriteIds(uuidList)
        })
        .catch(error => {
            // Obsłuż błąd
            console.error('Błąd: ' + error.message);
        });
}

function fetchFavouriteIds(uuidList) {
    let loggedUser = document.getElementById('username').textContent;

    uuidList = uuidList.map(uuid => uuid.replace(/^\"|\"$/g, ''));

    fetch('/api/advertisements/favourites/' + loggedUser, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(uuidList), // Przekazujemy listę jako ciało żądania
    })
        .then(response => {
            if (!response.ok) {
                let resultContainerRight = document.getElementById('resultContainerRight');
                resultContainerRight.textContent = "Nie masz jeszcze żadnych ogłoszeń";
            }
            return response.json();
        })
        .then(data => {

            let resultContainerRight = document.getElementById('resultContainerRight');



            // resultContainerRight.style.overflowY = "auto";
            // resultContainerRight.style.overflowX = "hidden";
            // resultContainerRight.style.paddingBottom = "30px"; // Dodaj dolny padding
            // resultContainerRight.style.paddingLeft = "20px"; // Dodaj dolny padding
            // resultContainerRight.style.paddingRight = "20px"; // Dodaj dolny padding
            // resultContainerRight.style.scrollbarWidth = "thin"; // Ustaw szerokość paska przewijania
            // resultContainerRight.style.scrollbarColor = "darkgoldenrod transparent"; // Ustaw kolory paska przewijania


            data.forEach(advertisement => {
                createUserAdvertisementsResultDiv(advertisement,resultContainerRight);
                row++;
                resultCount++
            });
        })
        .catch(error => {
            // Obsłuż błąd
            console.error('Błąd: ' + error.message);
        });
}

let conversationRow = 1;

function loadConversations() {

    let url = `/api/conversations`;
    let resultContainerRight = document.getElementById("resultContainerRight");


    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            let resultCount = 0;
            if (data.length === 0) {
                resultContainerRight.textContent = "Nie znaleziono żadnych wiadomości";
            } else {
                data.forEach(conversation => {
                    const resultDiv = createResultDiv(conversation,resultContainerRight);
                    resultCount++;
                    conversationRow++
                    resultContainerRight.appendChild(resultDiv);
                });
            }
                resultContainerRight.style.maxHeight = "900px";
                // resultContainerRight.style.overflowY = "auto";
                // resultContainerRight.style.overflowX = "hidden";
                // resultContainerRight.style.paddingBottom = "30px"; // Dodaj dolny padding
                // resultContainerRight.style.paddingLeft = "20px"; // Dodaj dolny padding
                // resultContainerRight.style.paddingRight = "20px"; // Dodaj dolny padding
                // resultContainerRight.style.scrollbarWidth = "thin"; // Ustaw szerokość paska przewijania
                // resultContainerRight.style.scrollbarColor = "darkgoldenrod transparent"; // Ustaw kolory paska przewijania
        })
        .catch((error) => {
            console.error("Fetch error:", error);
        });
}


let currentRow = 1;

function fetchAdvertisementMessages(conversation,resultContainerRight,resultDiv) {

    let rightContainer = document.getElementById("rightContainer");
    rightContainer.style.color = 'darkgoldenrod';
    rightContainer.insertBefore(resultDiv,resultContainerRight);
    resultDiv.style.marginTop = '20px';
    resultDiv.style.paddingleft = '20px';
    resultDiv.style.paddingRight = '20px';
    resultContainerRight.style.paddingTop = '0px';
    resultContainerRight.style.maxHeight = "535px";


    const conversationId = conversation.conversationId;
    const url = `/api/messages?conversationId=${conversationId}`;
    let resultCount = 0;

    // let currentUrl = window.location.origin + window.location.pathname;  // Pobierz bazowy URL (bez parametrów i fragmentu)
    // let newUrl = `${currentUrl}?conversationId=` + conversationId;
    // window.history.pushState({path:newUrl}, '', newUrl);


    fetch(url)
        .then(response => response.json())
        .then(messages => {
                messages.forEach(message => {

                    createMessageContainer(message,resultContainerRight,conversation,currentRow);
                    currentRow++;
                    resultCount++;
                });

                if (resultCount > 0) {
                    resultContainerRight.style.display = 'grid';
                    resultContainerRight.style.gridTemplateColumns = '49% 1fr 1fr 49%';
                    resultContainerRight.style.overflowY = 'scroll';
                    resultContainerRight.style.overflowX = 'hidden';
                    resultContainerRight.style.paddingBottom = '30px';
                    resultContainerRight.style.paddingLeft = '20px';
                    resultContainerRight.style.paddingRight = '20px';
                    resultContainerRight.style.scrollbarWidth = 'thin';
                    resultContainerRight.style.scrollbarColor = 'darkgoldenrod transparent';


                    // Tworzenie dwóch elementów grid
                    const grid1 = document.createElement('div');
                    grid1.style.maxWidth = '100%';
                    const grid2 = document.createElement('div');
                    const grid3 = document.createElement('div');
                    const grid4 = document.createElement('div');
                    grid4.style.maxWidth = '100%';
                    grid4.style.textAlign = 'right';
                    grid4.style.justifyContent = 'flex-end'; // Wyrównujemy do prawej


                    // Dodawanie tych gridów jako dzieci do resultContainerRight
                    resultContainerRight.appendChild(grid1);
                    resultContainerRight.appendChild(grid2);
                    resultContainerRight.appendChild(grid3);
                    resultContainerRight.appendChild(grid4);
                    // Możesz dodać dodatkowe style dla grid1 i grid2 według potrzeb


                    // Teraz możesz umieszczać elementy wewnątrz grid1 i grid2
                }
                createMessageInputContainer(resultContainerRight,conversation);
                resultContainerRight.scrollTop = resultContainerRight.scrollHeight;
            }
        )
        .catch(error => {
            console.error("Wystąpił błąd podczas pobierania wiadomości:", error);
        });
}


function createHeader(buttonName){


    let headerContainer = document.getElementById("headerContainer");
    headerContainer.textContent = buttonName.replace("_", " ");
    // headerContainer.style.color = "darkgoldenrod";
    // headerContainer.style.fontWeight = "bold";
    // headerContainer.style.fontSize = "32px";
    // headerContainer.style.flexBasis = "auto";

    let hrLine = document.createElement("hr");
    hrLine.setAttribute('id', 'headerLine');

    // hrLine.style.boxShadow = "0 0 5px darkgoldenrod"; // Kolor cienia darkgoldenrod, mniejszy rozmiar
    // hrLine.style.height = "1px";
    // hrLine.style.width = "100%";
    // hrLine.style.maxWidth = "100%";
    // hrLine.style.marginLeft = "10px";
    // hrLine.style.marginRight = "10px";
    // hrLine.style.marginBottom = "5px";
    // hrLine.style.border = "none";
    // hrLine.style.borderTop = "1px solid transparent"; // Rozpoczęcie z przezroczystym kolorem
    // hrLine.style.transformOrigin = "center";
    // hrLine.style.transition = "transform 0.3s ease-in-out, border-top-color 0.3s ease-in-out"; // Dodanie przejścia zmiany koloru obramowania
    // hrLine.style.transform = "scaleX(0)"; // Ustawienie początkowej skali na 0 (ukrycie)
    // hrLine.style.flexBasis = "auto";


    headerContainer.appendChild(hrLine); // Dodanie linii do headerContainer

    cleanMessages();

    // Trigger the animation after a slight delay to ensure the element is fully added to the DOM
    setTimeout(() => {
        hrLine.style.transform = "scaleX(1)"; // Skalowanie linii do pełnej widoczności
        hrLine.style.borderTopColor = "darkgoldenrod"; // Ustawienie koloru na pożądany kolor
        // hrLine.style.backgroundImage = "linear-gradient(to left, transparent 0%, darkgoldenrod 50%, transparent 100%)"; // Efekt fade z środka w lewo
    }, 100);
}

function cleanMessages() {
    let childConversationMessageInputElement = document.getElementById('messageInputDiv');

    let childConversationResultElements = document.querySelectorAll('#rightContainer [id^="messageResultDiv"]');

    childConversationResultElements.forEach(element => {
        element.parentNode.removeChild(element);
    });

    if (childConversationMessageInputElement) {
        childConversationMessageInputElement.parentNode.removeChild(childConversationMessageInputElement);
    }

    let resultContainerRight = document.getElementById("resultContainerRight");
    resultContainerRight.innerHTML = "";

    resultContainerRight.style.display = 'flex';
}

function createButtons() {
    const leftContainer = document.getElementById('left-container');
    const buttonNames = ["Profil", "Ogloszenia", "Wiadomosci", "Ulubione", "Ustawienia" , "Ukryj_Menu"];

    buttonNames.forEach(buttonName => {
        const settingsButton = document.createElement("button");
        settingsButton.setAttribute('id', 'menuPanelButton');
        settingsButton.textContent = buttonName.replace("_", " ");
        // settingsButton.style.backgroundColor = "darkgoldenrod";
        // settingsButton.style.border = "none";
        // settingsButton.style.marginBottom = "20px";
        // settingsButton.style.width = "150px";
        // settingsButton.style.color = "black";
        // settingsButton.style.padding = "10px 20px";
        // settingsButton.style.borderRadius = "5px";
        // settingsButton.style.boxShadow = "0 0 20px darkgoldenrod";
        // settingsButton.style.transition = "background-position 0.3s ease-in-out";

        // settingsButton.addEventListener("click", function () {
        //     let lastButton = document.cookie = `lastButton=${buttonName}`;
        //     console.log(lastButton);
        // });

        settingsButton.addEventListener("mouseover", function () {
            settingsButton.style.boxShadow = '0 0 20px moccasin';
            settingsButton.style.color = "white";
        });

        settingsButton.addEventListener("mouseout", function () {
            settingsButton.style.boxShadow = '0 0 20px darkgoldenrod';
            settingsButton.style.color = "black";
        });
        settingsButton.addEventListener("click", function () {
            // window[buttonName](buttonName.toString()); // Call the corresponding function using bracket notation
            window[buttonName.replace("_", "")].call(this, buttonName.replace("_", "")); // Zamień podkreślenie na spację i wywołaj funkcję

            settingsButton.disabled = true;

            // Po 3 sekundach włącz przycisk ponownie
            setTimeout(function () {
                settingsButton.disabled = false;
            }, 2000);
        });
        leftContainer.appendChild(settingsButton);
    });
}

// function loadPreviousButton() {
//     const cookies = document.cookie.split("; "); // Pobierz wszystkie cookies i podziel na tablicę
//     let lastButton = null;
//
//     for (const cookie of cookies) {
//         const [name, value] = cookie.split("="); // Podziel nazwę i wartość cookies
//         if (name === "lastButton") {
//             lastButton = value;
//             break;
//         }
//     }
//
//     if (lastButton) {
//         window[lastButton](lastButton);
//         console.log(lastButton);
//     }
// }

