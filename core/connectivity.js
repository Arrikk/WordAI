const dns = require('dns')

const connect = async (req, res, next) => {
    let isConnected = dns.lookup('https://www.google.com', (e) => {
        console.log(e, e?.code)
    })
}

module.exports = {connect}