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
    { method: 'POST', path: "/addcastle", config: Castles.addCastle },

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