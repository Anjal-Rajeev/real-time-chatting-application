const jwt = require("jsonwebtoken");

const CODE = "this is a realtime chatting application"

const verifyToken = (req,res,next)=>{

    if(!req.headers.authorization){
        return res.status(401).send('Unauthorized request')
    }
    const token = req.headers.authorization
    console.log("verify",token)

    if(token === null){
        return res.status(401).send('Unauthorized request')
    }

    jwt.verify(token, CODE , (err, payload)=>{
        if(err){
            return res.status(401).send('Unauthorized request')
        }
        req.payload =  payload
        next()
    })

}


module.exports = verifyToken