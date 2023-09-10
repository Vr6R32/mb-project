function getAndDisplayLogo() {
    const xhr = new XMLHttpRequest();
    const url = "/api/resources/logo";
    xhr.open("GET", url, true);
    xhr.responseType = "arraybuffer";
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            const image = new Image();
            const arrayBufferView = new Uint8Array(xhr.response);
            const blob = new Blob([arrayBufferView], { type: "image/png" });
            const imageUrl = URL.createObjectURL(blob);
            image.src = imageUrl;
            image.alt = "Logo";
            document.getElementById("logo").src = imageUrl;
        }
    };
    xhr.send();
}

function hideNavBar () {
    const header = document.querySelector('header');
    if (window.pageYOffset > 300) {
        header.classList.add('header-hidden');
    } else {
        header.classList.remove('header-hidden');
    }
}


window.addEventListener('scroll', hideNavBar);
window.addEventListener("load", getAndDisplayLogo);


// function getAndDisplayConstruction() {
//     const xhr = new XMLHttpRequest();
//     const url = "api/resources/construction";
//     xhr.open("GET", url, true);
//     xhr.responseType = "arraybuffer";
//     xhr.onload = function() {
//         if (xhr.status >= 200 && xhr.status < 300) {
//             const image = new Image();
//             const arrayBufferView = new Uint8Array(xhr.response);
//             const blob = new Blob([arrayBufferView], { type: "image/png" });
//             const imageUrl = URL.createObjectURL(blob);
//             image.src = imageUrl;
//             image.alt = "ConstructionSite";
//             document.getElementById("constructionSite").src = imageUrl;
//         }
//     };
//     xhr.send();

// }
// function getTestPhoto() {
//     const xhr = new XMLHttpRequest();
//     const url = "api/resources/testPhoto";
//     xhr.open("GET", url, true);
//     xhr.responseType = "arraybuffer";
//     xhr.onload = function() {
//         if (xhr.status >= 200 && xhr.status < 300) {
//             const image = new Image();
//             const arrayBufferView = new Uint8Array(xhr.response);
//             const blob = new Blob([arrayBufferView], { type: "image/png" });
//             const imageUrl = URL.createObjectURL(blob);
//             image.src = imageUrl;
//             image.alt = "TestPhoto";
//             document.getElementById("testPhoto").src = imageUrl;
//         }
//     };
//     xhr.send();



// }
// window.addEventListener("load", getAndDisplayConstruction);
// window.addEventListener("load", getTestPhoto);
