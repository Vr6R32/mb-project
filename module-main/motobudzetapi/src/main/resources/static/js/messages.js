function createResultDiv(conversation,resultContainerRight) {
    const resultDiv = document.createElement("messageResultDiv");
    resultDiv.id = "messageResultDiv";


    // Tworzenie dwóch elementów grid
    resultContainerRight.style.display = 'grid';
    resultContainerRight.style.gridTemplateColumns = '100%';
    resultContainerRight.style.overflowY = 'scroll';
    resultContainerRight.style.overflowX = 'hidden';
    resultContainerRight.style.paddingBottom = '30px';
    resultContainerRight.style.paddingTop = '30px';
    resultContainerRight.style.paddingLeft = '20px';
    resultContainerRight.style.paddingRight = '20px';
    resultContainerRight.style.scrollbarWidth = 'thin';
    resultContainerRight.style.scrollbarColor = 'darkgoldenrod transparent';

    // Tworzenie dwóch elementów grid
    const grid1 = document.createElement('div');
    grid1.style.maxWidth = '100%';


    resultContainerRight.appendChild(grid1);


    resultDiv.onmouseover = () => {
        resultDiv.style.boxShadow = "0 0 20px moccasin";
    };

    resultDiv.onmouseout = () => {
        resultDiv.style.boxShadow = "0 0 0px darkgoldenrod";
    };

    resultDiv.onclick = () => {
        resultDiv.onmouseover = null;
        resultDiv.onclick = null;
        resultDiv.style.cursor = "default";
        resultDiv.style.boxShadow = "0 0 0px darkgoldenrod";
        resultContainerRight.innerHTML = "";

        conversationDetailsMain.removeChild(conversationLastMessage);
        conversationDetailsMain.removeChild(conversationDeliveryDateTime);

        fetchAdvertisementMessages(conversation, resultContainerRight, resultDiv);

    };


    const photoElement = document.createElement("img");
    photoElement.src = `/api/static/photo/${conversation.advertisement.mainPhotoUrl}`;
    photoElement.style.height = "150px";
    photoElement.style.width = "100px";
    photoElement.style.objectFit = "cover";

    const fadeEffect = document.createElement('div');
    fadeEffect.classList.add('fade-effect-miniature-search');
    fadeEffect.appendChild(photoElement);

    resultDiv.appendChild(fadeEffect);

    const conversationDetailsHeader = document.createElement("conversationDetailsHeader");
    conversationDetailsHeader.style.width = '100%'; // Dopasowanie do szerokości resultDiv
    conversationDetailsHeader.style.display = 'flex'; // Ustawienie flexbox
    conversationDetailsHeader.style.justifyContent = 'space-between'; // Umieszczenie elementów na końcach kontenera
    conversationDetailsHeader.style.alignItems = 'center'; // Wyśrodkowanie elementów w pionie
    conversationDetailsHeader.style.boxSizing = "border-box";
    conversationDetailsHeader.style.flexBasis = "auto";

    const nameElement = document.createElement("div");
    nameElement.textContent = conversation.advertisement.name;
    nameElement.style.color = "white"; // Dostosuj kolor tekstu
    nameElement.style.fontSize = "24px"; // Dostosuj rozmiar tekstu
    nameElement.style.textAlign = 'left';


    conversationDetailsHeader.appendChild(nameElement);

    if (conversation.lastMessage !== null) {
        const dateElement = document.createElement("div");
        dateElement.textContent = conversation.lastMessage.messageSendDate;
        dateElement.style.color = "darkgoldenrod";
        dateElement.style.fontSize = "18px";
        dateElement.style.textAlign = 'right';
        dateElement.style.marginRight = '15px';
        dateElement.style.whiteSpace = 'nowrap';
        conversationDetailsHeader.appendChild(dateElement);
    }

    ///////////////////////////////////////////////////////////////////////
    ///////////////////////////////HEADER//////////////////////////////////
    ///////////////////////////////////////////////////////////////////////


    const conversationDetailsDiv = document.createElement("conversationDetailsDiv");
    conversationDetailsDiv.style.width = '100%'; // Dopasowanie do szerokości resultDiv
    conversationDetailsDiv.style.flexBasis = 'auto';
    conversationDetailsDiv.style.display = 'flex-start';
    conversationDetailsDiv.style.flexDirection = 'column'; // Ustawienia pionowego układu


    const conversationDetailsMain = document.createElement("conversationDetailsMain");
    conversationDetailsMain.style.width = '100%'; // Dopasowanie do szerokości resultDiv
    conversationDetailsMain.style.flexBasis = 'auto';
    conversationDetailsMain.style.display = 'grid';
    conversationDetailsMain.style.gridTemplateRows = 'auto 1fr auto'; // Rozkład na trzy sekcje: górną, środkową i dolną


    const conversationDetailsSecondUser = document.createElement("conversationDetailsCenter");
    conversationDetailsSecondUser.style.width = '100%'; // Dopasowanie do szerokości resultDiv
    conversationDetailsSecondUser.style.flexBasis = 'auto';
    conversationDetailsSecondUser.innerHTML = "Konwersacja z → <strong style='font-size: 1.4em;'>" + conversation.secondUser + "</strong>";


    const advertisementDetails = document.createElement("conversationDetailsBottom");
    advertisementDetails.style.width = '100%'; // Dopasowanie do szerokości resultDiv
    advertisementDetails.style.flexBasis = 'auto';
    advertisementDetails.style.display = 'flex';
    advertisementDetails.style.marginTop = '15px';


    let pln = document.createElement('span');
    pln.style.color = 'darkgoldenrod';
    pln.textContent = 'PLN';

    function formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    const containers = [
        createInfoContainer('price', 'PriceIcon', formatPrice(conversation.advertisement.price)),
        createInfoContainer('mileage', 'MileageIcon', formatPrice(conversation.advertisement.mileage)),
        createInfoContainer('productionDate', 'ProductionDateIcon', conversation.advertisement.productionDate),
        createInfoContainer('fuelType', 'FuelTypeIcon', conversation.advertisement.fuelType),
        createInfoContainer('engineHorsePower', 'EngineIcon', conversation.advertisement.engineHorsePower + 'HP'),
        createInfoContainer('engineType/' + conversation.advertisement.engineType, 'transmissionIcon', conversation.advertisement.engineType),
        createInfoContainer('transmissionType/' + conversation.advertisement.transmissionType, 'transmissionIcon', conversation.advertisement.transmissionType),
    ];

    containers[0].appendChild(pln);


    const maxTextWidth = Math.max(
        ...containers.map(container => container.querySelector('span').offsetWidth)
    );

    containers.forEach(container => {
        container.style.width = maxTextWidth + 'px';
        advertisementDetails.appendChild(container);
    });

    const conversationLastMessage = document.createElement("conversationLastMessage");
    conversationLastMessage.style.width = '100%';
    conversationLastMessage.style.overflow = 'hidden';
    conversationLastMessage.style.textOverflow = 'ellipsis';
    conversationLastMessage.style.whiteSpace = 'nowrap';

    if (conversation.lastMessage === null) {
        conversationLastMessage.textContent += 'Brak Wiadomości';
    } else {
        const lastMessageValue = document.createElement("lastMessageValue");
        lastMessageValue.style.color = "white";
        lastMessageValue.style.fontSize = "24px";
        lastMessageValue.style.textAlign = 'right';
        lastMessageValue.style.marginLeft = 'auto';
        lastMessageValue.textContent = conversation.lastMessage.userSender + ' : ' + conversation.lastMessage.message;
        conversationLastMessage.appendChild(lastMessageValue);
    }


    const conversationDeliveryDateTime = document.createElement("deliveryDateTime");
    conversationDeliveryDateTime.style.color = "darkgoldenrod";
    conversationDeliveryDateTime.style.fontSize = "24px";
    conversationDeliveryDateTime.style.textAlign = "right";



    if (conversation.lastMessage === null) {
        conversationDeliveryDateTime.textContent += 'Brak Wiadomości';
    } else {
        const isSenderCurrentUser = conversation.lastMessage.userSender === getUserName();
        if (conversation.lastMessage.messageReadTime === null) {
            if (isSenderCurrentUser) {
                conversationDeliveryDateTime.textContent += 'Dostarczono : ' + conversation.lastMessage.messageSendTime;
            } else {
                conversationDeliveryDateTime.textContent += 'Odebrano : ' + conversation.lastMessage.messageSendTime;
            }
        } else {
            conversationDeliveryDateTime.textContent += 'Wyswietlono : ' + conversation.lastMessage.messageReadTime;
        }
    }


    conversationDetailsMain.appendChild(conversationDetailsSecondUser);
    conversationDetailsMain.appendChild(advertisementDetails);
    conversationDetailsMain.appendChild(conversationLastMessage);
    conversationDetailsMain.appendChild(conversationDeliveryDateTime);

    conversationDetailsDiv.appendChild(conversationDetailsHeader);
    conversationDetailsDiv.appendChild(conversationDetailsMain);

    resultDiv.style.gridColumn = 1;

    resultDiv.style.gridRowStart = conversationRow;
    resultDiv.style.gridRowEnd = conversationRow + 1;

    resultDiv.appendChild(conversationDetailsDiv);

    handleDarkModeInverse(resultDiv);

    return resultDiv;
}

function createInfoContainer(iconPath, altText, value) {
    const container = document.createElement('messageInfoContainer');
    container.setAttribute('id', 'messageInfoContainer');
    container.style.color = 'white';

    const icon = document.createElement('img');
    icon.src = `/api/static/${iconPath}`;
    icon.alt = altText;
    icon.style.marginBottom = '2px';

    const valueElement = document.createElement('span');
    valueElement.textContent = value;

    container.appendChild(icon);
    container.appendChild(valueElement);

    return container;
}

function createMessageContainer(message,resultContainerRight,conversation,currentRow){

    const singleMessageDiv = document.createElement("div");
    singleMessageDiv.setAttribute('id', 'singleMessageDiv');
    singleMessageDiv.style.maxWidth = '100%';

    singleMessageDiv.style.gridRowStart = currentRow; // Ustaw numer rzędu
    singleMessageDiv.style.gridRowEnd = currentRow + 1; // Ustaw numer rzędu

    if (message.userSender !== conversation.secondUser) {
        singleMessageDiv.style.gridColumnStart = '4';
        singleMessageDiv.style.gridColumnEnd = '4';
        singleMessageDiv.style.textAlign = 'right';
        singleMessageDiv.style.display = 'flex';
        singleMessageDiv.style.flexDirection = 'row'; // Odwracamy kierunek flex
        singleMessageDiv.style.justifyContent = 'flex-end'; // Wyrównujemy do prawej
    } else {
        singleMessageDiv.style.textAlign = 'left';
        singleMessageDiv.style.gridColumnStart = '1';
        singleMessageDiv.style.gridColumnEnd = '1';
    }



    const messageElement = document.createElement("messageValueSingleDiv");

    messageElement.setAttribute('id', 'singleMessageValueDiv');
    messageElement.textContent = message.message;
    messageElement.style.fontStyle = 'bold';



    const userNameElement = document.createElement("userNameValueDiv");
    userNameElement.setAttribute('id', 'userNameValueDiv');

    /*
    CHARS
    [⤤],[⎳],[🝫],
    */
    userNameElement.innerHTML = "<strong style='font-size: 1.2em;'>" +  message.userSender + " ⤤ </strong>";

    singleMessageDiv.appendChild(userNameElement);
    singleMessageDiv.appendChild(messageElement);
    resultContainerRight.appendChild(singleMessageDiv);


}

function createMessageInputContainer(resultContainerRight, conversation) {

    const messageInputDiv = document.createElement("div");
    messageInputDiv.id = 'messageInputDiv';

    const messageInput = document.createElement("textarea");
    messageInput.id = 'messageInputTextAreaDiv';
    messageInput.placeholder = "Wpisz wiadomość...";

    const sendButton = document.createElement("button");
    sendButton.textContent = "Wyślij";
    sendButton.style.position = 'absolute';
    sendButton.style.bottom = '1px';
    sendButton.style.right = '-75px';
    sendButton.style.backgroundColor = "black";
    sendButton.style.color = "white";
    sendButton.style.border = "1px solid darkgoldenrod";
    sendButton.style.padding = "10px 20px";
    sendButton.style.cursor = "pointer";
    sendButton.style.transition = "0.3s";
    sendButton.style.borderRadius = '15px';
    sendButton.style.marginRight = '3px';

    sendButton.addEventListener("click", function () {
        sendMessage(messageInput, conversation, resultContainerRight, messageInputDiv);
    });

    messageInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage(messageInput, conversation, resultContainerRight, messageInputDiv);
        }
    });

    messageInputDiv.appendChild(messageInput);
    messageInputDiv.appendChild(sendButton);
    let rightContainer = document.getElementById("rightContainer");
    rightContainer.appendChild(messageInputDiv);
}

function sendMessage(messageInput, conversation, resultContainerRight) {

    const messageText = messageInput.value;
    const conversationId = conversation.conversationId;

    const messageObject = {
        message: messageText,
        userSender: document.getElementById('username').textContent,
    };

    if(messageText.length > 1000){
        console.log('za długa wiadomosc');
        return;
    }

    if (messageText.trim() !== "") {
        const formData = new FormData();
        formData.append("message", messageText);
        formData.append("conversationId", conversationId);

        // Wysłanie danych jako żądanie POST z danymi formularza
        fetchWithAuth("/api/messages", {
            method: "POST",
            body: formData,
        })
            .then(response => response.text())
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.error("Błąd podczas wysyłania wiadomości:", error);
            });
        currentRow++;
        createMessageContainer(messageObject,resultContainerRight,conversation,currentRow);
        resultContainerRight.scrollTop = resultContainerRight.scrollHeight;

        messageInput.value = "";
    }
}