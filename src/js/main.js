import encrypt from 'browser-encrypt-attachment';
import { guessmime } from './guessmime';

async function decryptFileFromUrl(emxc_url) {
    const httpsUrl = new URL(emxc_url.replace("emxc", "https"));

    const k = httpsUrl.searchParams.get("key");
    const iv = httpsUrl.searchParams.get("iv");
    const hash = httpsUrl.searchParams.get("hash");
    const mimeFromUrl = httpsUrl.searchParams.get("mimetype");

    const key = {
        "kty": "oct",
        "key_ops": [
            "decrypt", "encrypt"
        ],
        "k": k,
        "alg": "A256CTR"
    };
    httpsUrl.search = "";
    const response = await fetch(httpsUrl);
    const buffer = await response.arrayBuffer();
    const data = await encrypt.decryptAttachment(
        buffer, { key, iv, hashes: { sha256: hash } });
    const type = mimeFromUrl || guessmime(data);
    const blob = new Blob([data], { type });
    const href = URL.createObjectURL(blob);
    document.write(`
        <style>body, html { margin: 0; padding: 0; }</style>
        <iframe src="${href}" frameborder="0" style="width:100%; height: 100%" sandbox>
        </iframe>
    `);
}

if (window.location.hash) {
    const emxcUrl = window.location.hash.substring(1);
    decryptFileFromUrl(emxcUrl);
}
