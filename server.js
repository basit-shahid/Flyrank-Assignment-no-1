import express from 'express'
import swaggerUi from 'swagger-ui-express'
import { readFileSync } from 'fs'
import db from './db.js'

const openapiSpec = JSON.parse(readFileSync('./openapi.json', 'utf-8'))


const missions=express()
const PORT=3000

missions.use(express.json())




/*
missions.get('/',(req,res)=>{
res.json({message:"Hello, Server!"});
});

*/

missions.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec))

missions.get('/',(req,res)=>{
    res.json({name:"Mission API",version:"1.0",endpoints:["/missions"]})
});

missions.get('/health',(req,res)=>{
 res.json({status:"ok"})
});



missions.get('/missions',(req,res)=>{

    const missionslist=db.prepare('SELECT * FROM missions').all();
    res.json(missionslist);
    

});

missions.get('/missions/:id',(req,res)=>{
    const missionID=parseInt(req.params.id);
    const mission=db.prepare('SELECT * FROM missions WHERE id=?').get(missionID);

    if(!mission){
       return res.status(404).json({error: `Mission ${missionID} not found`});

    }
    else{
        res.json(mission);
    }
});

missions.post('/missions',(req,res)=>{

    const {missionName,missionDescription}=req.body;

    if(!missionName|| missionName.trim()===''){
        return res.status(400).json({error:"Mission name is mandatory"});
    }

    const newmission={
        missionID:nextID++,
        missionName,
    missionDescription}

    missionslist.push(newmission);
    res.status(201).json(newmission);
});



missions.put('/missions/:id',(req,res)=>{
    const missionID=parseInt(req.params.id);
    const mission=missionslist.find(m=>m.missionID===missionID);

    if(!mission){
        return res.status(404).json({error:`Mission ${missionID} not found`});
    }
   
    const { missionName, missionDescription } = req.body;

    if (missionName === undefined && missionDescription === undefined) {
        return res.status(400).json({ error: "Provide missionName and/or missionDescription" });
    }

    if (missionName !== undefined) mission.missionName = missionName;
    if (missionDescription !== undefined) mission.missionDescription = missionDescription;

    res.json(mission)


})

missions.delete('/missions/:id',(req,res)=>{

    const missionID=parseInt(req.params.id);
    const missionIndex=missionslist.findIndex(m=>m.missionID===missionID);
    if(missionIndex===-1){
        return res.status(404).json({error:`Mission ${missionID} not found`});

    }

    missionslist.splice(missionIndex,1);
    res.status(204).send();

});


missions.listen(PORT,()=>{
    console.log(`server is active at http://localhost:${PORT}`);
    
});
