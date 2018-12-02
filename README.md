
## Pre-requisites

### Docker

Install the Docker CLI on your development machine. The [static downloads](https://download.docker.com/) for Docker lets you just install the CLI (`docker`) and not the service (`dockerd`). Place the `docker` executable into
a folder on the `PATH`.

### Vagrant

Install plugins:

    vagrant plugin install vagrant-docker-compose

## Preparing the kraken host

The `Vagrantfile` was created with:

    vagrant init bento/ubuntu-18.04

To start the box on a Windows VM, start PowerShell as an administrator and:

    vagrant up --provider=hyperv

Vagrant will take care of installing Docker and Docker Compose.

### Setup root and intermediate certificates

Refer to: [OpenSSL Certificate Authority](https://jamielinux.com/docs/openssl-certificate-authority/index.html)

````bash
sudo -i
cd /root
mkdir ca
cd ca

mkdir certs crl newcerts private
chmod 700 private
touch index.txt
echo 1000 > serial

# Create the root key
openssl genrsa -aes256 -out private/ca.key.pem 4096
chmod 400 private/ca.key.pem

# Create the root certificate
# Make sure you set a Common Name - e.g.
#   Organizational Unit Name []:Kraken Certificate Authority
#   Common Name []:Kraken Root CA
openssl req -config openssl.cnf \
      -key private/ca.key.pem \
      -new -x509 -days 7300 -sha256 -extensions v3_ca \
      -out certs/ca.cert.pem

chmod 444 certs/ca.cert.pem

# Verify the root certificate
# openssl x509 -noout -text -in certs/ca.cert.pem

# Prepare the internediate pair
mkdir /root/ca/intermediate
cd intermediate
mkdir certs crl csr newcerts private
chmod 700 private
touch index.txt
echo 1000 > serial
echo 1000 > crlnumber

# Create the intermediate key
cd /root/ca
openssl genrsa -aes256 \
    -out intermediate/private/intermediate.key.pem 4096
chmod 400 intermediate/private/intermediate.key.pem

# Create the intermediate certificate
# Make sure you set a different Common Name to the root cert - e.g.
#   Organizational Unit Name []:Kraken Certificate Authority
#   Common Name []:Kraken Intermediate CA
openssl req -config intermediate/openssl.cnf -new -sha256 \
    -key intermediate/private/intermediate.key.pem \
    -out intermediate/csr/intermediate.csr.pem

openssl ca -config openssl.cnf -extensions v3_intermediate_ca \
    -days 3650 -notext -md sha256 \
    -in intermediate/csr/intermediate.csr.pem \
    -out intermediate/certs/intermediate.cert.pem

chmod 444 intermediate/certs/intermediate.cert.pem

# Create the certificate chain file
cat intermediate/certs/intermediate.cert.pem \
    certs/ca.cert.pem > intermediate/certs/ca-chain.cert.pem
````

### Setup Docker

Refer to: [Protect the Docker daemon socket](https://docs.docker.com/engine/security/https/)

#### Create the server key

````bash
# Create the server key
cd /root/ca
openssl genrsa  \
    -out intermediate/private/docker.kraken.local.key.pem 4096
chmod 400 intermediate/private/docker.kraken.local.key.pem

# Create the signing request
#   Organizational Unit Name []:Kraken Certificate Authority
#   Common Name []: kraken.local
openssl req -new -sha256 -config intermediate/openssl.cnf \
    -key intermediate/private/docker.kraken.local.key.pem \
    -subj "/CN=docker.kraken.local" \
    -out intermediate/csr/docker.kraken.local.csr.pem

# Create the certificate
mkdir tmp
echo subjectAltName = DNS:docker.kraken.local,IP:127.0.0.1 > tmp/docker.kraken.local.extfile.cnf
echo extendedKeyUsage = serverAuth >> tmp/docker.kraken.local.extfile.cnf

openssl ca -config intermediate/openssl.cnf \
      -extensions server_cert -days 375 -notext -md sha256 \
      -in intermediate/csr/docker.kraken.local.csr.pem \
      -out intermediate/certs/docker.kraken.local.cert.pem

chmod 444 intermediate/certs/docker.kraken.local.cert.pem

# Verify
openssl x509 -noout -text \
    -in intermediate/certs/docker.kraken.local.cert.pem
````

#### Create the client key

````bash
# Create the client key
cd /root/ca
openssl genrsa \
    -out intermediate/private/client.key.pem 4096
chmod 400 intermediate/private/client.key.pem

# Create the signing request
#   Organizational Unit Name []:Kraken Certificate Authority
#   Common Name []: client@kraken.local
openssl req -config intermediate/openssl.cnf \
    -key intermediate/private/client.key.pem \
    -new -sha256 \
    -subj '/CN=client' \
    -out intermediate/csr/client.csr.pem

# Create the certificate
openssl ca -config intermediate/openssl.cnf \
      -days 375 -notext -md sha256 \
      -in intermediate/csr/client.csr.pem \
      -out intermediate/certs/client.cert.pem

chmod 444 intermediate/certs/client.cert.pem

# Check it
openssl x509 -noout -text \
    -in intermediate/certs/client.cert.pem
````

Connect:

    docker --tlsverify \
        --tlscacert=/root/ca/intermediate/certs/ca-chain.cert.pem \
        --tlscert=/root/ca/intermediate/certs/client.cert.pem \
        --tlskey=/root/ca/intermediate/private/client.key.pem \
        --host=docker.kraken.local:2376 version

The various certificates can be placed in a user's `~/.docker/` directory:

    mkdir -pv ~/.docker
    chmod 700 ~/.docker
    cp -v /root/ca/intermediate/certs/ca-chain.cert.pem ~/.docker/ca.pem
    cp -v /root/ca/intermediate/certs/client.cert.pem ~/.docker/cert.pem
    cp -v /root/ca/intermediate/private/client.key.pem ~/.docker/key.pem

To point at the docker host, set the `DOCKER_HOST` environment variable:

    export DOCKER_HOST=tcp://docker.kraken.local:2376 DOCKER_TLS_VERIFY=1

or in Powershell:

    $Env:DOCKER_HOST += "tcp://docker.kraken.local:2376"

Make sure your DNS/`/etc/hosts`/`C:\Windows\System32\Drivers\etc\hosts` maps 
to your docker host.

You should now be able to run 

    docker run hello-world

... and in Powershell:

    docker --tlsverify run hello-world

See also:

- https://success.docker.com/article/how-do-i-enable-the-remote-api-for-dockerd
- https://docs.docker.com/engine/security/https/#create-a-ca-server-and-client-keys-with-openssl

#### Configure the docker service

1. Copy `daemon.json` to `/etc/docker/`
1. Copy `override.conf` to `/etc/systemd/system/docker.service.d/`

### References

- [Learning to Use Vagrant on Windows 10](https://blogs.technet.microsoft.com/virtualization/2017/07/06/vagrant-and-hyper-v-tips-and-tricks/)
- [Vagrant plugins](https://github.com/hashicorp/vagrant/wiki/Available-Vagrant-Plugins)

## Installing components

### Gitea

URL: https://docs.gitea.io/en-us/install-with-docker/

### Portus

URL: https://hub.docker.com/r/opensuse/portus/