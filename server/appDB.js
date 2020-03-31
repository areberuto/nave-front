const express = require('express');
const sqlite3 = require('sqlite3');
const cors = require('cors');
const app = express();
const morgan = require('morgan');

//Creación o apertura de base de datos

const db = new sqlite3.Database('../data/database.db', err => {

    if (err)
        console.log(err);
    else
        console.log('Succesful connection to DB.');

});

const PORT = process.env.PORT || 4001;

//Usar archivos estáticos de la carpeta public

app.use(express.static('../public'));

//Parseado del body como json

app.use(express.json());

//Permitir CORS

app.use(cors());

//Log de peticiones

app.use(morgan('dev'));

//Routers

const fenomenosRouter = express.Router();

app.use('/fenomenos', fenomenosRouter);

const investigadoresRouter = express.Router();

app.use('/investigadores', investigadoresRouter);

//Arrancado

app.listen(PORT, () => console.log(`Listening on ${PORT}.`));

//Utils

const validFenomeno = (req, res, next) => {
    
    console.log("Validando datos del fenómeno... ");

    if (req.body.fenomeno) {

        let fenomeno = req.body.fenomeno;

        let isInvalid = (!fenomeno.investigadorId || !fenomeno.titulo || !fenomeno.descripcionCorta || !fenomeno.contenido || !fenomeno.fecha || !fenomeno.ciudad || !fenomeno.pais);

        if (!isInvalid) {

            console.log("Fenómeno válido.");
            req.fenomeno = fenomeno;
            next();

        } else {

            console.log("Fenómeno inválido.");
            res.status(400).send();
            
        }

    }

}

//Fenomenos

fenomenosRouter.get('/', (req, res, next) => {
    
    let query = "SELECT f.*, i.nombre as nombreInvestigador, i.apellido1 as apellidoInv1, i.apellido2 as apellidoInv2 FROM fenomenos as f INNER JOIN investigadores as i ON f.investigadorId = i.id";
    
    console.log(req.query);

    if(req.query.idInv){

        query = query + ` WHERE i.id = ${req.query.idInv}`;
        db.all(query, (err, rows) => {

            if (err) {
    
                console.log(err);
                res.status(500).send();
    
            }
    
            res.send(rows);
    
        });

    }

    if(req.query.idFen){

        query = query + ` WHERE f.id = ${req.query.idFen}`;
        db.get(query, (err, row) => {

            if (err) {
    
                console.log(err);
                res.status(500).send();
    
            }
    
            res.send(row);
    
        });

    } else {

        db.all(query, (err, rows) => {

            if (err) {
    
                console.log(err);
                res.status(500).send();
    
            }
    
            res.send(rows);
    
        });

    }

    

});

fenomenosRouter.post('/', validFenomeno, (req, res, next) => {
    
    let fenomeno = req.fenomeno;

    db.run("INSERT INTO fenomenos (investigadorId, titulo, descripcionCorta, contenido, fecha, ciudad, pais, coordenadas) VALUES ($investigadorId, $titulo, $descripcionCorta, $contenido, $fecha, $ciudad, $pais, $coordenadas)", {

        $investigadorId: fenomeno.investigadorId,
        $titulo: fenomeno.titulo,
        $descripcionCorta: fenomeno.descripcionCorta,
        $contenido: fenomeno.contenido,
        $fecha: fenomeno.fecha,
        $ciudad: fenomeno.ciudad,
        $pais: fenomeno.pais,
        $coordenadas: fenomeno.coordenadas

    }, function (err) {

        if (err) {

            console.log(`Error en la inserción: ${err}`);
            res.status(500).send();

        } else {

            console.log(`Inserción realizada con éxito.`)
            res.status(201).send({status: 201});

        }

    }); 

});

fenomenosRouter.put('/', validFenomeno, (req, res, next) => {

    let fenomeno = req.fenomeno;

    db.run(`UPDATE fenomenos SET titulo = '${fenomeno.titulo}', descripcionCorta = '${fenomeno.descripcionCorta}', contenido = '${fenomeno.contenido}', fecha = '${fenomeno.fecha}', ciudad = '${fenomeno.ciudad}', pais = '${fenomeno.pais}', coordenadas = '${fenomeno.coordenadas}' WHERE id = ${fenomeno.id}`, function (err) {

        if (err) {

            console.log(`Error en la actualización: ${err}`);
            res.status(500).send();

        } else {

            console.log(`Inserción realizada con éxito.`)
            res.status(201).send({status: 201});

        }

    });


});

fenomenosRouter.delete('/', (req, res, next) => {

    let id = Number(req.query.id);
    console.log(id);
    //El callback será llamado con un error si hay un error en el delete, y
    //si va todo bien tendrá en su this la propiedad changes con el número de filas afectadas

    db.run(`DELETE FROM fenomenos WHERE id = ${id}`, function(err){

        if(err){

            console.log('Error en el borrado.')
            res.status(500).send();

        } else {

            console.log(this.changes);
            let rowCount = this.changes;
            res.send({rowCount});

        }

    });

});

//Investigadores

investigadoresRouter.get('/', (req, res, next) => {

    let query = req.query;

    if(query.hasOwnProperty('email')){

        db.get(`SELECT * FROM investigadores WHERE correo = '${query.email}'`, (err, row) => {

            if(err){

                console.log('Error en getInvestigadorByEmail.')
                res.status(500).send();

            } else {

                if(!row){

                    console.log('Recurso no encontrado en getInvestigadorByEmail.');
                    res.status(404).send();

                }

                res.send(row);

            }

        })

    }

    if(query.hasOwnProperty('id')){

        db.get(`SELECT * FROM investigadores WHERE id = '${query.id}'`, (err, row) => {

            if(err){

                console.log('Error en getInvestigadorById.')
                res.status(500).send();

            } else {

                if(!row){

                    console.log('Recurso no encontrado en getInvestigadorId.');
                    res.status(404).send();

                }

                res.send(row);

            }

        })

    }
    

});


// fenomenosRouter.put('/fenomeno', (req, res, next) => {

//     let fenomeno = req.query.fen;
//     console.log(fenomeno);

// });

