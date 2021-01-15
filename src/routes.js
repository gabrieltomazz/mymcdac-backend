import { Router } from 'express';


const routes = new Router();


routes.get('/', (req, res) =>  {
    return res.json({ message: 'Hello World! MyMCDA-C 2.0'})
})


export default routes;