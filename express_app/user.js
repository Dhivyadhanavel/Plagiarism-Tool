const mongoose=require("mongoose")

const text=new mongoose.Schema({
    type:String,
    title:String,
    text1:String,
    text2:String,
    date:String,
    time:String,
    score:Number
})

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        uppercase:true
    },
    username:{
        type:String,
    lowercase:true,
},
    password:String,
    text:[text]

})

module.exports= mongoose.model("User",userSchema)
