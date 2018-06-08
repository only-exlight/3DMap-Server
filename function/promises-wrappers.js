const getHandler = (url, app) => new Promise((resolve, reject) => app.get(url, (req, res) => resolve({ req: req, res: res })))
const getRequest = (url, https) => new Promise((resolve, reject) => https.get(url, resp => resolve(resp)))

module.exports.getHandler = getHandler;
module.exports.getRequest = getRequest;
