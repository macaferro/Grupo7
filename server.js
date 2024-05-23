const express = require('express');
const fs = require('fs');
const dotenv = require('dotenv');
const app = express();
const PORT = process.env.PORT || 3008;

dotenv.config();

const dataFilePath = process.env.DATA_FILE_PATH;
app.use(express.static('public'));
app.use(express.json());

app.use((req, res, next) => {
  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('No se puede leer el archivo de datos:', err);
      return next(err);
    }

    try {
      req.TRAILERFLIX = JSON.parse(data);
      next();
    } catch (parseErr) {
      console.error('Error al parsear el archivo JSON:', parseErr);
      return next(parseErr);
    }
  });
});

// Rutas
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/catalogo', (req, res) => {
  res.json(req.TRAILERFLIX);
});

app.get("/titulo/:title", (req, res) => {
  const title = req.params.title.toLowerCase();
  const filteredTitle = req.TRAILERFLIX.filter(trailer => trailer.title.toLowerCase().includes(title));
  if (filteredTitle.length > 0) {
    res.json(filteredTitle);
  } else {
    res.status(404).send("Información no encontrada");
  }
});

app.get("/categoria/:cat", (req, res) => {
  const cat = req.params.cat.toLowerCase();
  console.log('Filtrando por género:', cat);
  const filteredCategoria = req.TRAILERFLIX.filter(trailer => trailer.cat.toLowerCase() === cat);
  res.json(filteredCategoria);
});

app.get("/reparto/:act", (req, res) => {
    const act = req.params.act.toLowerCase();
    console.log('Filtrando por actores:', act);
    const filteredactores = req.TRAILERFLIX.filter(trailer => trailer.act.toLowerCase().includes(act));

    if (filteredactores.length > 0) {
        const result = filteredactores.map(trailer => ({
            titulo: trailer.title,
            reparto: trailer.act
        }));
        res.json(result);
    } else {
        res.status(404).json({ error: 'No se encontraron películas con el actor proporcionado.' });
    }
});

app.get("/trailer/:id", (req, res) => {
    const id = req.params.id;
    const idInt = parseInt(id, 10);
    const filteredId = req.TRAILERFLIX.find(item => item.id === idInt);
    if (filteredId) {
        const result = {
            id: filteredId.id,
            titulo: filteredId.title,
            trailer: filteredId?.trailer // Uso del operador de acceso condicional
        };
        if (result.trailer) {
            res.json(result);
        } else {
            res.json({
                id: filteredId.id,
                titulo: filteredId.title,
                message: 'Disculpenos, esta película no tiene trailer disponible.'
            });
        }
    } else {
        res.status(404).json({ error: 'No se encontró ninguna película con el ID proporcionado.' });
    }
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
