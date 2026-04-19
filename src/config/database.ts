// Get the client
import exp from 'constants';
import mysql from 'mysql2/promise';

const getConnection = async () => {
    // Create the connection to database
    const connection = await mysql.createConnection({
        port: 3306,
        host: 'localhost',
        user: 'root',
        password: 'Thanhhai2004@',
        database: 'pcstore',
    });
    return connection;
}



export default getConnection;