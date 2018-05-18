<h1 align="center">
  <br>
  <a href="http://www.amitmerchant.com/electron-markdownify">
    <img src="https://i.imgur.com/pMoAQrN.png" width=180>
  </a>
  <br>
  SPIDER Gap Analysis
  <br>
</h1>

<h4 align="center">A helper tool for gap analysis in the context of <a href="https://www.softex.br/wp-content/uploads/2013/07/MPS.BR_Guia_Geral_Software_2016.pdf">MR-MPS-SW</a></h4>

Basic feature list:

  * Multiple **role** support for both **admin** and **reviewer**
  * **Simplified evaluation interface** to speed up analysis step
  * Auto generated **reports** based on analysis made inside the tool

## Deploy

<p align="center">
  <img src="https://i.imgur.com/BXttoX9.gif">
</p>

> Install [NodeJS 8.6](https://nodejs.org/en/) or higher.

```sh
# clone or download the source
git clone git@github.com:projeto-spider/spider-gap-analysis.git my-folder-name

# go to the folder
cd my-folder-name

# install dependencies
npm install

# your .env file setups things like database connection (default sqlite)
cp .env.example .env

# build the app
npm run migrate
npm run seed
npm run build

# start the server
npm start
```

Go to [`localhost:3000`](http://localhost:3000) to see the application running.

## Development

```sh
# clone or download the source
git clone git@github.com:projeto-spider/spider-gap-analysis.git my-folder-name

# go to the folder
cd my-folder-name

# install dependencies
npm install

# your .env file setups things like database connection (default sqlite)
cp .env.example .env

# build the app
npm run migrate
npm run seed

# start the server
npm run dev
```

![Lubien](https://avatars.githubusercontent.com/u/9121359?s=130) | ![Silvia Mariana Furtado Brabo](https://i.imgur.com/2LS5EW2.jpg?1)
---|---
[Lubien](http://lubien.me) | [Silvia Mariana Furtado Brabo](http://lattes.cnpq.br/1776074731805961)

Special thanks to **[@rian-vergara](https://github.com/rian-vergara)** for our logo.

## Learn more

  * Projeto SPIDER official website (in portuguese): http://spider.ufpa.br/
  * AdonisJS framework used in our back-end: https://adonisjs.com/
  * Nuxt framework used in our front-end: https://nuxtjs.org/

