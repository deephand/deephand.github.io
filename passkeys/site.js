document.getElementById("username").innerText =
  new URLSearchParams(window.location.search).get("username");