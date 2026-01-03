import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import userRoutes from './routes/users.js'

const app = express()
dotenv.config()
// Middlewares
app.use(cors())
app.use(express.json())

//Middleware de autenticación
// app.use((req, res, next) => {
//   const apiKey = req.headers['x-api-key']
//   if (apiKey !== process.env.API_KEY) {
//     return res.status(401).json({ error: 'Acceso no autorizado' })
//   }
//   next()
// })

// logging de peticiones para debug
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.originalUrl)
  next()
})

// Rutas
app.use('/users', userRoutes)
// ruta de prueba
app.get('/api/test', (req, res) => res.json({ ok: true }))

app.get('/', (req, res) => {
  res.send('Hello Api')
})

// Manejador 404 para todo lo demás
app.use((req, res) => {
  console.log('404 ->', req.method, req.originalUrl)
  res.status(404).json({ error: 'Ruta no encontrada' })
})

const PORT = process.env.PORT || 8080

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`))