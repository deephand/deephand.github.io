let checkConditionalMediation = async function() {
  if (!window.PublicKeyCredential || !PublicKeyCredential.isConditionalMediationAvailable) {
    return;
  }
  const conditionalMediationAvailable = await PublicKeyCredential.isConditionalMediationAvailable();  
  if (!conditionalMediationAvailable) {
    const error = document.getElementById("error");
    error.innerText = "Conditional mediation is not available";
    error.style.display = 'block';
    return false;
  }
  return true;
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