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



function getDeviceScreenInfo(){
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;

    console.log(`Szerokość ekranu: ${screenWidth}px`);
    console.log(`Wysokość ekranu: ${screenHeight}px`);

    const availableScreenWidth = window.screen.availWidth;
    const availableScreenHeight = window.screen.availHeight;

    console.log(`Dostępna szerokość ekranu: ${availableScreenWidth}px`);
    console.log(`Dostępna wysokość ekranu: ${availableScreenHeight}px`);

    const pixelsPerInch = window.screen.pixelDensity;

    console.log(`Piksele na cal (PPI): ${pixelsPerInch}`);

    const colorDepth = window.screen.colorDepth;

    console.log(`Głębia kolorów: ${colorDepth} bitów`);

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    console.log(`Szerokość okna przeglądarki: ${windowWidth}px`);
    console.log(`Wysokość okna przeglądarki: ${windowHeight}px`);

}

window.addEventListener('scroll', hideNavBar);
window.addEventListener("load", getAndDisplayLogo);
// window.addEventListener("load", getDeviceScreenInfo);

window.addEventListener('resize', () => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    console.log(`Nowa szerokość okna przeglądarki: ${windowWidth}px`);
    console.log(`Nowa wysokość okna przeglądarki: ${windowHeight}px`);
});
