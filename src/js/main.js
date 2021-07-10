import encrypt from 'browser-encrypt-attachment';
import { guessmime } from './guessmime';

function decryptFileFromUrl(emxc_url) {
    var https_url = new URL(emxc_url.replace("emxc", "https"));

    var key = https_url.searchParams.get("key")
    var iv = https_url.searchParams.get("iv")
    var hash = https_url.searchParams.get("hash")

    var keyObj = {
        "kty": "oct",
        "key_ops": [
          "decrypt", "encrypt"
        ],
        "k": key,
        "alg": "A256CTR"
    }

    var info = {key: keyObj, iv: iv, hashes: {sha256: hash}};
    https_url.search = "";

    var req = new Request(https_url);
    return fetch(req).then(function(response) {
        return response.arrayBuffer();
    }).then(function(buffer) {
        return encrypt.decryptAttachment(buffer, info);
    }).then((data) => {
        // console.log(guessmime(data));
        var blob = new Blob([data], {type: guessmime(data)});
        var reader = new FileReader();
        reader.onloadend = function(e) {
            var iframe = document.querySelector("#content")
            iframe.setAttribute("src", reader.result);
        }
        reader.readAsDataURL(blob);
    });
}

if (window.location.hash) {
    var emxc_url = window.location.hash.substring(1);
    decryptFileFromUrl(emxc_url);
}
