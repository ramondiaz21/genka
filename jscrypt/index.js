
// Función para encriptar una contraseña
function encriptarContrasena(contrasena) {
  // Codificación MD5
  const md5Hash = CryptoJS.MD5(contrasena).toString();

  // Codificación hexadecimal
  const hexEncoded = CryptoJS.enc.Hex.parse(md5Hash).toString();

  // Encriptación en base64
  const base64Encoded = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Hex.parse(hexEncoded));

  return base64Encoded;
}

// Ejemplo de uso
const contrasenaSinEncriptar = "36Genka-";
const contrasenaEncriptada = encriptarContrasena(contrasenaSinEncriptar);
console.log(contrasenaEncriptada);
