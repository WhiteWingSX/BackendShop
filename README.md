# tienda backend

Proyecto que consiste en manipular productos y carritos a traves de la metodologia CRUD y Rest server

### Herramientas a utilizar:

* postman

### Como inicializar

1. descarga el proyecto de GitHud utilizando `git clone https://github.com/WhiteWingSX/BackendShop.git`
2. descarga los modulos de node `npm i`
3. inicia el proyecto `npm start`
4. inicializa postman y realiza las pruebas que desees, las rutas a considerar son las siguientes:

#### Productos:

**GET :** localhost:8080/api/products

**GET :** localhost:8080/api/products/:id

**POST :** localhost:8080/api/products

**PUT :** localhost:8080/api/products/:id

**DELETE :** localhost:8080/api/products/:id

#### Carrito:

**GET :** localhost:8080/api/carts/:id

**POST :** localhost:8080/api/carts/:cid/product/:pid

**POST :** localhost:8080/api/carts

```
Proyecto creado con el fin de practicar y entender
las tecnologias aplicadas
```
