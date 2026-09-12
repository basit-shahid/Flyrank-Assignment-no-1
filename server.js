import express from 'express'

const missions=express()
const PORT=3000


missions.get('/',(req,res)=>{
res.send({message:"Hello, Server!"});
});

missions.listen(PORT,()=>{
    console.log(`server is active at http://localhost:${PORT}`);
    
})
