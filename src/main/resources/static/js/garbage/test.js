// Pobranie elementu nagłówka
const header = document.querySelector('header');

// Funkcja, która dodaje klasę 'show' do nagłówka
function showHeader() {
    header.classList.add('show');
}

// Funkcja, która usuwa klasę 'show' z nagłówka
function hideHeader() {
    header.classList.remove('show');
}

// Wywołanie funkcji showHeader() po załadowaniu strony
window.addEventListener('load', showHeader);

// Przykładowe zdarzenia, które wywołują funkcje showHeader() i hideHeader()
window.addEventListener('scroll', showHeader);
window.addEventListener('mouseout', hideHeader);