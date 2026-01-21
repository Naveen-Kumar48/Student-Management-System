import express from 'express'
import env from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.js'
import authroutes from './routes/auth.routes.js'
env.config()
const app=express()

app.use(cors());

app.use(express.json())
const PORT=process.env.PORT

// Connect MongoDB
connectDB();

app.get("/", (req, res) => {
  res.send("Project Management System API running");
});
app.use("/api/auth",authroutes);

app.listen(PORT,(req,res)=>{
    console.log(`server is runing at port http://localhost:${PORT}`)
})