const pool = require("./pool");

async function insertUser(userEmail , firstname , lastname , isAdmin, hashedPassword){
    
    
    await pool.query("INSERT INTO users (email , firstname , lastname , admin , member ,  password) VALUES ($1, $2 , $3 , $4 , $5 , $6)", [
        userEmail,
        firstname,
        lastname, 
        isAdmin ,
        false, 
        hashedPassword,
        ]);
}


async function getUserByEmail(userEmail){
    const {rows} = await pool.query("SELECT * FROM users WHERE email = ($1)",[userEmail])
    return rows[0];
}


async function makeUserMember(id){
    await pool.query(`
    UPDATE users 
    SET 
    member = 't'
    WHERE users.id = $1
    `,[id])
}

async function insertNewMessage(user_id ,  title , post ){
    await pool.query("INSERT INTO messages (user_id , title , post , added ) VALUES ($1 ,$2, $3 , to_timestamp($4/1000.0) )",[user_id ,  title , post , Date.now()]);
}

async function getAllMessages(){
    const {rows} = await pool.query("SELECT messages.id , users.firstname , users.lastname , messages.title , messages.post , messages.added FROM messages JOIN users ON messages.user_id = users.id")
    return rows;
}


async function deleteMessageById(id){
    await pool.query("DELETE FROM messages WHERE messages.id = $1",[id])
}

module.exports = {
    insertUser ,
    getUserByEmail,
    makeUserMember,
    insertNewMessage,
    getAllMessages,
    deleteMessageById
}