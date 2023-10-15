# Use uma imagem base Node.js compatível com a versão 18 especificada
FROM node:18

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie os arquivos package.json e package-lock.json para o contêiner
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie os arquivos de origem para o contêiner
COPY . .

# Exponha a porta em que o aplicativo estará ouvindo
EXPOSE 3333

# Comando para iniciar o aplicativo
CMD ["npm", "start"]
