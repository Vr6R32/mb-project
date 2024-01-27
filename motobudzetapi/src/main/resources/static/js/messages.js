function createConversationResults(conversation, container) {


    container.style.maxHeight = "1000px";
    container.style.display = 'grid';
    container.style.gridTemplateColumns = '100%';
    container.style.overflowY = 'scroll';
    container.style.overflowX = 'hidden';
    container.style.paddingBottom = '30px';
    container.style.paddingTop = '30px';
    container.style.paddingLeft = '20px';
    container.style.paddingRight = '20px';
    container.style.scrollbarWidth = 'thin';
    container.style.scrollbarColor = 'darkgoldenrod transparent';


    const resultDiv = document.createElement("messageResultDiv");
    resultDiv.id = "messageResultDiv";
    resultDiv.style.height = '90%';
    resultDiv.style.marginBottom = '30px';



    // if (/Mobi|Android/i.test(navigator.userAgent)) {
        // let resultContainerRight = document.getElementById('resultContainerRight');
        // let rightContainer = document.getElementById('rightContainer');
        // resultContainerRight.style.height = '1400px';
        // resultContainerRight.style.maxHeight = '1200px';
        // rightContainer.style.maxHeight = '1800px';
        // rightContainer.style.height = '1000px';
        // resultDiv.style.height = '70%';
    // }

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
        resultDiv.style.boxShadow = 'none';
        resultDiv.onmouseout = () => {
            resultDiv.style.boxShadow = 'none';
        };
        container.innerHTML = "";
        advertisementDetailsMain.removeChild(conversationLastMessage);
        bottomDetailsHeader.removeChild(conversationDeliveryDateTime);
        fetchConversationMessages(conversation, container, resultDiv);
    };


    const photoElement = document.createElement("img");
    photoElement.src = `/api/static/photo/${conversation.advertisement.mainPhotoUrl}`;
    photoElement.style.height = "200px";
    photoElement.style.minWidth = '250px';
    photoElement.style.maxWidth = '250px';
    photoElement.style.objectFit = "cover";

    const fadeEffect = document.createElement('div');
    fadeEffect.classList.add('fade-effect-miniature-search');
    fadeEffect.appendChild(photoElement);
    resultDiv.appendChild(fadeEffect);

    const advertisementDetailsHeader = document.createElement("div");
    advertisementDetailsHeader.className = "advertisementDetailsHeader";

    const titleElement = document.createElement("div");
    titleElement.textContent = conversation.advertisement.name;
    titleElement.style.color = "white";
    titleElement.style.fontSize = "24px";
    titleElement.style.textAlign = 'left';
    titleElement.style.whiteSpace = 'nowrap';
    titleElement.style.overflow = 'hidden';
    titleElement.style.textOverflow = 'ellipsis';

    advertisementDetailsHeader.appendChild(titleElement);

    if (conversation.lastMessage !== null) {
        const dateElement = document.createElement("div");
        dateElement.textContent = conversation.lastMessage.messageSendDate;
        dateElement.style.color = "darkgoldenrod";
        dateElement.style.fontSize = "18px";
        dateElement.style.textAlign = 'right';
        dateElement.style.marginRight = '15px';
        dateElement.style.whiteSpace = 'nowrap';
        advertisementDetailsHeader.appendChild(dateElement);
    }

    ///////////////////////////////////////////////////////////////////////
    ///////////////////////////////HEADER//////////////////////////////////
    ///////////////////////////////////////////////////////////////////////


    const advertisementDetailsDiv = document.createElement("div");
    advertisementDetailsDiv.className = "advertisementDetailsDiv";

    const advertisementDetailsMain = document.createElement("div");
    advertisementDetailsMain.className = "advertisementDetailsMain";

    const advertisementDetails = document.createElement("div");
    advertisementDetails.className = "advertisementDetails";

    let priceUnitValue = document.createElement('span');
    priceUnitValue.style.color = 'darkgoldenrod';
    priceUnitValue.textContent = conversation.advertisement.priceUnit;

    let mileageUnitValue = document.createElement('span');
    mileageUnitValue.style.color = 'darkgoldenrod';
    mileageUnitValue.textContent = conversation.advertisement.mileageUnit;

    let horsePower = document.createElement('span');
    horsePower.style.color = 'darkgoldenrod';
    horsePower.textContent = 'HP';

    let productionYear = document.createElement('span');
    productionYear.style.color = 'darkgoldenrod';
    productionYear.textContent = 'ROK';

    let engineCapacity = document.createElement('span');
    engineCapacity.style.color = 'darkgoldenrod';
    engineCapacity.textContent = 'CM';

    let smallerDigit = document.createElement('span');
    smallerDigit.textContent = '3';
    smallerDigit.style.fontSize = '10px';
    smallerDigit.style.verticalAlign = 'top';

    engineCapacity.appendChild(smallerDigit);


    const conversationDetailsSecondUser = document.createElement("conversationDetailsCenter");
    conversationDetailsSecondUser.style.width = '100%';
    conversationDetailsSecondUser.style.flexBasis = 'auto';
    conversationDetailsSecondUser.innerHTML = "Konwersacja z → <strong style='font-size: 1.4em;'>" + conversation.secondUser + "</strong>";

    function formatInteger(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    const containers = [
        createInfoContainer('mileage', 'MileageIcon', formatInteger(conversation.advertisement.mileage)),
        createInfoContainer('engineHorsePower', 'EngineIcon', conversation.advertisement.engineHorsePower),
        createInfoContainer('productionDate', 'ProductionDateIcon', conversation.advertisement.productionDate),
        createInfoContainer('engineCapacity', 'CapacityIcon', formatInteger(conversation.advertisement.engineCapacity)),
        createInfoContainer('fuelType', 'FuelTypeIcon', conversation.advertisement.fuelType),
        createInfoContainer('engineType/' + conversation.advertisement.engineType, 'transmissionIcon', conversation.advertisement.engineType),
        createInfoContainer('transmissionType/' + conversation.advertisement.transmissionType, 'transmissionIcon', conversation.advertisement.transmissionType),
    ];

    containers[0].appendChild(mileageUnitValue);
    containers[1].appendChild(horsePower);
    containers[2].appendChild(productionYear);
    containers[3].appendChild(engineCapacity);



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
        const lastMessageValue = document.createElement("div");
        lastMessageValue.style.color = "white";
        lastMessageValue.style.fontSize = "24px";
        lastMessageValue.style.textAlign = 'left';
        lastMessageValue.style.marginLeft = 'auto';
        lastMessageValue.style.marginTop = '15px';

        const senderSpan = document.createElement("span");
        senderSpan.textContent = conversation.lastMessage.userSender;
        senderSpan.style.fontWeight = 'bold';
        senderSpan.style.color = "darkgoldenrod";

        lastMessageValue.appendChild(senderSpan);
        lastMessageValue.appendChild(document.createTextNode(' : '));
        lastMessageValue.appendChild(document.createTextNode(conversation.lastMessage.message));
        conversationLastMessage.appendChild(lastMessageValue);
    }


    const conversationDeliveryDateTime = document.createElement("div");
    conversationDeliveryDateTime.setAttribute('id', 'conversationDeliveryDateTime');
    conversationDeliveryDateTime.style.color = "darkgoldenrod";
    conversationDeliveryDateTime.style.fontSize = "24px";
    conversationDeliveryDateTime.style.textAlign = "right";
    conversationDeliveryDateTime.style.whiteSpace = "nowrap";


    if (conversation.lastMessage === null) {
        conversationDeliveryDateTime.textContent += 'Brak Wiadomości';
    } else {
        const isSenderCurrentUser = conversation.lastMessage.userSender === getUserName();
        if (conversation.lastMessage.messageReadTime === null) {
            if (isSenderCurrentUser) {
                conversationDeliveryDateTime.textContent += 'Dostarczono : ' + conversation.lastMessage.messageSendTime;
            } else {
                conversationDeliveryDateTime.textContent += 'Odebrano:' + conversation.lastMessage.messageSendTime;
            }
        } else {
            conversationDeliveryDateTime.textContent += 'Wyswietlono:' + conversation.lastMessage.messageReadTime;
        }
    }

    const bottomDetailsHeader = document.createElement("div");
    bottomDetailsHeader.className = "bottomDetailsHeader";
    bottomDetailsHeader.style.marginTop = '20px';

    const locationDetailsDiv = document.createElement('div');
    locationDetailsDiv.style.display = 'column';
    locationDetailsDiv.style.width = '100%';
    locationDetailsDiv.style.position = 'relative';

    const locationDetails = document.createElement("div");
    locationDetails.className = "locationDetails";

    const citySpan = document.createElement("span");
    citySpan.textContent = conversation.advertisement.city + ',';
    citySpan.style.fontSize = "22px";

    const stateSpan = document.createElement("span");
    stateSpan.textContent = ' \t' + conversation.advertisement.cityState;
    stateSpan.style.color = 'darkgoldenrod';
    stateSpan.style.fontSize = "14px";
    stateSpan.style.marginTop = "6px";

    locationDetails.appendChild(citySpan);
    locationDetails.appendChild(stateSpan);


    locationDetailsDiv.appendChild(locationDetails);
    bottomDetailsHeader.appendChild(locationDetailsDiv);
    bottomDetailsHeader.appendChild(conversationDeliveryDateTime);


    advertisementDetailsMain.appendChild(conversationDetailsSecondUser);
    advertisementDetailsMain.appendChild(advertisementDetails);
    advertisementDetailsMain.appendChild(conversationLastMessage);
    // conversationDetailsMain.appendChild(conversationDeliveryDateTime);
    advertisementDetailsMain.appendChild(bottomDetailsHeader);

    advertisementDetailsDiv.appendChild(advertisementDetailsHeader);
    advertisementDetailsDiv.appendChild(advertisementDetailsMain);

    resultDiv.style.gridColumn = 1;

    resultDiv.style.gridRowStart = conversationRow;
    resultDiv.style.gridRowEnd = conversationRow + 1;

    resultDiv.appendChild(advertisementDetailsDiv);

    handleDarkModeInverse(resultDiv);

    return resultDiv;
}

function createSingleMessageContainer(message, resultContainerRight, conversation, currentRow){

    const singleMessageDiv = document.createElement("div");
    singleMessageDiv.setAttribute('id', 'singleMessageDiv');
    singleMessageDiv.style.maxWidth = '100%';
    singleMessageDiv.style.gridRowStart = currentRow;
    singleMessageDiv.style.gridRowEnd = currentRow + 1;

    if (message.userSender !== conversation.secondUser) {
        singleMessageDiv.style.gridColumnStart = '4';
        singleMessageDiv.style.gridColumnEnd = '4';
        singleMessageDiv.style.textAlign = 'right';
        singleMessageDiv.style.display = 'flex';
        singleMessageDiv.style.flexDirection = 'row';
        singleMessageDiv.style.justifyContent = 'flex-end';
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
    sendButton.className = "sendMessageButton";

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
    const messageObject = {
        message: messageText,
        userSender: getUserName()
    };

    if(messageText.length > 1000){
        alert('Maksymalna długość wiadomości to 1000 znaków.');
        return;
    }

    if (messageText.trim() !== "") {
        const formData = new FormData();
        formData.append("message", messageText);
        formData.append("advertisementId", conversation.advertisement.id);

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
        createSingleMessageContainer(messageObject,resultContainerRight,conversation,currentRow);
        resultContainerRight.scrollTop = resultContainerRight.scrollHeight;
        messageInput.value = "";
    }
}