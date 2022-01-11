const express = require('express')
const app = express()
const port = 3000
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
    await pool.connect();
    resp = await pool.query('select * from members;')
    res.send(JSON.stringify(resp))
})

app.listen(process.env.PORT || port)