document.getElementById("create-account").addEventListener("submit", event => {
    event.preventDefault();
    let username = document.getElementById("username").value;
    let name = document.getElementById("name").value;
    navigator.credentials.create({
      publicKey: {
        // if you're reading this code for inspiration, don't do this!!!
        // this challenge should be random per request and verified on the server.
        // i'm just lazy and don't want to code a server.
        challenge: Uint8Array.from([1, 2, 3, 4]),
        rp: {
          name: "Conditional UI Example"
        },
        user: {
          id: Uint8Array.from(username.split("").map(c => c.codePointAt(0))),
          name: username,
          displayName: name,
        },
        pubKeyCredParams: [],
        authenticatorSelection: {
          userVerification: "required",
          residentKey: "required",
          //authenticatorAttachment: "platform",
        },
      }
    }).then(credential => {
      showMessage("Credential successfully created! Try logging in.");
      document.getElementById("create-account").style.display = "none";
    }).catch(error => {
      showError(error.toString());
    });
  });
  