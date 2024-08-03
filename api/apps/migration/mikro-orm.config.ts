import * as dotenv from 'dotenv';

dotenv.config({ path: './.env' });

let MikroOrmConfig;

if(process.env.NODE_ENV === "development") 
    MikroOrmConfig = require('./mikro-orm.sqlite.config').default;
else 
    MikroOrmConfig = require('./mikro-orm.postgre.config').default;

export default MikroOrmConfig;