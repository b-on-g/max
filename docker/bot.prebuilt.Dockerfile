FROM node:24-alpine
WORKDIR /bot
COPY russian_trusted_root_ca.pem /usr/local/share/ca-certificates/russian_trusted_root_ca.crt
RUN apk add --no-cache ca-certificates && update-ca-certificates
ENV NODE_EXTRA_CA_CERTS=/usr/local/share/ca-certificates/russian_trusted_root_ca.crt
COPY node.js package.json /bot/
RUN npm install --omit=dev
EXPOSE 9090
CMD [ "node", "node.js", "port=9090" ]
