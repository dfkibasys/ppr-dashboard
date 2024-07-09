# build stage (responsible for building a production-ready artifact of our Vue.js app)
FROM --platform=$BUILDPLATFORM node:18-alpine as build-stage

# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' 
COPY package.json ./
COPY package-lock.json ./

# install project dependencies
RUN npm install

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

# build app for production with minification
RUN npm run build

# production stage (responsible for serving such artifact using NGINX)
FROM --platform=$TARGETPLATFORM nginxinc/nginx-unprivileged:stable-alpine as production-stage

USER root
RUN rm -rf /usr/share/nginx/html/*

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY --from=build-stage /app/default.conf.template /etc/nginx/conf.d/default.conf.template
COPY --chmod=555 --from=build-stage /app/entrypoint.sh /docker-entrypoint.d/entrypoint.sh

RUN chown -R nginx:nginx /usr/share/nginx/html
USER nginx

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
