/* 
Imports
*/
    const TensorflowClass = require('@tensorflow/tfjs-node');
//

/* 
Configuration
*/
    const createModel = ( data ) => {
        // Définir le type de model
        const TensorflowModel = TensorflowClass.sequential();

        //=> Async Javascript
        return new Promise( ( resolve, reject ) => {

            /* 
            Structure RN Tensorflow
            - 1 layer = inputs : ex. layers.dense()
            - x layers = entrainement
            - 1 layer = compilation
            */

            // Set input layer
            TensorflowModel.add( TensorflowClass.layers.dense({
                inputShape: [4],
                activation: 'sigmoid',
                units: 5
            }) );

            // Set training layer(s)
            TensorflowModel.add( TensorflowClass.layers.dense({
                activation: 'sigmoid',
                units: 4
            }));
            
            TensorflowModel.add( TensorflowClass.layers.dense({
                activation: 'sigmoid',
                units: 3
            }));

            // Set complile layer
            TensorflowModel.compile({
                loss: 'meanSquaredError',
                optimizer: TensorflowClass.train.adam(.06)
            });

            /* 
            Start training
            */
                // Set input/output
                const inputData = TensorflowClass.tensor2d( data.map( item => item.input ) );
                const outputData = TensorflowClass.tensor2d( data.map( item => item.output ) );

                // Train model
                TensorflowModel.fit( inputData, outputData, {
                    verbose: 1,
                    epochs: 200
                })
                .then( trainedModel => {
                    // Save model
                    TensorflowModel.save( 'file://ts-model/iris' )
                    .then( infos => resolve({ model: trainedModel, infos: infos }) )
                    .catch( error => reject(error) );
                })
                .catch( error => reject(error) );
            //
        });
    };

    // Fonction pour tester un model
    const testModel = ( data ) => {
        return new Promise( (resolve, reject) => {
            // charger le model
            TensorflowClass.loadModel( 'file://ts-model/iris' )
            .then( async tsModel => {
                // Set input data
                const testingData = await TensorflowClass.tensor2d(data);
                
                // Start prediction
                const prediction = await tsModel.predict(testingData);

                // Console log of prediction
                prediction.print();

                // send response
                return resolve( prediction );
            })
            .catch( error => reject(error) );
        })
    }
//

/* 
Export
*/
    module.exports = {
        createModel,
        testModel
    };
//