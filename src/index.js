const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  const isRepositoryExists = repositories.some(repository => repository.id === id);

  if (!Boolean(isRepositoryExists)) {
    return response.status(404).json({ error: "Repository not found" });
  }

  const repositoryUpdated = {
    title,
    url, 
    techs
  }

  const repository = { ...repositories[repositoryIndex], ...repositoryUpdated };

  repositories.splice(repositoryIndex, 1);
  repositories.push(repository);

  return response.json(repository);
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryToUpdate = repositories.find(repository => repository.id === id);

  if (!Boolean(repositoryToUpdate)) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositoryToUpdate.likes += 1;

  return response.status(201).json(repositoryToUpdate);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const isRepositoryExists = repositories.some(repository => repository.id === id);

  if (!Boolean(isRepositoryExists)) {
    return response.status(404).json({ error: "Repository not found" });
  }
  
  const newRepositories = repositories.filter(repository => repository.id !== id);

  repositories.splice(0, repositories.length);
  repositories.push(newRepositories);

  return response.status(204).json(repositories);
});

module.exports = app;
