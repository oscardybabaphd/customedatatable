# DataTable Demo App

This is a demo(CRUD) data table application using Angular7 ,Node.js and express 
## Prerequisites
- Node.js 
- Express.js
- Mysql DB
- Angular CLI

> api is writen in express and Node and the demo app is written in Angular 7.3.3. use this ([https://github.com/oscardybabaphd/express-api](https://github.com/oscardybabaphd/express-api)) link to naviagate to the api source repository 

### External library used
- sweetalert2 `npm install sweetalert2`
- > sweetalert2 for pop up notification and loader
- JQuery Calander `cdn reference in index.html`
- > for calander inputs
- ngx-smart-modal `npm install ngx-smart-modal`
- > for modals pop ups
- moment js `npm install moment`
- > for date formating

```
Note: no need to install external dependency manually on installing of Node modules all external dependencies will be download automatically
```

### Api configuration
Api source code ([https://github.com/oscardybabaphd/express-api](https://github.com/oscardybabaphd/express-api)) 

`Runing express development server`
```
> nodemon
```
- Mysql configuration

```
const  db  =  mysql.createConnection({
host:  'localhost',
user:  'root',
password:  '',
database:  'datatable'
});
```
`Database source file`
-https://github.com/oscardybabaphd/express-api/tree/master/database
```
Kindly import the database file to create table and seedin data directly using Mysql database
```



## Angular config

If express server is configured to listen to port `3000` i.e `http://localhost:3000` no need to update angular base url service. if listen port is different kindly update the base url in `services.service.ts` file
````
  export class ServicesService 
  {
    base_url = "http://localhost:3000";
    constructor(private http: HttpClient) { }
    .......
  ````
  `Run Development server` `> ng serve -o`

  ### Sample screenshot
  ![Main Table](https://github.com/oscardybabaphd/customedatatable/blob/master/imageDemo/main.JPG)

  ![Add Item](https://github.com/oscardybabaphd/customedatatable/blob/master/imageDemo/new.JPG)

  ![Update item](https://github.com/oscardybabaphd/customedatatable/blob/master/imageDemo/update.JPG)

  ![Delete](https://github.com/oscardybabaphd/customedatatable/blob/master/imageDemo/delete.JPG)

  ![Delete](https://github.com/oscardybabaphd/customedatatable/blob/master/imageDemo/view.JPG)

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
