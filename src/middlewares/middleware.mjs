import jwt from 'jsonwebtoken'

const authenticateToken = async(req, res, next) => {
    const authToken = await req.headers.cookie;
    const token = authToken && authToken.split(' ')[0].split('=')[1].replace(';', '')

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

export default authenticateToken;