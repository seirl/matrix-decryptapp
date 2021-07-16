import encrypt from 'browser-encrypt-attachment';
import { guessmime } from './guessmime';

async function decryptFileFromUrl(emxc_url) {
    const httpsUrl = new URL(emxc_url.replace("emxc", "https"));

    const key = httpsUrl.searchParams.get("key");
    const iv = httpsUrl.searchParams.get("iv");
    const hash = httpsUrl.searchParams.get("hash");
    const mimeFromUrl = httpsUrl.searchParams.get("mimetype");

    const keyObj = {
        "kty": "oct",
        "key_ops": [
            "decrypt", "encrypt"
        ],
        "k": key,
        "alg": "A256CTR"
    };
    const info = { key: keyObj, iv, hashes: { sha256: hash } };
    httpsUrl.search = "";

    const response = await fetch(httpsUrl);
    const buffer = await response.arrayBuffer();
    const data = await encrypt.decryptAttachment(buffer, info);
    const type = mimeFromUrl || guessmime(data);
    const blob = new Blob([data], { type });
    const href = URL.createObjectURL(blob);

    const kBrokenChromeMimes = /^video\//;
    if (!!window.chrome && type.match(kBrokenChromeMimes)) {
        // Chrome is dumb as a brick and garbage-collects the blob/ref before it can be displayed on reload.
        // Use an iframe instead.
        console.log("Falling back to an iframe for", href);
        document.write(`
            <style>body, html { margin: 0; padding: 0; }</style>
            <iframe src="${href}" frameborder="0" style="width:100%; height: 100%"></iframe>
        `);
    } else {
        window.location.href = href;
    }
}

if (window.location.hash) {
    const emxcUrl = window.location.hash.substring(1);
    decryptFileFromUrl(emxcUrl);
}
