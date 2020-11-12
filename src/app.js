const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

function validateUuid(request,response,next){ 
  const { id } = request.params;

  if(!isUuid(id)){
    return response.status(400).json({error:"ID repository Invalid"});
  }
  return next();

}

function validateUrl(request,response,next){ 
  const { url } = request.body;

  if(url !== 'https://github.com/esferrari/desafio_conceitos_nodejs.git'){
    return response.status(400).json({error:"URL Invalid"});
  }
  return next();

}

function findRepositoryById(request,response,next){ 
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  if(repositoryIndex < 0){
    return response.status(400).json({error:'Project not found'})
  }

  request.params.repositoryIndex = repositoryIndex;
  return next();

}


const repositories = [];

app.get("/repositories", (request, response) => {
    return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
   const { title, url, techs } = request.body;

   const repository = {
     id: uuid(),
     title,
     url,
     techs,
     likes:0
   }

   repositories.push(repository);

   return response.status(200).json(repository);
   

});

app.put("/repositories/:id", validateUuid, findRepositoryById, (request, response) => {
    
    const { id } = request.params;
    const { repositoryIndex } = request.params;
    const { title, url, techs } = request.body;
    
    const repository = {
      id,
      title,
      url,
      techs,
      likes: repositories[repositoryIndex].likes
    }

    repositories[repositoryIndex] = repository;

    return response.status(200).json(repository);


});

app.delete("/repositories/:id", validateUuid, findRepositoryById, (request, response) => {
    const { id } = request.params;
    const { repositoryIndex } = request.params;

    repositories.splice(repositoryIndex,1);

    return response.status(204).send();   
    
});

app.post("/repositories/:id/like", validateUuid, findRepositoryById, (request, response) => {
    const { repositoryIndex } = request.params;

    const { id, title, url, techs, likes } = repositories[repositoryIndex];

    const repository = {
      id,
      title,
      url,
      techs,
      likes:likes+1
    }
    
    repositories[repositoryIndex] = repository;

    return response.status(200).json(repository);
});

module.exports = app;
