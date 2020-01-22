/**
 * ProductController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const dialogflow = require('dialogflow');
const { WebhookClient } = require('dialogflow-fulfillment');

/*global Product*/
module.exports = {
    getProduct: async function(req, res) {
        console.log("Lettura inserita")
        if(req.params.productCode){
            var day = new Date().getDate();
            var month = new Date().getMonth()+1;
            var year = "2019";
            var hour = new Date().getHours()+1;
            var minute = new Date().getMinutes();;
            var second = new Date().getSeconds();
            var data =  day+"-"+month+"-"+year;
            var ora = hour+":"+minute+":"+second;
            let product = await Product.create({productCode: req.params.productCode, humidity: req.params.humidity, temperature: req.params.temperature, co: req.params.co,no2: req.params.no2, 
            data_rivelazione: data, ora_rivelazione: ora})
            console.log("dispositivo:"+req.params.productCode+"-temp:"+req.params.temperature+"-hum:"+req.params.humidity+"-co:"+req.params.co+"-n2o2:"+req.params.no2+"-data:"+data+"-ora:"+ora);
             return res.send(product);
        }
        return res.badRequest(`product ${req.params.productCode} not found`);
    },
    getValuexData: async function(req, res) {
        console.log("Ricerca x data_rivelazione")
        if(req.params.data_rivelazione){
            let product = await Product.find({data_rivelazione: req.params.data_rivelazione}).sort({'createdAt': -1});
            console.log(req.params.data_rivelazione);
             return res.send(product);
        }
        return res.badRequest(`product ${req.params.data_rivelazione} not found`);
    },
    getValuexproductcode: async function(req, res) {
        console.log("Ricerca x productCode")
        if(req.params.productCode){
            let product = await Product.find({productCode: req.params.productCode}).sort({'createdAt': -1});
            console.log(req.params.productCode);
             return res.send(product);
        }
        return res.badRequest(`product ${req.params.productCode} not found`);
    },
    getCurrentValue: async function(req, res) {
        console.log("Temperatura corrente in casa")
        if(true){
            var day = new Date().getDate();
            var month = new Date().getMonth();
            var year = "2019";
            var dataCurrent =  day+"-"+month+"-"+year;
            let product = await Product.find({data_rivelazione: dataCurrent}).sort({'createdAt': -1});
            console.log("data corrente: "+dataCurrent);
             return res.send(product);
        }
        return res.badRequest(`product ${req.params.data_rivelazione} not found`);
    },
     getIntentReply: async function(req, res) {
        console.log("LETTURA DATI QUALITA ARIA");
        console.log("Webhook. Request body: "+req);
        console.log("Webhook. Request body: "+res);
        const agent = new WebhookClient({request: req, response: res});
        const df_intent = agent.intent.toLowerCase();
        console.log('Webhook. agent.intent: '+df_intent);
        console.log('Webhook. agent.session: '+agent.session);
        if (df_intent === "temperatura casa") {
            console.log("LETTURA DATI TEMPERATURA");
            // eseguo query di ricerca dell'ultima temperatura rilevata
            var day = new Date().getDate();
            var month = new Date().getMonth()+1;
            var year = "2019";
            var dataCurrent =  day+"-"+month+"-"+year;
            console.log("Data corrente: ", dataCurrent);
            //let product = await Product.find({data_rivelazione: dataCurrent}).sort({'createdAt': -1});
            let product = await Product.find({}).sort({'createdAt': -1}).limit(1); 
            console.log("prodotto: ", product);
            var temp = product[0].temperature;
            console.log('temperatura rilevata: '+product[0].temperature);
            console.log('intent: '+agent.intent);
            const session = agent.session;
            var df_res = {};
            df_res['fulfillmentText'] = "temperatura rilevata  " + temp + " gradi - < "+product[0].data_rivelazione+" / "+ product[0].ora_rivelazione+" >"
            res.status(200).send(JSON.stringify(df_res));
        }
        if (df_intent === "umidita casa") {
            console.log("LETTURA DATI UMIDITA");
            // eseguo query di ricerca dell'ultima temperatura rilevata
            var day = new Date().getDate();
            var month = new Date().getMonth()+1;
            var year = "2019";
            var dataCurrent =  day+"-"+month+"-"+year;
            console.log("Data corrente: ", dataCurrent);
            //let product = await Product.find({data_rivelazione: dataCurrent}).sort({'createdAt': -1});
            let product = await Product.find({}).sort({'createdAt': -1}).limit(1);
            console.log("prodotto: ", product);
            var hum = product[0].humidity;
            console.log('temperatura rilevata: '+product[0].humidity);
            console.log('intent: '+agent.intent);
            const session = agent.session;
            var df_res = {};
            df_res['fulfillmentText'] = "umidità rilevata " + hum + " % - < "+product[0].data_rivelazione+" / "+ product[0].ora_rivelazione+" >"
            res.status(200).send(JSON.stringify(df_res));
        }
         if (df_intent === "temperatura media giornaliera") {
            console.log("TEMPERATURA MEDIA GIORNALIERA");
            var somma= 0;
            var media;
            var numero_letture = await Product.count({data_rivelazione:'3-1-2019'});
            let product = await Product.find({where:{data_rivelazione:'3-1-2019'}}).sort('createdAt DESC');
            for(var i = 0; i < product.length;i++){
                somma = somma + product[i].temperature;
            }
            media = somma/numero_letture;
            console.log("numero letture: ", numero_letture);
            console.log("LUNGHEZZA,SOMMA,MEDIA:"+product.length+" "+somma+" "+media);
           
            console.log('intent: '+agent.intent);
            const session = agent.session;
            var df_res = {};
            df_res['fulfillmentText'] = "temperatura media giornaliera " + media + " % - < "+product[0].data_rivelazione+" /  >"
            res.status(200).send(JSON.stringify(df_res));
        }
    
     },
      getAvg: async function(req, res) {
          var somma= 0;
          var media;
            console.log("TEMPERATURA GIORNALIERE");
            var numero_letture = await Product.count({data_rivelazione:'3-1-2019'});
            let product = await Product.find({where:{data_rivelazione:'3-1-2019'}}).sort('createdAt DESC');
            for(var i = 0; i < product.length;i++){
                somma = somma + product[i].temperature;
            }
            media = somma/numero_letture;
            console.log("numero letture: ", numero_letture);
            console.log("LUNGHEZZA,SOMMA,MEDIA:"+product.length+" "+somma+" "+media);
            
           // var total = await Product.avg('temperature').where({data_rivelazione: '3-1-2019'});
            //console.log("temperatura totale: ", total);
    }
};

