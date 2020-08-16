# client-certificate-example

Example of client certificates with node and OpenFin

# Import client certificate

1. open Certificate Manager
2. import client-crt.p12 and client-crt2.p12 to Personal->Certificates

# Test in OpenFin Runtime
1. start Runtime
2. npm run start
3. window.open('https://localhost:8443/index.html')


# Create new certificates

## Create server certificate
1. openssl req -x509 -days 365 -nodes -sha256 -newkey rsa:4096 -keyout server-key.pem -out server-crt.pem

## Create client certificate
1. openssl req -x509 -days 365 -nodes -sha256 -newkey rsa:4096 -keyout client-key.pem -out client-crt.pem

2. curl -v -k -E client-crt.pem --key client-key.pem  https://localhost:8443

## Import client certifcate to Windows (Windows 10)
1. openssl pkcs12 -export -nodes -inkey client-key.pem -in client-crt.pem -out client-crt.p12 -passout pass:testclient

2. open p12 in File Explorer

3. verify in Manage User Certificate->Personal->Certificates


# Deploy and test in the cloud
1. deployed as a service in ECS
2. server chain certificate and key are read from environement variables as base64 encoded strings
3. start RVM with https://client-cert-test-dev.openfin.co/app.json?runtimeVersion=nnn to test certficate picker in RVM and Runtime
4. start RVM with https://of.os.openfin.co/api/app.json?runtime=beta&appurl=https://client-cert-test-dev.openfin.co/index.html to test certificate picker just for Runtime 
