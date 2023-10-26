document.addEventListener("DOMContentLoaded", function() {
    let urlParams = new URLSearchParams(window.location.search);
    // Check if the "activation" parameter exists and if its value is "true"
    if (urlParams.has("created") && urlParams.get("created") === "true") {

        console.log('test');


        setTimeout(function() {
            let navbar = document.createElement('div');
            navbar.setAttribute('id', 'popupNavbar');
            navbar.style.top = '-120px';  // Set the initial position

            let text = document.createElement('p');
            text.style.color = 'white';
            text.textContent = "Twoje ogłoszenie zostało utworzone pomyślnie, po szybkim procesie weryfikacji , dostaniesz informacje na e-mail że ogloszenie jest widoczne publicznie.";

            const successIcon = document.createElement('img');
            successIcon.src = '/api/resources/successIcon';
            successIcon.alt = 'successIcon';

            navbar.appendChild(successIcon);
            navbar.appendChild(text);
            document.body.appendChild(navbar); // add the navbar to the body

            // Start animation after 1 second
            setTimeout(function() {
                navbar.style.top = '0'; // slides the navbar into view
            }, 500);

            // Auto hide navbar after another 10 seconds
            setTimeout(function() {
                navbar.style.top = '-120px'; // slides the navbar out of view
            }, 7000); // Starts after a total of 11 seconds since page load

        });
    }
});