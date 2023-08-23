const express = require ('express')
const rotas = require('./rotas')

const app = express()

app.use(express.json())

app.use(rotas)

const port = 3000

app.listen(port, ()=>{
    console.log(`Server running at http://localhost:${port}`)
})