import { PrismaClient }from '@prisma/client'

const db = new PrismaClient();

// const pool = mysql.createPool({
//     host: process.env.MYSQL_HOST,
//     user: process.env.MYSQL_USER,
//     password: process.env.MYSQL_PASSWORD,
//     database: process.env.MYSQL_DATABASE
// })

// export default pool;

// async function getList(){
//     const [result] = await pool.query("SELECT * FROM todo")
//     return result
// }

// const list = await getList()
// console.log(list)

export default db;

