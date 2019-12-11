/**
 * HelloController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
 
 module.exports = {

  hello : function (req, res) {
    var myName = 'Luis';          
    return res.view('hello' , {name : myName});
    }
}
