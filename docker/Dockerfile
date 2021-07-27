# --------------------------------------------------------------- DWP base build
FROM node:lts-alpine@sha256:fb6cb918cc72869bd625940f42a7d8ae035c4e786d08187b94e8b91c6a534dfd as nodebuild

# Prepare work folders
RUN mkdir -p /opt/raw /opt/build; chown -R node:node /opt/raw /opt/build

# Generate deployable package
WORKDIR /opt/raw
COPY . .
RUN npm ci --no-optional
RUN npm pack
RUN npm prune --production

# Copy assets to target
WORKDIR /opt/build
RUN tar -xf /opt/raw/user-location-api-*.tgz --strip 1 -C /opt/build
RUN cp -R /opt/raw/node_modules /opt/build/

# --------------------------------------------------- Build container entrypoint
FROM nodebuild

# The [ci] labels should be completed by the build service at image-build time
# using `--label` option.
# version = semantic version (may have +dev suffix)
# build_src = git URL (including commit sha) from which image was built
LABEL application="pension-credit/distributer-ui"
LABEL maintainer="Pension Credit Team"
LABEL version="[ci]"
LABEL build_src="[ci]"

ARG APP_FOLDER=/opt/app/
ARG HARDEN_FOLDER=/opt/harden/

WORKDIR ${APP_FOLDER}
COPY --from=nodebuild /opt/build .
COPY docker/init.sh ${APP_FOLDER}

# RUN apk add --update --no-cache openssl=1.1.1k-r0 musl=1.1.24-r3

WORKDIR ${APP_FOLDER}

# remove root user privilidge
RUN chown -R node:node ${APP_FOLDER}

WORKDIR ${HARDEN_FOLDER}

# Download and verify hardening script
ADD https://raw.githubusercontent.com/dwp/packer-infrastructure/master/docker-builder/scripts/base/harden.sh harden.sh
COPY docker/harden.sh.md5 .
RUN md5sum -c harden.sh.md5

RUN chmod +x ${HARDEN_FOLDER}harden.sh && sh ${HARDEN_FOLDER}harden.sh && rm ${HARDEN_FOLDER}harden.sh

USER node

WORKDIR ${APP_FOLDER}

ENTRYPOINT ["/bin/sh", "init.sh"]
