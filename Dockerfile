FROM node:24-alpine AS build
WORKDIR /app
RUN apk add --no-cache git \
	&& git clone --depth 1 https://github.com/hyoo-ru/mam.git . \
	&& git clone --depth 1 https://github.com/b-on-g/bog.git bog \
	&& npm install
COPY . bog/max/
RUN cd bog/max \
	&& ( [ -d .git ] || ( git init -q && git -c user.name=build -c user.email=build@local commit -q --allow-empty -m build ) ) \
	&& git checkout -q --detach \
	&& cd ../.. \
	&& npx mam bog/max/app && npx mam bog/max/bot/run

FROM nginx:alpine AS app
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/bog/max/app/- /usr/share/nginx/html
EXPOSE 80

FROM node:24-alpine AS bot
WORKDIR /bot
COPY docker/russian_trusted_root_ca.pem /usr/local/share/ca-certificates/russian_trusted_root_ca.crt
RUN apk add --no-cache ca-certificates && update-ca-certificates
ENV NODE_EXTRA_CA_CERTS=/usr/local/share/ca-certificates/russian_trusted_root_ca.crt
COPY --from=build /app/bog/max/bot/run/- /bot
RUN npm install --omit=dev
EXPOSE 9090
CMD [ "node", "node.js", "port=9090" ]
