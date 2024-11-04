FROM node:lts AS runtime
WORKDIR /app

COPY . .

RUN npm install \
    && npm run dev

ENV HOST=127.0.0.1
ENV PORT=4321
EXPOSE 4321
CMD ["npm", "start"]