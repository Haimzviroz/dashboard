# Multistage Dockerfile to build a node application

FROM node:19.5.0-alpine
USER root

WORKDIR /getapp-dashboard

# ===   create a uid and a gid to fit CTS project uid === #
ARG uid=1004370000
ARG username=getapp
# Add the user to /etc/passwd
RUN echo "${username}:x:${uid}:${uid}:${username}:/home/${username}:/sbin/nologin" >> /etc/passwd
# Add the user to /etc/group
RUN echo "${username}:x:${uid}:" 

RUN chown -R ${uid}:${uid} /getapp-dashboard

# ===   install ca sofeware === #
# Install the ca-certificates package to manage certificates
RUN apk update && apk --no-cache add ca-certificates bash curl
# Create the CA certificates directory
RUN mkdir -p /usr/local/share/ca-certificates/

COPY --chown=${uid}:${uid} package.json package.json
COPY --chown=${uid}:${uid} package-lock.json package-lock.json
RUN npm i

COPY --chown=${uid}:${uid} . .
ARG dashboard_version_tag
ENV dashboard_version_tag=$dashboard_version_tag
RUN echo "$dashboard_version_tag" > dashboard_version_tag.txt
RUN cat dashboard_version_tag.txt

# RUN npm run test

# CMD [ "npm" , "run", "start"]
