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
      let text = ""
      for(var i = 0; i <resp.rowCount; i++)
      {
        text += `<img src="${resp.rows[i].avatarurl}"> ${resp.rows[i].points} ${resp.rows[i].tag}<br>`;
      }
      res.set("Access-Control-Allow-Origin", "*");
      res.send(text);
    });
})

app.listen(process.env.PORT)

async function getAllMembers(pool)
{
    await pool.connect();
    resp =  pool.query('select * from members order by points desc;')
    return resp;
}