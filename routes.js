const Accounts = require("./app/controllers/accounts");
const Castles = require('./app/controllers/castles');

module.exports = [

    { method: "GET", path: "/", config: Accounts.index },
    { method: "GET", path: "/signup", config: Accounts.showSignup },
    { method: "GET", path: "/login", config: Accounts.showLogin },
    { method: "GET", path: "/logout", config: Accounts.logout },
    { method: "POST", path: "/signup", config: Accounts.signup },
    { method: "POST", path: "/login", config: Accounts.login },    
    { method: 'GET', path: '/settings', config: Accounts.showSettings },
    { method: 'POST', path: '/settings', config: Accounts.updateSettings },
    { method: 'GET', path: "/home", config: Castles.home },
    { method: 'GET', path: "/adminhome", config: Castles.adminHome },
    { method: 'GET', path: "/admindeletecastle/{id}", config: Castles.adminDeleteCastle },
    { method: 'GET', path: "/deleteuser/{id}", config: Accounts.deleteUser },
    { method: 'POST', path: "/addcategory", config: Castles.addCategory },
    { method: 'GET', path: "/deletecategory/{id}", config: Castles.deleteCategory },
    { method: 'GET', path: "/viewcategory/{id}", config: Castles.viewCategory },
    { method: 'GET', path: '/viewcastle/{_id}', config: Castles.viewCastle },
    { method: 'POST', path: '/uploadfile/{castleid}', config: Castles.uploadFile },
    { method: 'GET', path: '/deleteimage/{id}', config: Castles.deleteImage },
    { method: 'POST', path: "/addcastle", config: Castles.addCastle },
    { method: 'POST', path: "/editcastle/{castleid}", config: Castles.editCastle },
    { method: 'GET', path: "/deletecastle/{castleid}", config: Castles.deleteCastle },
    { method: 'GET', path: '/showeditcastle/{castleid}', config: Castles.showEditCastle },
  

    {
        method: 'GET',
        path: '/{param*}',
        handler: {
          directory: {
            path: './public',
          },
        },
        options: { auth: false }
      },

];