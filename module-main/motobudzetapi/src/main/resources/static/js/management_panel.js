let row = 1;
let resultCount = 0;

document.addEventListener("DOMContentLoaded", function () {
    createHeader("Ogłoszenia do weryfikacji");
    loadToVerifyAdvertisements()
});


function loadToVerifyAdvertisements(){
    fetchWithAuth('/api/advertisements/all-to-verify')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('resultContainerRight');
            if (data.length === 0) {
                container.textContent = "Nie ma żadnych ogłoszen do zweryfikowania";
            } else {
                data.forEach(advertisementData => {
                    createUserAdvertisementsResultDiv(advertisementData,container);

                    let iconWrapper = document.getElementById('iconWrapper');
                    iconWrapper.style.display = 'none';

                    row++;
                    resultCount++
                });
            }
        })
        .catch(error => {
            console.error('Błąd pobierania danych:', error);
        });
}