# BACK-END

1. Prerequisites
On the back-end, we used :
 
* [Node.js](https://nodejs.org/en/).
* [Express](https://expressjs.com/).
* [mysql](https://www.mysql.com/downloads/) using [xampp](https://www.apachefriends.org/index.html).

2. Installation

* [Debian](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)

3. Database

Create a database with mongoDB
```sh
mongo
> show dbs # To see all Databases exist on the SGDB
> use api_db
> db # Show the current DB
```
We have to use a MySQL database. Then, first we have to install the database. How?
* Have to install [xampp](https://www.apachefriends.org/index.html) or mySQL on your PC or using Docker if it's possible
* Then, have to create a database named as you wish. But the most important, you have to write the same name on the environment file _.env_.

Once this is done, we have to execute the scripts to create Database and tables. Use your favorite SGBD for that. 

For example :

I used "phpmyadmin", and I copied scripts found into the _config/migrations.sql_ file, and I pasted it on the terminal into my SGBD. 

Once done. It's time to run server or test scripts already exists.

1. Test 
```shell
yarn test
```
If everything is ok, that means your installation is done. Else, you have to check your installation again or ask for help.

2. Server
```shell
yarn start
```

> The Back-end server is running on port 9000.

NB : One file called _.env.example_ is created in the root of the project. It's a file that contains all the environment variables. 
It's where you have to write the name of your database, username and password.

This file is not necessary to commit it. It's just a way to store your local environment variables.

