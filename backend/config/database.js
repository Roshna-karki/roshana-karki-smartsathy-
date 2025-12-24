const {Pool}= require('pg');

const pool= new Pool({
    user:   'postgres',
    host:   'localhost',
    database: 'SmartSathy',
    password: '2004',
    port:   5432,
});

pool.query('SELECT NOW()', (err, res) => {
    if(err){
        console.error('Error executing query', err.stack);  
    } else {
        console.log('Current time:', res.rows[0]);
    }
});

module.exports= pool;