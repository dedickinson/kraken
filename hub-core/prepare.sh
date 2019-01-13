#!/bin/bash -xe

# Prepares various configuration files for the hub-core deployment

# Containers
DOCKER_IMAGE_CONSUL=dedickinson/hub-infra-consul
DOCKER_IMAGE_DEBUG_GENERAL=dedickinson/hub-debug-general

# General configuration
CONFIG_DIR=config
ENV_KRAKEN_FILE=.env

EXTIP=$(docker run --rm --net=host $DOCKER_IMAGE_DEBUG_GENERAL extip.sh)
EXTIF=$(docker run --rm --net=host $DOCKER_IMAGE_DEBUG_GENERAL extif.sh)
DNS_RECURSOR=$(systemd-resolve --status $EXTIF | grep '^[[:blank:]]*DNS Servers' | xargs | cut -d':' -f2 | xargs)

VOLUME_STORE=/var/local/kraken/volumes

# Consul configuration
CONSUL_DNS_PORT=53
CONSUL_HTTP_PORT=8500
CONSUL_BOOTSTRAP_EXPECT=1
FILE_CONSUL_ENCRYPT=$CONFIG_DIR/consul_encrypt

# Vault configuration
VAULT_PORT=8200

# LDAP configuration
LDAP_ORGANISATION="Kraken Labs"
LDAP_DOMAIN=kraken.local
LDAP_PORT_SECURE=636

# Postgres configuration
POSTGRES_PORT=5432

# Start of script
cat << EOM
########################################
Preparing for THE KRAKEN

External IP: $EXTIP (on $EXTIF)
DNS Recursor: $DNS_RECURSOR

########################################
EOM


mkdir -p $CONFIG_DIR

if [ ! -f $FILE_CONSUL_ENCRYPT ]; then
    docker run --rm $DOCKER_IMAGE_CONSUL keygen > $FILE_CONSUL_ENCRYPT
fi

CONSUL_ENCRYPT_KEY=$(cat $FILE_CONSUL_ENCRYPT)

cat << EOM > $ENV_KRAKEN_FILE
EXTIP=$EXTIP
EXTIF=$EXTIF
DNS_RECURSOR=$DNS_RECURSOR
VOLUME_STORE=$VOLUME_STORE

# Consul configuration
CONSUL_DNS_PORT=$CONSUL_DNS_PORT
CONSUL_HTTP_PORT=$CONSUL_HTTP_PORT
CONSUL_BOOTSTRAP_EXPECT=$CONSUL_BOOTSTRAP_EXPECT
CONSUL_ENCRYPT_KEY=$CONSUL_ENCRYPT_KEY

# Vault configuration
VAULT_PORT=$VAULT_PORT

# LDAP configuration
LDAP_ORGANISATION=$LDAP_ORGANISATION
LDAP_DOMAIN=$LDAP_DOMAIN
LDAP_PORT_SECURE=$LDAP_PORT_SECURE

# Postgres configuration
POSTGRES_PORT=$POSTGRES_PORT

EOM

cat << EOM
########################################
THE KRAKEN AWAKES!

Ready for you to run:

    docker-compose up

########################################
EOM