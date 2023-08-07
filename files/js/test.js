const test123 = "test123";

function fetchData() {
    const xhr = new XMLHttpRequest();
    const id = "b4637de1-0f9e-493a-934f-788cbab6c28c";
    const url = "/api/advertisements/b4637de1-0f9e-493a-934f-788cbab6c28c"

    xhr.open("GET", url);
    xhr.setRequestHeader("test", test123);
    xhr.onload = function () {
        if (xhr.status === 200) {
            const response = xhr.responseText;
            // Przetwarzaj otrzymane dane zgodnie z Twoimi potrzebami
            console.log(response);
        }
    };
    xhr.send();
}