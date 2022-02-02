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

app.use(express.static(__dirname+'/public'));

app.get('/', (req, res) => {
  pool
  .connect()
  .then(client => {
    return client
      .query('select * from members order by points desc;')
      .then(resp=>{
        let text = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>CUBE</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css">
            <link rel="stylesheet" href="style.css">
        </head>
        <body>
        
        
          <!--Header Starts-->
        
          <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container-fluid">
                <div>
                  <img src="logo.png" class="logo"> <div class="text">PROTOCUBE</div>
                </div> 
                
                <!-- Search Bar -->
        
                <!-- <form class="d-flex">
                  <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
                  <button class="btn btn-success" type="submit"> <i class="bi bi-search"></i> </button>
                </form> -->
        
            </div>
          </nav>
        `
        rank = 1;
        for(var i = 0; i <resp.rowCount; i++)
        {
          text += ` <div class="card mb-3 container-fluid" style="max-width: 540px;">
                      <div class="row g-0">
                        <div class="col-3">
                          <img src="${resp.rows[i].avatarurl}" class="img-fluid rounded-start">
                        </div>
                        <div class="col-8">
                          <div class="card-body">
                            <h4 class="card-text">Rank: ${rank}</h4>
                            <h5 class="card-title">${resp.rows[i].tag}</h5>
                            <p class="card-text">POINTS: ${resp.rows[i].points}</p>
                          </div>
                        </div>
                      </div>
                    </div>`
          if(resp.rows[i+1].points !== undefined && resp.rows[i].points === resp.rows[i+1].points) rank++;
          
        }
        text += `</body></html>`;
        client.release();
        res.set("Access-Control-Allow-Origin", "*");
        res.send(text);
      })
      .catch(err => {
        client.release()
        console.log(err.stack)
      })
  })
})

app.get('/json', (req, res) => {
  pool
  .connect()
  .then(client => {
    return client
      .query('select * from members order by points desc;')
      .then(resp=>{
        let users = []
        for(var i = 0; i <resp.rowCount; i++)
        {
          users.push({
            tag:`${resp.rows[i].tag}`,
            points:`${resp.rows[i].points}`,
            imgurl:`${resp.rows[i].avatarurl}`
          })
        }
        res.set("Access-Control-Allow-Origin", "*");
        res.json(users);
      })
      .catch(err => {
        client.release()
        console.log(err.stack)
      })
  })
})

app.get('/null', (req, res) =>{
  res.sendFile(__dirname+'/public/null.jpg')
})
app.listen(process.env.PORT)
