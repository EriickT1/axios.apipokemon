const http = require('http');
const url  = require('url');
const fs = require('fs');
const port = 3000;


const axios = require('axios');

let arregloTotal = [];

getPokemon = async () =>{
    const { data } = await axios.get('https://pokeapi.co/api/v2/pokemon/?limit=150');
    const pokemon = data.results;
    return pokemon;
}
datos = async (nombrePokemon) =>{
    const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${nombrePokemon}`);
    return data;
}

http.createServer((req, res) => {


    if (req.url == '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    fs.readFile('index.html', 'utf8', (err, html) => {
    res.end(html)
    })
    }

    if (req.url == '/pokemones') {
        
        getPokemon().then((result) =>{
            result.forEach(e => {
                arregloTotal.push(datos(e.name));
            });
        
            Promise.all(arregloTotal).then((resultado) =>{
                let pokeArr =[];
                resultado.forEach( (e) =>{
                    let nombre = e.name;
                    let img = e.sprites.front_default;
                    pokeArr.push({nombre,img});
                });
                res.write(JSON.stringify(pokeArr));
                res.end();
            });
        });
        
    
    }

})
.listen(port, () => console.log(`Servidor encendido en el puerto: ${port}`));