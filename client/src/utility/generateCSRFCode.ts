const generateCSRFCode = async () => {
  const byteLength = 16;
  const randomBytes = new Uint8Array(byteLength);
  window.crypto.getRandomValues(randomBytes);

  const hashBuffer = await window.crypto.subtle.digest('SHA-256', randomBytes);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const csrfCode = hashArray
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

  return csrfCode;
};

export default generateCSRFCode;
