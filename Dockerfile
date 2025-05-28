# Базовый образ Node.js
FROM node:14

# Установка зависимостей
WORKDIR /app
COPY package.json /app/package.json
RUN npm install

# Копирование приложения
COPY app.js /app/app.js

# Запуск приложения
CMD ["npm", "start"]
