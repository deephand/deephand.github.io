if (!window.location.href.startsWith("https")) {
    window.location.href = window.location.href.replace("http", "https");
}

let errorContainer = document.getElementById("error");
let messageContainer = document.getElementById("message");


function showError(error) {
    console.error(error);
    errorContainer.innerText = error;
    errorContainer.style.display = "block";
}

function showMessage(message) {
    console.info(message);
    messageContainer.innerText = message;
    messageContainer.style.display = "block";
}

let message = new URLSearchParams(window.location.search).get("message");
if (message && message !== "") {
    showMessage(message);
}