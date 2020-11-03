const Sequelize = require("sequelize");

const connection = new Sequelize('dbguiapress','rodrigo.santos','Rodrigo@2020',{
    host: 'windows',
    dialect: 'mysql',
    timezone: '-03:00'
});

module.exports = connection;
