const { generateKeyPairSync } = require("crypto");
const fs = require("fs");

// 1. Generar clave privada RSA
const { privateKey, publicKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem",
  },
  publicKeyEncoding: {
    type: "spki",
    format: "pem",
  },
});

// guardar private.key
fs.writeFileSync("private.key", privateKey);

console.log("private.key generado");

// 2. Crear CSR usando node-forge
const forge = require("node-forge");

const pki = forge.pki;

const privateKeyForge = pki.privateKeyFromPem(privateKey);
const publicKeyForge = pki.publicKeyFromPem(publicKey);

const csr = pki.createCertificationRequest();

csr.publicKey = publicKeyForge;

csr.setSubject([
  { name: "countryName", value: "AR" },
  { name: "organizationName", value: "Mi Empresa SA" },
  { name: "commonName", value: "facturacion" },
]);

csr.sign(privateKeyForge);

const pem = pki.certificationRequestToPem(csr);

fs.writeFileSync("request.csr", pem);

console.log("request.csr generado");