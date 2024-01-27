let selectedFiles = [];
let quill;
let dragSrcElement = null;

document.addEventListener('DOMContentLoaded', async function () {

    createAdvertisementForm('Dodaj Nowe Ogłoszenie');
    loadAdvertisementFormListeners();
    fetchUserDetails();

    // handleImageUrl("https://ireland.apollo.olxcdn.com/v1/files/eyJmbiI6ImhubHJ5ZHpwNDhkbzItT1RPTU9UT1BMIiwidyI6W3siZm4iOiJ3ZzRnbnFwNnkxZi1PVE9NT1RPUEwiLCJzIjoiMTYiLCJwIjoiMTAsLTEwIiwiYSI6IjAifV19.wqdGocguDvXytJOqUereVMNG5jyPJ-EWs7IpAIC8EJQ/image.webp");
});

function submitFormWithFiles() {
    const formData = advertisementFormDataExtract();
    fetch('/api/advertisements', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if(response.ok){
                resetFileDropArea();
                const redirectURL = response.headers.get('location');
                const parameter = response.headers.get('created');
                if (redirectURL) {
                    window.location.href = redirectURL + '&created='+parameter;
                } else {
                    console.error('Błąd przekierowania: Brak nagłówka "Location" w odpowiedzi serwera.');
                }
            } else {
                handleResponse(response);
            }
        })
        .catch(handleError);
}
async function handleFileFromUrl(url) {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/heic", "image/heif", "image/webp"];

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok.');
        const blob = await response.blob();
        if (!allowedMimeTypes.includes(blob.type)) {
            alert("Invalid file type. Only images with extensions jpg, png, heic, heif, and webp are allowed.");
            return;
        }
        const file = new File([blob], "image." + blob.type.split("/")[1], { type: blob.type });
        selectedFiles.push(file);
        await showThumbnails(selectedFiles);
    } catch (error) {
        console.error("Error fetching image:", error);
        alert("Failed to load image. Please check the URL and try again.");
    }
}
