/**
 * ProductController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const dialogflow = require('dialogflow');
const { WebhookClient } = require('dialogflow-fulfillment');

//------------ PRIMO METODO CHIAMATA API REST

var request = require('request');
var http = require('http');
var https = require('https');
//-----------------------------------------------------------------------------

// FUNZIONI
function getValue(a){
    console.log(a)
    return 3
}
 
function getMedia(numero_letture, product) {
          var somma= 0;
          var media;
          for(var i = 0; i < numero_letture;i++){
                somma = somma + product[i].temperature;
            }
            media = somma/numero_letture;
            console.log("numero letture: ", numero_letture);
            console.log("LUNGHEZZA,SOMMA,MEDIA:"+product.length+" "+somma+" "+media);
            return media;  
     }

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
            var numero_letture = await Product.count({data_rivelazione:'3-1-2019'});
            let product = await Product.find({where:{data_rivelazione:'3-1-2019'}}).sort('createdAt DESC');
            var media = getMedia(numero_letture,product);
            console.log('MEDIA '+getMedia(numero_letture,product));
            console.log('intent: '+agent.intent);
            const session = agent.session;
            var df_res = {};
            df_res['fulfillmentText'] = "temperatura media giornaliera " + media + " - < "+product[0].data_rivelazione+" /  >"
            res.status(200).send(JSON.stringify(df_res));
        }
         if (df_intent === "valori particolato indoor") {
            console.log("PARTICOLATO INDOOR");
            var rs = "someone";
        var options = {
            hostname: 'api.origins-china.cn',
            port: 443,
            path: encodeURI('/v1/lasereggs/134606dc-f3ac-4bf1-82c4-6e71a9dbab5e?key=NTU2MjRjODJmMjBiNGQ4MTkwYTcwZDNmZjM5ZjBjMzc0NjU1'),
            method: 'GET'
        };

        // do the GET request HTTPS
        https.request(options, function(res) {  
            console.log('REQUEST HOST '+req.hostname+' PATH/ '+req.path+' PORT/ '+req.port+' /OPTION'+options);
            console.log('RESPONSE STATUS: ' + res.statusCode+' /HEADERS: ' + JSON.stringify(res.headers));
            var data = ""
            let object = {};
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                data += chunk;    
            });
            res.on('end', () => {
                object = JSON.parse(data);
                console.log('object.id: ' + object.id);
                console.log('object data/ora: ' + object["info.aqi"].ts);
                console.log('object temperatura: ' + object["info.aqi"].data.temp);
                console.log('object umidità: ' + object["info.aqi"].data.humidity);
                console.log('object tvoc: ' + object["info.aqi"].data.rtvoc);
                console.log('object pm10: ' + object["info.aqi"].data.pm10);
                console.log('object pm25: ' + object["info.aqi"].data.pm25);
                console.log('intent: '+agent.intent);
                const session = agent.session;
                var df_res = {};
                df_res['fulfillmentText'] = "Valori particolato indoor PM2.5: " + object["info.aqi"].data.pm25 + " PM10: "+object["info.aqi"].data.pm10+" /  >";
                console.log("Valori particolato indoor PM2.5: " + object["info.aqi"].data.pm25 + " PM10: "+object["info.aqi"].data.pm10+" /  >");
                //res.status(200).send(JSON.stringify(df_res));
            });
            res.on('error', function(e) {
                console.error(e);
            });
        });
        }
     },
    
      getAvg: async function(req, res) {
         console.log("TEMPERATURA MEDIA GIORNALIERA");
            var numero_letture = await Product.count({data_rivelazione:'3-1-2019'});
            let product = await Product.find({where:{data_rivelazione:'3-1-2019'}}).sort('createdAt DESC');
            var media = getMedia(numero_letture,product);
            console.log('MEDIA '+getMedia(numero_letture,product));
    },
     getRestAPI: async function(req, res) {
    //------------ SECONDO METODO CHIAMATA API REST
    var rp = require('request-promise');
    var options = {
      uri: 'https://api.origins-china.cn/v1/lasereggs/134606dc-f3ac-4bf1-82c4-6e71a9dbab5e',
      qs: {
        key:'NTU2MjRjODJmMjBiNGQ4MTkwYTcwZDNmZjM5ZjBjMzc0NjU1' // -> uri + '?access_token=xxxxx%20xxxxx'
      },
      headers: {
          'content-type': 'application/json',
          'accept': 'application/json',
          'accept-encoding': 'gzip',
          'accept-language': 'en-US,en;q=0.8',
           'User-Agent': 'Request-Promise'
      },
      json: true // Automatically parses the JSON string in the response
    };
    //____________________________________________________________________________________
    
     rp(options)
    .then(function (repos) {
        console.log('User has %d repos', repos.length);
        console.log('lunghezza risposta '+repos);
        
    })
    .catch(function (err) {
        // API call failed...
        console.log('Errore chiamata APi rest');
    });
     },
     
     //------------------------------------------------------------------------------------------
     
      
     getArpaValue: function(req, res){
        var rs = "someone";
        var options = {
            hostname: 'dati.arpa.puglia.it',
            port: 80,
            path: encodeURI('/api/3/action/datastore_search?resource_id=d08afe64-0285-4334-bc9f-92f5d95e106e&filters={"statcd":"48","data_rilevazione":"2020-01-26 21:00:00.0"}'),
            method: 'GET'
        };

        http.request(options, function(res) {  
            console.log('AVVIO CHIAMATA '+req.hostname+' / '+req.path+' / '+req.port);
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));
            var data = ""
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                data += chunk;    
                
            });
            res.on('end', () => {
                let object = JSON.parse(data);
                console.log('object.result: ' + object.result.records[0].valore);
            });
            
            //rs = res;
             //console.log('HOSTNAME1 '+rs.headers+' /PATH '+rs.body+' /PORT '+rs.port);
             //console.log('HOSTNAME2 '+res.headers+' /PATH '+res.body+' /PORT '+res.port);

           // res.send('HELLO '+rs);
        }).end();
     },
        getPm25Home: function(req, res){
        var rs = "someone";
        var options = {
            hostname: 'api.origins-china.cn',
            port: 443,
            path: encodeURI('/v1/lasereggs/134606dc-f3ac-4bf1-82c4-6e71a9dbab5e?key=NTU2MjRjODJmMjBiNGQ4MTkwYTcwZDNmZjM5ZjBjMzc0NjU1'),
            method: 'GET'
        };

        // do the GET request HTTPS
        https.request(options, function(res) {  
            console.log('REQUEST HOST '+req.hostname+' PATH/ '+req.path+' PORT/ '+req.port+' /OPTION'+options);
            console.log('RESPONSE STATUS: ' + res.statusCode+' /HEADERS: ' + JSON.stringify(res.headers));
            var data = ""
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                data += chunk;    
            });
            res.on('end', () => {
                let object = JSON.parse(data);
                console.log('object.id: ' + object.id);
                console.log('object data/ora: ' + object["info.aqi"].ts);
                console.log('object temperatura: ' + object["info.aqi"].data.temp);
                console.log('object umidità: ' + object["info.aqi"].data.humidity);
                 console.log('object tvoc: ' + object["info.aqi"].data.rtvoc);
                 console.log('object pm10: ' + object["info.aqi"].data.pm10);
                console.log('object pm25: ' + object["info.aqi"].data.pm25);
            });
            res.on('error', function(e) {
                console.error(e);
            });
        }).end();
     },
};

