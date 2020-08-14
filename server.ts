
import * as https from 'https';
import * as http from 'http';
import * as fs from 'fs';
import * as url from "url";
import * as path from "path";


const PORT: number = 8443;

const options: https.ServerOptions = {
    key:  fs.readFileSync('server-key.pem'),
    cert: fs.readFileSync('server-crt.pem'),
    requestCert: true,
    rejectUnauthorized: false,
    ca: [ fs.readFileSync('client-crt.pem'), fs.readFileSync('client-crt2.pem') ]
};

https.createServer(options, (req: http.IncomingMessage, res: http.ServerResponse) => {
    // @ts-ignore
    const cert = req.socket.getPeerCertificate();
    console.log(JSON.stringify(cert.subject));

    if (req.method === 'GET') {

        let uri = url.parse(req.url).pathname,
            filename = path.join(process.cwd(), uri);
        if (uri === '/health') {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify({message: "OK"}))
            res.end();
            return;
        }
        fs.exists(filename, function(exists) {
            if(!exists) {
                res.writeHead(404, { "Content-Type": "text/plain" });
                res.write("404 Not Found\n");
                res.end();
                console.log("404 " + req.url);
                return;
            }

            if (fs.statSync(filename).isDirectory()) {
                filename += '/index.html';
            }

            fs.readFile(filename, "binary", function(err, file) {
                if(err) {
                    res.writeHead(500, {"Content-Type": "text/plain"});
                    res.write(err + "\n");
                    res.end();
                    console.log("500 " + req.url);
                    return;
                }
                res.write(file, "binary");
                console.log("200 " + req.url);
                res.end();
            });
        });
    }
}).listen(PORT, () => console.log(`Listening ${PORT}`));