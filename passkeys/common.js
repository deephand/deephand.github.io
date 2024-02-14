if (!window.location.href.startsWith("https")) {
    window.location.href = window.location.href.replace("http", "https");
}

let conditionalWarningContainer = document.getElementById("conditionalWarning");
let errorContainer = document.getElementById("error");
let messageContainer = document.getElementById("message");

function showConditionalWarning(warning) {
    console.error(warning);
    conditionalWarningContainer.innerText = warning;
    conditionalWarningContainer.style.display = "block";
}

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