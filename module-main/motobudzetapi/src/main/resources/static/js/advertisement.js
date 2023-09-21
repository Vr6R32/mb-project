const currentURL = window.location.href;
const advertisementId = extractAdvertisementId(currentURL);
let isMouseOverMessageIcon = false; // Zmienna flagi
let advertisement = null;
let currentPhotoIndex = 0;
document.addEventListener("DOMContentLoaded", function () {
        fetchAdvertisement();
});

function extractAdvertisementId(currentURL) {
    const urlParts = currentURL.split('/');
    return urlParts[urlParts.length - 1];
}

function createHeaderTitle(advertisement,container,owner) {

        let loggedUser = document.getElementById('username').textContent;



        const titleContainer = document.createElement('div');
        titleContainer.setAttribute('id', 'titleDiv');
        titleContainer.classList.add('title-container');
        titleContainer.style.color = 'darkgoldenrod';
        titleContainer.style.textAlign = 'center'
        titleContainer.style.marginTop = '-30px'; // Przesunięcie o 10 pikseli w górę


        const titleDiv = document.createElement('div');
        titleDiv.style.display = 'grid'; // Ustawiamy wyświetlanie jako siatka (grid)
        titleDiv.style.gridTemplateColumns = '1fr 2fr 1fr'; // Tworzymy trzy kolumny o równych szerokościach

        titleContainer.appendChild(titleDiv);

        const titleMidColumn = document.createElement('h2');
        titleMidColumn.style.gridColumn = '2';
        titleMidColumn.textContent = advertisement.name;
        titleMidColumn.style.fontSize = '32px';
        titleMidColumn.style.fontWeight = 'bold';

        const titleRightColumn = document.createElement('h2');
        titleRightColumn.style.gridColumn = '3';
        titleRightColumn.style.justifyContent = 'space-between';

        const heartIcon = document.createElement('img');
        heartIcon.setAttribute('id', 'hearticon');
        heartIcon.alt = 'HeartIcon';
        updateHeartIconSrc(loggedUser,heartIcon);


    heartIcon.addEventListener('click', () => {
        // Wyślij żądanie POST na adres "api/users/favourites"

        fetch('/api/users/favourites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Ustaw nagłówek na JSON, jeśli wymagane
            },
            body: JSON.stringify({ userName: loggedUser, advertisementId: advertisementId }),

        })
            .then(response => {
                if (response.ok) {
                    if (heartIcon.src.endsWith('heartEmpty')) {
                        heartIcon.src = '/api/resources/heartFull';
                    } else {
                        heartIcon.src = '/api/resources/heartEmpty';
                    }
                } else {
                    // Obsłuż błąd, np. wyświetl komunikat dla użytkownika
                    console.error('Błąd podczas wysyłania żądania POST');
                }
            })
            .catch(error => {
                // Obsłuż błąd sieciowy
                console.error('Błąd sieciowy: ' + error);
            });
    });

        const messageIcon = document.createElement('img');
        messageIcon.setAttribute('id', 'msgicon');
        messageIcon.src = '/api/resources/messageClosed';
        messageIcon.alt = 'MessageIcon';
        messageIcon.style.marginBottom = '3px';
        messageIcon.style.marginRight = '15px';


        messageIcon.addEventListener('mouseenter', () => {
                if (!isMouseOverMessageIcon) {
                        messageIcon.src = '/api/resources/messageOpen';
                        messageIcon.style.cursor = 'pointer';
                }
        });

        messageIcon.addEventListener('mouseleave', () => {
                if (!isMouseOverMessageIcon) {
                        messageIcon.src = '/api/resources/messageClosed';
                        messageIcon.style.cursor = 'auto';
                }
        });

        messageIcon.addEventListener('click', () => {
                createMessageBox(messageIcon,loggedUser);
                isMouseOverMessageIcon = true; // Zablokuj działanie mouseleave
                messageIcon.src = '/api/resources/messageOpen';
        });



        if (loggedUser!==owner){
            titleRightColumn.appendChild(messageIcon);
            titleRightColumn.appendChild(heartIcon);
        }

        titleDiv.appendChild(titleMidColumn);
        titleDiv.appendChild(titleRightColumn);
        container.appendChild(titleContainer);
}


function updateHeartIconSrc(loggedUser, heartIcon) {
    const queryParams = new URLSearchParams({
        userName: loggedUser,
        advertisementId: advertisementId,
    });

    fetch('/api/users/favourites?' + queryParams.toString(), {
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
            if (data.toString() === "true") {
                heartIcon.src = '/api/resources/heartFull';
            } else if (data.toString() === "false") {
                heartIcon.src = '/api/resources/heartEmpty';
            }
        })
        .catch(error => {
            heartIcon.src = '/api/resources/heartEmpty';
        });
}




function createMessageBox(messageIcon,loggedUser) {


        // Stwórz overlay, czyli zaciemnione tło
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'; // Czarny kolor z przeźroczystością

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
        // dialogBox.style.backgroundColor = '#181818';
        dialogBox.style.borderRadius = '15px';
        dialogBox.style.boxShadow = '0 0 20px darkgoldenrod'; // Dodaj efekt cienia
        dialogBox.style.flexDirection = 'column'; // Kierunek kolumny
        dialogBox.style.alignItems = 'center'; // Wyśrodkowanie w pionie
        dialogBox.style.textAlign = 'center'; // Wyśrodkowanie zawartości w poziomie
        dialogBox.style.display = 'flex';
        dialogBox.style.justifyContent = 'center'; // Wyśrodkowanie zawartości w pionie

        const headerTitle = document.createElement('dialogBox');
        headerTitle.setAttribute('id', 'dialogBoxTitle');
        headerTitle.textContent = 'Napisz wiadomość do sprzedającego';
        headerTitle.style.color = 'darkgoldenrod';
        headerTitle.style.fontSize = '32px';
        headerTitle.style.fontWeight = 'bold'; // Ustawienie pogrubienia
        headerTitle.style.marginTop = '15px'
        // headerTitle.style.marginBottom = '15px'

        // Stwórz obszar tekstowy
        const textArea = document.createElement('textarea');
        // textArea.style.backgroundColor = '#181818';
        textArea.style.backgroundColor = 'transparent'; // Czarny kolor z przeźroczystością

        textArea.style.color = 'white';
        textArea.style.borderRadius = '10px';
        textArea.style.width = '100%';
        textArea.style.height = '100px';
        textArea.style.width = '500px';
        textArea.style.resize = 'none';

        const sendButton = document.createElement("button");
        // settingsButton.setAttribute('id', 'menuPanelButton');
        sendButton.textContent = 'Wyślij';
        sendButton.style.backgroundColor = "darkgoldenrod";
        sendButton.style.border = "none";
        sendButton.style.marginBottom = "20px";
        sendButton.style.width = "150px";
        sendButton.style.color = "black";
        sendButton.style.marginTop = "20px";
        sendButton.style.padding = "10px 20px";
        sendButton.style.borderRadius = "5px";
        sendButton.style.boxShadow = "0 0 20px darkgoldenrod";
        sendButton.style.transition = "background-position 0.3s ease-in-out";

        sendButton.addEventListener("mouseover", function () {
                sendButton.style.boxShadow = '0 0 20px moccasin';
                sendButton.style.color = "white";
        });

        sendButton.addEventListener("mouseout", function () {
                sendButton.style.boxShadow = '0 0 20px darkgoldenrod';
                sendButton.style.color = "black";
        });
        sendButton.addEventListener("click", function () {
                checkConversationId(textArea.value);
        });
        textArea.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            checkConversationId(textArea.value);
        }
    });

        if(loggedUser === 'KONTO'){
            headerTitle.textContent = 'Musisz się zalogować !';
            dialogBox.appendChild(headerTitle);
         } else {
            dialogBox.appendChild(headerTitle);
            dialogBox.appendChild(textArea);
            dialogBox.appendChild(sendButton);
        }
        // Dodaj okno dialogowe do overlay
        overlay.appendChild(dialogBox);

        // Dodaj overlay do dokumentu
        document.body.appendChild(overlay);

        textArea.focus();


        // Dodaj obsługę zdarzenia do zamknięcia okna dialogowego
        overlay.addEventListener('click', (event) => {
                if (event.target === overlay) {
                        document.body.removeChild(overlay); // Usuń overlay po kliknięciu na tło
                        isMouseOverMessageIcon = false; // Odblokuj działanie mouseleave
                        messageIcon.src = '/api/resources/messageClosed';
                }
        });
}
function sendNewMessage(messageValue, advertisementId, conversationId) {
    // Stwórz obiekt FormData z danymi formularza
    const formData = new FormData();
    formData.append("message", messageValue);
    formData.append("conversationId", conversationId);
    formData.append("advertisementId", advertisementId);

    // Wysłanie danych jako żądanie POST z danymi formularza
    fetch("/api/messages", {
        method: "POST",
        body: formData,
        headers: {
            // Tutaj możesz ustawić odpowiednie nagłówki, np. "Content-Type"
        }
    })
        .then(response => {
            if (response.ok) {
                // Jeśli odpowiedź jest OK (status 200), nie parsujemy jej jako JSON
                let dialogBox = document.getElementById('dialogBox');
                let dialogBoxTitle = document.getElementById('dialogBoxTitle');
                dialogBox.innerHTML = '';
                dialogBoxTitle.textContent = "Wiadomość wysłana pomyślnie.";
                dialogBox.appendChild(dialogBoxTitle);
            } else {
                let dialogBox = document.getElementById('dialogBox');
                let dialogBoxTitle = document.getElementById('dialogBoxTitle');
                dialogBox.innerHTML = '';
                dialogBoxTitle.textContent = "Błąd podczas wysyłania wiadomości. Status:" + response.status;
                dialogBox.appendChild(dialogBoxTitle);
                console.error();
            }
        })
        .catch(error => {
            console.error("Błąd podczas wysyłania wiadomości:", error);
        });
}

function createNewConversation() {
    const formData = new FormData();
    formData.append("advertisementId", advertisementId);

    // Zwróć obietnicę
    return fetch("/api/conversations/create", {
        method: "POST",
        body: formData,
        headers: {
            // Tutaj możesz ustawić odpowiednie nagłówki, np. "Content-Type"
        }
    })
        .then(response => response.json())
        .then(response => {
            console.log(response);
            return response;
        })
        .catch(error => {
            console.error("Błąd podczas wysyłania wiadomości:", error);
        });
}

function checkConversationId(messageValue) {
    let conversationId = null;
    let loggedUser = document.getElementById('username').textContent;

    fetch("/api/conversations/id?advertisementId=" + advertisementId)
        .then(response => {
            if (response.status === 200) {
                return response.text(); // Jeśli odpowiedź jest OK, odczytaj ją jako tekst
            } else {
                throw new Error('Błąd na serwerze: ' + response.statusText);
            }
        })
        .then(data => {
            conversationId = parseInt(data); // Przekształć odpowiedź w numer konwersacji
            if (conversationId < 0) {
                createNewConversation()
                    .then(result => {
                        if (result) {
                            console.log(result);
                            sendNewMessage(messageValue, advertisementId, result);
                        } else {
                            console.error('NIE MOZESZ WYSYLAC WIADOMOSCI SAM DO SIEBIE !');
                        }
                    })
                    .catch(error => {
                        console.error('Błąd createNewConversation:', error);
                    });
            } else {
                sendNewMessage(messageValue, advertisementId, conversationId);
            }
        })
        .catch(error => {
            console.error('Błąd:', error);
        });
}




function fetchAdvertisement(){
        fetch('/api/advertisements/' + advertisementId)
            .then(response => response.json())
            .then(data => {
                    const container = document.getElementById('container-main');
                    advertisement = data; // Używamy pojedynczego obiektu, nie listy
                    createHeaderTitle(advertisement,container,advertisement.user);
                    createAdvertisementResultDiv(container,advertisement);

            })
            .catch(error => {
                    console.error('Błąd pobierania danych:', error);
            });
}

function previousPhoto(mainPhoto)  {
    if (currentPhotoIndex > 0) {
        currentPhotoIndex--;
    } else {
        currentPhotoIndex = advertisement.urlList.length - 1;
    }
    changePhoto(currentPhotoIndex,mainPhoto);
}

function nextPhoto(mainPhoto)  {
    if (currentPhotoIndex < advertisement.urlList.length - 1) {
        currentPhotoIndex++;
    } else {
        currentPhotoIndex = 0;
    }
    changePhoto(currentPhotoIndex,mainPhoto);
}
function changePhoto(index,mainPhoto) {
    mainPhoto.src = '/api/resources/advertisementPhoto/' + advertisement.urlList[index];
}

