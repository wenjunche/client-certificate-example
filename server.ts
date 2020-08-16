
import express from "express";
import * as https from 'https';
import * as fs from 'fs';

import OSU from '@openfin/service-utils';
import loggerMiddleware from '@openfin/service-utils/modules/middleware/logger';
import datadogMiddleware from '@openfin/service-utils/modules/middleware/datadog';
const osu = OSU(process.env.APP_NAME || 'client-cert-test');
const { logger, statsD } = osu;
const middleware = [loggerMiddleware(logger), datadogMiddleware(statsD)]

const HTTPS_PORT: number = 8443;

const app = express();
app.use(...middleware);
app.get('/health', (req, res) => {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify({message: "OK"}))
    res.end();
});

app.use("/", (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // @ts-ignore
    const cert = req.socket.getPeerCertificate();
    logger.info(JSON.stringify(cert.subject));
    next();
}, express.static("./"));

const options: https.ServerOptions = {
    key:  fs.readFileSync('server-key.pem'),
    cert: fs.readFileSync('server-crt.pem'),
    requestCert: true,
    rejectUnauthorized: false,
    ca: [ fs.readFileSync('client-crt.pem'), fs.readFileSync('client-crt2.pem') ]
};

if (process.env.SERVER_KEY) {
    options.key = decode64(process.env.SERVER_KEY);
    options.cert = decode64(process.env.SERVER_CRT);
    logger.info('setting server key and cert from env');
}

https.createServer(options, app).listen(HTTPS_PORT, () => {
    logger.info(`Listening ${HTTPS_PORT}`);
});


// function encode64(data: string): string {
//     const buff = Buffer.from(data);
//     return buff.toString('base64');
// }

function decode64(data: string): string {
    const buff = Buffer.from(data, 'base64');
    return buff.toString('ascii');    
}