Getting started 

* create project
    * yarn init -l 


* build project
    * yarn dev
    * create .env file

* dependencies
    * yarn add express
    * node add sucrase nodemon -d
    * yarn add sequelize ( Database ORM )
    * yarn add sequelize-cli ( ORM cli) 
    * yarn add mysql2 (Database Mysql)
    * yarn add dotenv ( Build Global ENVORIMENT VARIABLES )
    * yarn add bcryptjs ( Security random generation numbers )
    * yarn add jsonwebtoken ( token provider )
    * yarn add yup (Data validator )
    * yarn add cors ( Allow to others applications access API) 
    * yarn add sequelize-hierarchy ( Provide Hierarchy) 
    * yarn add googleapis ( Google Api Autentication )
    * yarn add query-string ( Append parameters to url )
    * yarn add axios ( Promise based HTTP client )

* Sequelize
    * Migrations
        * yarn sequelize migration:create --name=create-users
        * yarn sequelize migration:create --name=create-scales
        * yarn sequelize migration:create --name=create-option-answers
        * yarn sequelize migration:create --name=create-criteria
        * yarn sequelize migration:create --name=create-scale-results
        * yarn sequelize migration:create --name=create-social-accounts
    
    * Run migrations
        * yarn sequelize db:migrate
        * yarn sequelize db:migrate:undo:all
