import 'dotenv/config';
import cors from 'cors'
import express from "express";
import mongoose from 'mongoose';
import bvnRouter from "./routes/bvn.route.js"
import creditHistoryRouter from "./routes/credithistory.route.js"
import accountRouter from "./routes/account.route.js"
import identityRouter from "./routes/identity.route.js"

const app = express()  

//middleware
app.use(cors({origin: "https://fintrack360.vercel.app"}))
app.use(express.json())
app.use((req, res, next)=>{
  console.log(req.path, req.method)
  next()
})


//routes

app.use('/api/bvn',bvnRouter)
app.use('/api/',creditHistoryRouter)
app.use('/api/',accountRouter)
app.use('/api/',identityRouter)

app.use("/",(req, res)=>{
  res.send("server is running, mafo")
});


mongoose.connect(process.env.MONGO_URI)
  .then(()=>{
    console.log('App connected to database');
    app.listen(process.env.PORT, () => {
      console.log('Example app listening on port', process.env.PORT)
    })
  })
  .catch((error)=>{
    console.log(error)
  })