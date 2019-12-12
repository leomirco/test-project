/**
 * ProductController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

/*global Product*/
module.exports = {
    getProduct: async function(req, res) {
        console.log("Lettura inserita")
        if(req.params.productCode){
            var day = new Date().getDate();
            var month = new Date().getMonth();
            var year = "2019";
            var hour = new Date().getHours();
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
    
    
};

