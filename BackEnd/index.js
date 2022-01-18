const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors());

// Importação de rotas
const userRoute = require('./routes/Usuario');
const admRoute = require('./routes/Adm');
const medRoute = require('./routes/Med');
const pacienteRoute = require('./routes/Paciente');

// Usando rotas importadas
app.use('/', userRoute);
app.use('/Adm/', admRoute);
app.use('/Medicos/', medRoute);
app.use('/Paciente/', pacienteRoute);


app.listen(8080, () => {
	console.log('Server NodeJs rodando, na porta 8080');
})