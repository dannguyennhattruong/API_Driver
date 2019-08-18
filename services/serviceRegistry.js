const EventEmitter = require('events');

class ServiceRegistry extends EventEmitter {
    constructor(timeout = 30) {
        super();
        this._services = [];
        this._timeout = timeout;

        // events
        this.on('service', service => {
            this.add(service);
        });
    }

    add({ service, ip, port }) {
        this._cleanup();
        const key = service + ip + port;
        const idx = this._services.findIndex(s => s.key === key);
        if (idx === -1) {
            this._services.push({
                timestamp: Math.floor(new Date() / 1000),
                key,
                ip,
                port,
                service,
            });
            console.log(`Added service ${service} on ${ip}:${port}`);
            return;
        }
        console.log(`update timestamp for ${service} on ${ip}:${port}`);
        this._services[idx].timestamp = Math.floor(new Date() / 1000);
    }

    getCurrentServices() {
        const keys = [];
        this._services.forEach((value, key) => {
            keys.push(key);
        });
        return keys;
    }

    get(service) {
        this._cleanup();
        return this._services.find(s => s.service === service);
    }

    remove(service) {
        this._services = this._services.filter(s => s.service !== service);
    }

    _cleanup() {
        const now = Math.floor(new Date() / 1000);
        this._services = this._services.filter(s => s.timestamp + this._timeout > now);
    }
}

// const sr = new ServiceRegistry();
// sr.add({ service: 'exp', ip: '127.0.0.1', port: 8080 });
// console.log(sr.get('exp'));
// sr.remove('exp');
// sr.emit('service', { service: 'exp', ip: '127.0.0.1', port: 8080 });
// console.log(sr.get('exp'));
module.exports = ServiceRegistry;
