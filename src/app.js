const express = require('express');
const cors = require('cors');

const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validadateId(req, res, next) {
  const { id } = req.params;

  if(!isUuid(id)) {
    return res.status(400).json({ error: 'invalid project ID.' });
  }

  return next();
}

app.use('/repositories/:id', validadateId);

app.get('/repositories', (request, response) => {
  return response.json(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, url, tech } = request.body;

  const repository = { 
    id: uuid(), 
    title, 
    url, 
    tech, 
    likes: 0 
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const { title, url, tech } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'repository not found' });
  }

  const likes = repositories[repositoryIndex].likes;

  const repository = {
    id,
    title,
    url,
    tech,
    likes
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;
  
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'project not found' });
  }

  repositories.splice(repositoryIndex, 1);

  return response.send();
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'repository not found' });
  }

  const repository = repositories[repositoryIndex];
  
  repository.likes++;

  repositories[repositoryIndex] = repository;

  return response.json({ likes: repositories[repositoryIndex].likes});
});

module.exports = app;
