#!/usr/bin/env sh

# Start app
echo '' > .env

exec npm start -- --config=$(pwd)/.env
