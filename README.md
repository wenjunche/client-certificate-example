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

