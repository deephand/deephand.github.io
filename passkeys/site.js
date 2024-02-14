document.getElementById("username").innerText =
    new URLSearchParams(window.location.search).get("username");
console.log("Username is: " + document.getElementById("username").innerText);