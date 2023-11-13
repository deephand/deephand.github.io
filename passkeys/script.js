const CHALLENGE_DO_NOT_USE_IN_REAL_LIFE = Uint8Array.from([1,1,2,3,5]);

const showError = function(error) {
  const elem = document.getElementById("error");
  elem.innerText = error;
  elem.style.display = 'block';
}

const showMessage = function(message) {
  const elem = document.getElementById("message");
  elem.innerText = message;
  elem.style.display = 'block';
}

let checkConditionalMediation = async function() {
  if (!window.PublicKeyCredential || !PublicKeyCredential.isConditionalMediationAvailable) {
    return;
  }
  const conditionalMediationAvailable = await PublicKeyCredential.isConditionalMediationAvailable();  
  if (!conditionalMediationAvailable) {
    showError("Conditional mediation is not available");
    return false;
  }
  return true;
} 

let checkUserVerifyingPlatformAuthenticator = async function() {
  if (!window.PublicKeyCredential ||
      !PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
    return;
  }
  const userVerifyingPlatformAuthenticatorAvailable = await
      PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  if (!userVerifyingPlatformAuthenticatorAvailable) {
    showError("User verifying platform authenticator unavailable");
  }
  return userVerifyingPlatformAuthenticatorAvailable;
}


let conditionalLogin = async function() {
  if (!checkConditionalMediation()) return;
  const abortController = new AbortController();

  const publicKeyCredentialRequestOptions = {
    challenge: new ArrayBuffer([1, 2 ,3]) ,
    // The same RP ID as used during registration
    // rpId: 'deephand.github.io',
  };

  const credential = await navigator.credentials.get({
    publicKey: publicKeyCredentialRequestOptions,
    signal: abortController.signal,
    mediation: 'conditional',
  });

  if (!credential) {
    return;
  }

  window.location('passkeys/welcome.html');
}

conditionalLogin();


let createPasskey = async function() {
  if (!checkConditionalMediation() ||
      !checkUserVerifyingPlatformAuthenticator()) {
    return;
  }
  const username = document.getElementById("username").value;
  const credential = await navigator.credentials.create({
    publicKey: {
      challenge: CHALLENGE_DO_NOT_USE_IN_REAL_LIFE,
      pubKeyCredParams: [
        {alg: -7, type: "public-key"},
        {alg: -257, type: "public-key"},
      ],
      user: {
        id: Array.from(username).map(char => char.codePointAt(0)),
        name: username,
        displayName: username,
      },
    }
  });
  if (!credential) {
    showError("Cannot create credential!");
    return;
  }
  showMessage("Credential created: " + username);
}