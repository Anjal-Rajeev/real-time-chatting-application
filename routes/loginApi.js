const express = require('express')
const router = express.Router()

var jwt = require('jsonwebtoken');
const CODE = "this is a realtime chatting application"
const userModel = require('../models/user')

router.post('', async(req, res)=>{  
    try {

        let data = req.body
        console.log(data)
        let dataFromDB = await userModel.find({email : data.email})
        if(dataFromDB != ""){
            console.log("from db ",dataFromDB);
            if(dataFromDB[0].password != data.password){
                console.log("Invalid credentials")
                res.json({"status" : "2"})
            }else{
                console.log("login successful")
                let payload = {
                    'email': data.email,
                    'password': data.password
                }
                let token = jwt.sign(payload,CODE)
                res.status(200).send([dataFromDB,token]) 
                
            }

        }else{
            console.log("Account doesn't exists")
            res.json({"status" : "1"})
        }
    } catch (error) {
        console.log("login error > ",error)
        res.status(500)
    }
})
 







module.exports=router