import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import db from '../helpers/db.mjs'
import authSch from '../schema/auth.sch.mjs'

class _auth {
    session = async (req, res) => {
        try {
            const [account] = await db.auth.findMany({ where:{ id: req.user.id } })
        
            res.json({
                status: true,
                account
            })
        } catch(err) {
            console.log(err)
            res.json({
                status: false,
                error: "Something went wrong"
            })
        }
        
    }

    login = async (req, res) => {
        try {
            try{ await authSch.schema_log.validate(req.body) } catch (err){ throw(err.errors[0]) }

            const username = req.body.username
            const password = req.body.password

            const [account] = await db.auth.findMany({ where: { username: username } })
            
            if(account == null){
                res.json({
                    status: false,
                    error: "User unregistered"
                })
            }else if(bcrypt.compareSync(password, account.password)){
                const userJson = { id: account.id, username: account.username, password: account.password}
                const accessToken = jwt.sign(userJson, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1800s'})
                const refreshToken = jwt.sign(userJson, process.env.REFRESH_TOKEN_SECRET)
                
                res.cookie("Authorization", accessToken, {
                    withCredentials: true,
                    httpOnly: true,
                }).cookie("Refresh", refreshToken, {
                    withCredentials: true,
                    httpOnly: true,
                })
                .json({ 
                    status: true,
                    account
                })
            }else{
                res.json({
                    status: false,
                    error: "Wrong password"
                })
            }
        } catch(err) {
            res.json({
                status: false,
                error: err
            })
        }
    }

    refresh = async (req, res) => {
        try {
            const refreshToken = await req.headers.cookie
            const token = refreshToken.split(" ")[1].split("=")[1].replace(';', '')

            if (token == null) return res.sendStatus(401)
            if (!token.includes(token)) return res.sendStatus(401)

            jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) res.sendStatus(401)
                const userJson = { id: user.id, username: user.username, password: user.password}
                const accessToken = jwt.sign(userJson, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1800s'})
                res.cookie("Authorization", accessToken, {
                    withCredentials: true,
                    httpOnly: true,
                }).json({
                    status: true,
                    message: "Account refreshed"
                })
            })
        } catch(err) {
            console.log(err)
            res.json({
                status: false,
                error: "Something went wrong"
            })
        }
        
    }

    register = async (req, res) => {
        try {
            try { await authSch.schema_reg.validate(req.body) } catch(err) { throw (err.errors[0]) }
        
            const { name, username, password } = req.body
            const pw = bcrypt.hashSync(password, 10)
            const account = await db.auth.findMany({ where: { username: username } })

            if (account.length == 0){
                await db.auth.create({
                    data:{
                        name,
                        username,
                        password: pw       
                    }
                })

                res.json({
                    status: true,
                    message: "User created",  
                    account: {
                        name,
                        username,
                        pw
                    }
                })
            }else{
                res.json({
                    status: false,
                    message: "User already exist"
                })
            }
        } catch (err) {
            res.json({
                status: false,
                error: err
            })
        }
            
    }

    logout = async (req, res) => {
        try {
            res.clearCookie("Authorization")
            res.clearCookie("Refresh")
            res.json({
                status: true,
                message: "User logged out"
            })
        } catch(err) {
            console.log(err)
            res.json({
                status: false,
                error: "Something went wrong"
            })
        }
        
    }
}

export default new _auth;