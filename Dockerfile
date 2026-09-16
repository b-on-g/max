FROM node:24-alpine AS build
WORKDIR /app
RUN apk add --no-cache git \
	&& git clone --depth 1 https://github.com/hyoo-ru/mam.git . \
	&& git clone --depth 1 https://github.com/b-on-g/bog.git bog \
	&& npm install
COPY . bog/max/
RUN npx mam bog/max/app && npx mam bog/max/bot/run

FROM nginx:alpine AS app
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/bog/max/app/- /usr/share/nginx/html
EXPOSE 80

FROM node:24-alpine AS bot
WORKDIR /bot
COPY --from=build /app/bog/max/bot/run/- /bot
RUN npm install --omit=dev
EXPOSE 9090
CMD [ "node", "node.js", "port=9090" ]
