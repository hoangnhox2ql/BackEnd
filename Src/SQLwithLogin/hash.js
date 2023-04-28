const crypto = require('crypto');
const hashPassword = (input) =>{
    const salt = crypto.randomBytes(16).toString('hex');
    const hashPassword = crypto.pbkdf2Sync(input,salt,1000,64,'sha1');
    return {
        salt,
        hashPassword,
    };
};
module.exports = {
    hashPassword,
}