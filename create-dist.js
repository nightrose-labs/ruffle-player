const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

function info(i) { console.log('\u001b[34m' + i + '\u001b[39m') };
function warn(w) { console.log('\u001b[33m' + w + '\u001b[39m') };
function error(e) { console.log('\u001b[31m' + e + '\u001b[39m') };

// step: prepare dist
info('step: prepare dist');
if (fs.existsSync(`${__dirname}/dist`)) {
    fs.rmSync(`${__dirname}/dist`, { recursive: true, force: true });
}
fs.mkdirSync(`${__dirname}/dist`);
fs.mkdirSync(`${__dirname}/dist/1`);
fs.mkdirSync(`${__dirname}/dist/2`);
fs.writeFileSync(`${__dirname}/dist/output.csv`, 'File,UUID');

// step: rename and copy games
info('step: rename and copy games');
fs.readdir(`${__dirname}/source`, (err, files) => {
    if (err) return error(err);
    files.forEach(file => {
        if (path.extname(file) == '.swf') {
            let uuid = crypto.randomUUID();
            info(`-- ${file} -> ${uuid}.bytes`);
            fs.copyFile(`${__dirname}/source/${file}`, `${__dirname}/dist/1/${uuid}.bytes`, (err) => {
                if (err) error(err);
            });
            fs.appendFile(`${__dirname}/dist/output.csv`, `\n${file},${uuid}`, (err) => {
                if (err) error(err);
            });
        } else {
            warn(`-- ${file} (skip)`);
        }
    });
});

// step: copy given ruffle release
info('step: copy given ruffle release');
fs.readdir(`${__dirname}/ruffle`, (err, files) => {
    if (err) return error(err);
    files.forEach(file => {
        if (file == "ruffle.js") {
            fs.copyFile(`${__dirname}/ruffle/${file}`, `${__dirname}/dist/2/1.js`, (err) => {
                if (err) error(err);
            });
        } else {
            fs.copyFile(`${__dirname}/ruffle/${file}`, `${__dirname}/dist/2/${file}`, (err) => {
                if (err) error(err);
            });
        }
    });
});

// step: create dist html file
info('step: create dist html file');
let playerJs = fs.readFileSync(`${__dirname}/source/player.js`, 'utf8');
let styleCss = fs.readFileSync(`${__dirname}/source/styles.css`, 'utf8');
let distHtml = `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>${styleCss.replace(/\r?\n|\r/g, '').replaceAll(' ', '')}</style>
        <title>...</title>
    </head>
    <body>
        <script src="./2/1.js"></script>
        <script>${playerJs.replace(/\r?\n|\r/g, '')}</script>
    </body>
</html>`;
fs.writeFileSync(`${__dirname}/dist/index.html`, distHtml);