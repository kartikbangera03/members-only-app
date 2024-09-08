const pool = require("./pool");

async function insertUser(userEmail , firstname , lastname , isAdmin, hashedPassword){
    
    
    await pool.query("INSERT INTO users (email , firstname , lastname , admin , password) VALUES ($1, $2 , $3 , $4 , $5 )", [
        userEmail,
        firstname,
        lastname, 
        isAdmin , 
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
    member = true
    WHERE id = ($1)
    `,[id])
}

module.exports = {
    insertUser ,
    getUserByEmail,
    makeUserMember
}