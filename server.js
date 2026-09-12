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

missions.listen(PORT,()=>{
    console.log(`server is active at http://localhost:${PORT}`);
    
});
