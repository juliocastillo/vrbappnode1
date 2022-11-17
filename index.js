const express = require('express');
const app = express();
const port = 3005;
const jwt = require('jsonwebtoken');
app.use(express.json());  //middlework para leer json de request.

app.get('/', (req, res) => {
  res.json(
    [{'name': "john", "sex" : 51}]
  );
})


app.post('/api/signup' , (req, res) => {
/*  const body = req.body;
  res.json({
    message : "crea",
    data : body
});*/
  const id  = req.body.id;
  const username = req.body.username;
  const password = req.body.password;
  jwt.sign(id , 'secret_key' , (err,token) => {
     if(err){
        res.status(400).send({msg : 'Error'})
     }
else {
        res.send({msg:'success' , token: token})
     }
  })
})

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(403);
  jwt.verify(token, "secret_key", (err, user) => {
     if (err) return res.sendStatus(404);
     req.user = user;
     next();
  });
}

app.post('/api/login' , verifyToken , (req,res) => {
  res.send('You are Authorized!')
})

app.put("/api/logout", verifyToken, function (req, res) {
  const authHeader = req.headers["authorization"];
  jwt.sign(authHeader, "", { expiresIn: 1 } , (logout, err) => {
     if (logout) {
        res.send({msg : 'Has sido desconectado' });
     } else {
        res.send({msg:'Error'});
     }
  });
});

app.listen(port, () => {
  console.log('Mi port ' + port);
})
