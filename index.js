const express = require('express')
const app = express()
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
pool.query(`CREATE TABLE IF NOT EXISTS members (
    userId varchar(20) PRIMARY KEY,
    points int
);`)
app.get('/', (req, res) => {
    
    getAllMembers(pool).then(resp=>{
      res.writeHead(200,{"Access-Control-Allow-Origin": "*"});
      res.send(JSON.stringify(resp));
    });
})

app.listen(process.env.PORT)

async function getAllMembers(pool)
{
    await pool.connect();
    resp =  pool.query('select * from members order by points desc;')
    return resp;
}