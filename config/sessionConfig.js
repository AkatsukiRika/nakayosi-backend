module.exports = {
    sessionSignedKey: ['himitsu'],
    sessionConfig: {
        key: 'koa:sess',
        maxAge: 8 * 60 * 60 * 1000,
        autoCommit: true,
        overwrite: true,
        httpOnly: true,
        signed: true,
        rolling: false,
        renew: false
    }
}