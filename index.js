const https = require('https');
const fs = require('fs');

const testFolder = './data/';

function path(i) {
    return `./data/${i}`;
}

function json(i) {
    return `./data/${i}.json`;
}

function url(i) {
    return `https://hacker-news.firebaseio.com/v0/item/${i}.json?print=pretty`;
}

fs.readdir(testFolder, (err, files) => {
    files.forEach(file => {
        fs.readFile(path(file), 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }        

            const obj = JSON.parse(data);
            if (!obj.kids) {
                obj.kids = [];
            }
            for (const k of obj.kids) {
                const filename = json(k);
                fs.access(filename, fs.F_OK, (err) => {
                    if (err) {
                      https.get(url(k), (resp) => {
                          let data = '';

                          resp.on('data', (chunk) => {
                            data += chunk;
                          });

                          resp.on('end', () => {
                              fs.writeFile(filename, data, err => {
                                if (err) {
                                    console.log(err);
                                    return;
                                }

                                console.log('Wrote', filename);
                              });
                          });
                      })
                    }
                })
            }
        });
    });
});

