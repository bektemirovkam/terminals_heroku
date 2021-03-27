const crypto = require("crypto")

const generateMD5 = (key) => {
    return crypto.createHash("md5").update(key).digest("hex")
}

module.exports = generateMD5