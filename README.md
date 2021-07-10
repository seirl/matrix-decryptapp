# matrix-decryptapp

Matrix Decryptapp is a simple client-side web app that can decrypt encrypted
matrix URIs (`emxc://...`) entirely in the browser, then display the resulting
blob in an iframe.

This is useful for non-web clients like Weechat which cannot otherwise display
encrypted images without using an external script.

## Usage

### Weechat

This trigger replaces all `emxc://` URLs to use an instance of this app hosted
on https://seirl.github.io/ :

    /trigger addreplace emxc_decrypt modifier weechat_print "" "!emxc://([^ ]+)!https://seirl.github.io/matrix-decryptapp/#${re:0}!"

If you do not trust this website to keep your encrypted URIs secure, the URL
in the trigger can be replaced by your own deployment of this static website.


## Development

Install dependencies:

    npm install

Serve the website and preview your local changes in your browser:

    npm run watch

Deploy on Github Pages:

    npm run deploy
