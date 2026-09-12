import express from 'express'

const missions=express()
const PORT=3000

let missionslist=[
    {
        missionID:1,
        missionName:"Mission 1",
        missionDescription:"This is mission 1",
    },
    {
        missionID:2,
        missionName:"Mission 2",
        missionDescription:"This is mission 2",
    },
    {
        missionID:3,
        missionName:"Mission 3",
        missionDescription:"This is mission 3",
    }
]

/*
missions.get('/',(req,res)=>{
res.json({message:"Hello, Server!"});
});

*/

missions.get('/',(req,res)=>{
    res.json({name:"Mission API",version:"1.0",endpoints:["/missions"]})
});

missions.get('/health',(req,res)=>{
 res.json({status:"ok"})
});



missions.get('/missions',(req,res)=>{

    res.json(missionslist);

});

missions.get('/missions/:id',(req,res)=>{
    const missionID=parseInt(req.params.id);
    const mission=missionslist.find(m=>m.missionID===missionID);

    if(!mission){
       return res.status(404).json({error: `Mission ${missionID} not found`});

    }
    else{
        res.json(mission);
    }
});

missions.listen(PORT,()=>{
    console.log(`server is active at http://localhost:${PORT}`);
    
});
