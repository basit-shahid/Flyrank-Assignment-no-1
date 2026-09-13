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

    const insert=db.prepare('INSERT INTO missions(missionName,missionDescription,done) VALUES(?,?,?)');
    const result=insert.run(missionName,missionDescription,0);

    const newID=result.lastInsertRowid;
    const newmission=db.prepare('SELECT *FROM missions WHERE id=?').get(newID);
    res.status(201).json(newmission);



    

});



missions.put('/missions/:id',(req,res)=>{
    const missionID=parseInt(req.params.id);
    const mission=db.prepare('SELECT * FROM missions WHERE id=?').get(missionID);

    if(!mission){
        return res.status(404).json({error:`Mission ${missionID} not found`});
    }
   
    const { missionName, missionDescription,done } = req.body;

    if (missionName === undefined && missionDescription === undefined && done===undefined) {
        return res.status(400).json({ error: "Provide missionName and/or missionDescription and/or done" });
    }

    const updatedName=missionName !==undefined?missionName:mission.missionName;
    const updatedDescription=missionDescription !==undefined?missionDescription:mission.missionDescription;
    const updatedDone= done !==undefined? (done ?1:0):mission.done;

    db.prepare('UPDATE missions SET missionName=?,missionDescription=?,done=? WHERE id=?').run(updatedName,updatedDescription,updatedDone,missionID);

    const updatedMission=db.prepare('SELECT * FROM missions WHERE id=?').get(missionID);
    res.json(updatedMission);

})

missions.delete('/missions/:id',(req,res)=>{

    const missionID=parseInt(req.params.id);
    const mission=db.prepare('SELECT * FROM missions WHERE id=?').get(missionID);

    if(!mission){
        return res.status(404).json({error:`Mission ${missionID} not found`});

    }

    db.prepare('DELETE FROM missions WHERE id=?').run(missionID);
    res.status(204).send();

});


missions.listen(PORT,()=>{
    console.log(`server is active at http://localhost:${PORT}`);
    
});
