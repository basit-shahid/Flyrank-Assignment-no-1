import Database from 'better-sqlite3'

const db=new Database('missions.db')

db.exec(`
    CREATE TABLE IF NOT EXISTS missions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    missionName TEXT NOT NULL,
    missionDescription TEXT,
    done INTEGER DEFAULT 0
    )
`)

const row=db.prepare('SELECT COUNT(*) AS count FROM missions').get()

if(row.count===0){
    const insert=db.prepare('INSERT INTO missions (missionName,missionDescription,done) VALUES(?,?,?)')
    insert.run('Mission 1','Description of Mission',0)
    insert.run('Mission 2','Description of Mission',0)
    insert.run('Mission 3','Description of Mission',0)
}




export default db