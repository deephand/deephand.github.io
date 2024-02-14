/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

    window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable().then(
      result => {
        if (!result) {
          showError("No platform authenticator found. If your OS does not come with one, try using devtools to set one up.");
        }
      }
    );
    
    
    let abortController;
    let abortSignal;
    
    let startConditionalRequest = async () => {
      if (window.PublicKeyCredential.isConditionalMediationAvailable) {
        console.log("Conditional UI is understood by the browser");
        if (!await window.PublicKeyCredential.isConditionalMediationAvailable()) {
          showError("Conditional UI is understood by your browser but not available");
          return;
        }
      } else {
        // Normally, this would mean Conditional Mediation is not available. However, the "current"
        // development implementation on chrome exposes availability via
        // navigator.credentials.conditionalMediationSupported. You won't have to add this code
        // by the time the feature is released.
        if (!navigator.credentials.conditionalMediationSupported) {
          showError("Your browser does not implement Conditional UI (are you running the right chrome/safari version with the right flags?)");
          return;
        } else {
          console.log("This browser understand the old version of Conditional UI feature detection");
        }
      }
      abortController = new AbortController();
      abortSignal = abortController.signal;
      
      try {
        let credential = await navigator.credentials.get({
          signal: abortSignal,
          publicKey: {
            // Don't do this in production!
            challenge: new Uint8Array([1, 2, 3, 4])
          },
          mediation: "conditional"
        });
        if (credential) {
          let username = String.fromCodePoint(...new Uint8Array(credential.response.userHandle));
          window.location = "site.html?username=" + username;
        } else {
          showError("Credential returned null");
        }
      } catch (error) {
        if (error.name == "AbortError") {
          console.log("request aborted");
          return;
        }
        showError(error.toString());
      }
    }
    
    let startNormalRequest = () => {
      console.log('starting webauthn conditional ui request');
      navigator.credentials.get({
        publicKey: {
          // don't do this in production!
          challenge: new Uint8Array([1, 2, 3, 4])
        },
      }).then(credential => {
        if (credential) {
          let username = String.fromCodePoint(...new Uint8Array(credential.response.userHandle));
          window.location = "site.html?username=" + username;
        } else {
          showError("Credential returned null");
        }
      }).catch(error => {
        showError(error.toString());
      }).finally(() => {
        startConditionalRequest();
      });
    }
    
    startConditionalRequest();
    
    document.getElementById("manual-login").addEventListener("click", (e) => {
      e.preventDefault();
      if (abortController) {
        console.log("aborting request & starting new one");
        // Abort the request synchronously.
        // This lets us use the user activation from clicking the button on safari to trigger webauthn.
        abortController.abort();
      }
      startNormalRequest();
    });