const CHALLENGE_DO_NOT_USE_IN_REAL_LIFE = Uint8Array.from([1,1,2,3,5]);
const URL = "deephand.github.io";

const abortController = new AbortController();

const showMessageAt = function(message, elementId) {
  const elem = document.getElementById(elementId);
  elem.innerText = message;
  elem.style.display = 'block';
}

let checkWebAuthn = async function() {
  if (!window.PublicKeyCredential) {
    showMessageAt("WebAuthn is not available", "publicKeyCredentialError");
  } else {
    showMessageAt("WebAuthn is available", "publicKeyCredentialAvailability");
  }
}

let checkConditionalMediation = async function() {
  if (!window.PublicKeyCredential || !PublicKeyCredential.isConditionalMediationAvailable) {
    return;
  }
  const conditionalMediationAvailable = await PublicKeyCredential.isConditionalMediationAvailable();  
  if (!conditionalMediationAvailable) {
    showMessageAt("Conditional mediation is not available", "conditionalMediationError");
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
    showMessageAt("User verifying platform authenticator unavailable", "userVerifyingPlatformAuthenticatorError");
  }
  return userVerifyingPlatformAuthenticatorAvailable;
}


let conditionalLogin = async function() {
  if (!checkConditionalMediation()) return;

  const publicKeyCredentialRequestOptions = {
    challenge: CHALLENGE_DO_NOT_USE_IN_REAL_LIFE ,
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

let createPasskey = async function() {
  if (!checkConditionalMediation() ||
      !checkUserVerifyingPlatformAuthenticator()) {
    return;
  }
  abortController.abort();
  
  const username = document.getElementById("username").value;
  const credential = await navigator.credentials.create({
    publicKey: {
      challenge: CHALLENGE_DO_NOT_USE_IN_REAL_LIFE,
      pubKeyCredParams: [
        {alg: -7, type: "public-key"},
        {alg: -257, type: "public-key"},
      ],
      user: {
        id: CHALLENGE_DO_NOT_USE_IN_REAL_LIFE,
        name: username,
        displayName: username,
      },
      rp: {
        name: URL,
        id: URL,
      },
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        requireResidentKey: true,
      }
    }
  });
  if (!credential) {
    showMessageAt("Cannot create credential!", "message");
    return;
  }
  showMessageAt("Credential created: " + username, "message");
}

let updateFormForExtraField = function() {
  const extraFieldCheckbox = document.getElementById("extraFieldCheckbox");
  if (extraFieldCheckbox.checked) {
    document.getElementById("extraField").style.display = "block";
  } else {
    document.getElementById("extraField").style.display = "none";
  }
}

document.getElementById("createPasskey").onclick = createPasskey;
document.getElementById("extraFieldCheckbox").onclick = updateFormForExtraField;

checkWebAuthn();
conditionalLogin();
