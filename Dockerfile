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
FROM --platform=$TARGETPLATFORM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

COPY --from=build-stage /app/default.conf.template /etc/nginx/conf.d/default.conf.template
COPY --from=build-stage /app/entrypoint.sh /usr/share/nginx/

EXPOSE 80
ENTRYPOINT ["/usr/share/nginx/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
