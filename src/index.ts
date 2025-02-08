// import from express  library
import express, { Request, Response, Router } from "express"
import { User } from "./models/User"
import dotenv from 'dotenv'

// import mongoose module from mongoose
import mongoose from "mongoose"
dotenv.config()
// confure express router
const router = Router()
//asyncrouns function to connect monodm
const  connectdb=async()=>{
try {
    //connect to mongo db 
    await mongoose.connect(process.env.MONGODB_URI as string)
    console.log('databse connected!')
} catch (error) {
    // compiled only when failed to connect to db
    console.log(error)
}
}
// configure express server
const app = express()
//allow express server to handle json data
app.use(express.json())
//configure port were server will run and it callback
app.listen(process.env.PORT as string,()=>{
    connectdb()
    console.log(`appp is listening to ${process.env.PORT}`)  
}) 
// configure router 
router.post('/',async(req:Request,res:Response)=>{
    try {
        const user = req.body
        console.log(req.body)
        await User.create(user)
        //provide response with status code and json response data 
        res.status(201).json({message:"user inserted succefull"})   
    } catch (error) {
       res.status(500).json({message:"failed to create user"})
    }
})
router.post('/login',async(req:Request,res:Response)=>{
    try {

        const email = req.body.email
        const password = req.body.password
    const user = await User.findOne({email:email})
    if(!user){
        res.status(404).json({message:'user not found'})
        return
        
    }
    if(user.password!==password){
        res.status(401).json({message:"password don't match"})
        return
    } 
       
    
    res.status(200).json({message:"login successful"})
    return
}
    catch (error) {
        res.status(500).json({message:"failed to login "})
        
    }

}
)

router.get('/user',async(req:Request,res:Response)=>{
    try {
        const user             = await User.find()
        res.status(200).json(user)
        
    } catch (error) {
       res.status(500).json({message:"failed to fetch user"})
       console.log(error)
        
    }
})
//connect router with server
app.use(router)