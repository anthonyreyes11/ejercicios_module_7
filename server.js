//llamamos al modulo
const express = require('express');
const { Pool } = require('pg')
const config_objet = require('./config.js')


//traemos la funcion express en la constante app
const app = express();
const pool = new Pool(config_objet)

// client.connect(err=>{
//   if (err){
//     console.log(err);
//   }
// })


//indicamos la ruta
app.use(express.static('public'))

// debemos llamar a la app y con el metodo post 
//post/cancion -- recibir los datos y realizar la insercion en la tabla
app.post('/cancion', async (req, res) => {
  function getform(req) {
    return new Promise((resolve, reject) => {
      let string = ''
      req.on('data', function (params) {
        string += params
      })
      req.on('end', function () {
        const objeto = JSON.parse(string)
        resolve(objeto)
      })
    })
  }
  const datos = await getform(req)

  const client = await pool.connect()
  let cancion = datos.cancion;
  let artista = datos.artista;
  let tono = datos.tono;

  const agregarCancion = await client.query(`insert into repertorio (cancion,artista,tono) values ('${cancion}','${artista}','${tono}') returning *;`)
  res.end()
})

//get/canciones -- devuelve un JSON con los registros de la tabla
app.get('/canciones', async (req, res) => {

  const client = await pool.connect()
  const canciones = await client.query(`select * from repertorio`)
  const datos = canciones.rows
  res.json(datos)

})
//put/cancion -- recibe la cancion que se quiere cambiar de la tabla
app.put('/cancion', async (req, res) => {

  const client = await pool.connect()
  function getform(req) {
    return new Promise((resolve, reject) => {
      let string = ''
      req.on('data', function (params) {
        string += params
      })
      req.on('end', function () {
        const objeto = JSON.parse(string)
        resolve(objeto)
      })
    })
  }
  const datos = await getform(req)
  console.log(datos);
  
  let id = datos.id;
  let cancion = datos.cancion;
  let artista = datos.artista;
  let tono = datos.tono;
  const resp = await client.query(`update repertorio set cancion ='${cancion}',  artista ='${artista}',  tono ='${tono}' where id ='${id}' returning *`)
  //console.log(res.rows);
  res.end()
})

//delete/cancion -- recibe la cancion que se quiere borrar
app.delete('/cancion', async (req, res) => {
  console.log(req.query);

  const client = await pool.connect()
  const id = req.query.id
  console.log(id);
  const eliminarCancion = await client.query(`delete from repertorio where id=${id} returning *`)
  res.end()
})


//indicamos el puerto
app.listen(3000, function () {
  console.log('servidor ejecutando');
})