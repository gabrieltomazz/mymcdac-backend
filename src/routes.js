import { Router } from 'express';
import User from './app/models/User';

const routes = new Router();


routes.get('/', async (req, res) =>  {

    // const user = await User.create({
    //     name: 'Gabriel Lima',
    //     email: 'gabriel.lima@mymcdac.com',
    //     university: 'UnB',
    //     country: 'Brazil',
    //     password_hash: '1235453463'
    // })
    // return res.json(user);
    //eturn res.json({ message: 'Hello World! MyMCDA-C 2.0'})
})


export default routes;