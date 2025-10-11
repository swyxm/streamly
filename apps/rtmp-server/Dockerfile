FROM node:14-alpine

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install
RUN apk add --no-cache ffmpeg
RUN cp /usr/bin/ffmpeg ./ffmpeg
COPY index.js ./

RUN ls -la index.js package.json ffmpeg

EXPOSE 8000 1935

CMD ["node", "index.js"]
