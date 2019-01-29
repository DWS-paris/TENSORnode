/* 
Import & config
*/
    // Nodejs
    const d3 = require('d3');
    const express = require('express');
    const d3Router = express.Router();

    // Inner
    const { csvParser, trainDataConvertor, testDataConvertor } = require('../../services/parser.serv');
    const { createModel, testModel } = require('../../services/ts.serv');
//

/* 
Definition
*/
    class D3RouterClass{
        constructor(){}

        routes(){
            d3Router.get( '/', (req, res) => {
                res.json({ msg: 'Hello D3 API' });
            });

            d3Router.post( '/convert', (req, res) => {
                // Conversion CSV/JSON
                const jsonData = csvParser( req.body.input )

                // Conversion JSON/Tensorflow
                const convertedData = trainDataConvertor(jsonData);

                // Create TS model
                createModel(convertedData)
                .then( model  =>  res.json(model) )
                .catch( err => res.json("error") )
            });

            d3Router.post( '/test', (req, res) => {
                // Conversion CSV/JSON
                const jsonData = csvParser( req.body.input )

                // Conversion JSON/Tensorflow
                const convertedData = testDataConvertor(jsonData);
                
                // Test TS model
                testModel(convertedData)
                .then( prediction  =>  res.json(prediction) )
                .catch( err => res.json(err) )
            });
        };

        init(){
            this.routes();
            return d3Router
        };
    }
//

/* 
Export
*/
    module.exports = D3RouterClass;
//