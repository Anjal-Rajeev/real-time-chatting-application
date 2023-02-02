const mongoose = require ('mongoose')
mongoose.set('strictQuery', true);

const MONGO_URL = 'mongodb+srv://AnjalRajeev:anjalrajeev@cluster0.cgp2vwd.mongodb.net/Sociahub_chatting_app?retryWrites=true&w=majority'

mongoose.connect(MONGO_URL)
.then(()=>{
    console.log('-------mongodb connected successfully-------')
})
.catch((error)=>{
    console.log(error.message)
})  