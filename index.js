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
  points int,
  tag varchar(50),
  avatarurl varchar(100)
);`)
app.get('/', (req, res) => {
    
    getAllMembers(pool)


  pool
  .connect()
  .then(client => {
    return client
      .query('select * from members order by points desc;')
      .then(resp=>{
        let text = ""
        for(var i = 0; i <resp.rowCount; i++)
        {
          text += `<img src="${resp.rows[i].avatarurl}"> ${resp.rows[i].points} ${resp.rows[i].tag}<br>`;
        }
        res.set("Access-Control-Allow-Origin", "*");
        res.send(text);
      })
      .catch(err => {
        client.release()
        console.log(err.stack)
      })
  })
})

app.listen(process.env.PORT)
