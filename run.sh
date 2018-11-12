#!/bin/bash -e

set -e

# read the environment to decide what the hostname and port
# of the sawtooth validator is and rewrite the nginx.confg
# using those values

# by default we assume we are running inside the k8s pod
# so the network is available on 127.0.0.1
export REST_API_HOSTNAME=${REST_API_HOSTNAME:="127.0.0.1"}
export REST_API_PORT=${REST_API_PORT:="8080"}
cat /etc/nginx/nginx.template.conf | DOLLAR='$' envsubst > /etc/nginx/nginx.conf
nginx -g 'daemon off;'