const ServiceRegistry = require('../services/serviceRegistry');

const serviceRegistry = new ServiceRegistry();
const serviceRoute = (app) => {
  app.get('/service/driver/ping', (req, res) => {
    console.log(req.connection.remotePort);
    console.log(req.ip);
    res.json({ msg: 'pong' });
  });
  app.get('/service/driver/:service/:port', (req, res) => {
    const { service, port } = req.params;
    const ip = req.headers['x-forwarded-for'] || req.ip;
    res.json({ status: 'OK' });
    serviceRegistry.emit('service', { service, port, ip });
  });
};

module.exports = serviceRoute;
