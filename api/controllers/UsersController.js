/**
 * UsersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  

  /**
   * `UsersController.name()`
   */
  name: async function (req, res) {
    return res.json({
      todo: 'name() is not implemented yet!'
    });
  },

  /**
   * `UsersController.email()`
   */
  email: async function (req, res) {
    return res.json({
      todo: 'email() is not implemented yet!'
    });
  }

};

