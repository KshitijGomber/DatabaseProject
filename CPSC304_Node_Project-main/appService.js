const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');

const envVariables = loadEnvFile('./.env');

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
    poolMin: 1,
    poolMax: 3,
    poolIncrement: 1,
    poolTimeout: 60
};

// initialize connection pool
async function initializeConnectionPool() {
    try {
        await oracledb.createPool(dbConfig);
        console.log('Connection pool started');
    } catch (err) {
        console.error('Initialization error: ' + err.message);
    }
}

async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
        await oracledb.getPool().close(10); // 10 seconds grace period for connections to finish
        console.log('Pool closed');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

initializeConnectionPool();

process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);


// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(); // Gets a connection from the default pool 
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}


// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}

async function fetchDemotableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM DEMOTABLE');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchPlayerFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM PLAYER');
        return result.rows;
    }).catch(() => {
        return [];
    });

}

async function fetchItemFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Price, Name, Function, ID FROM ITEM');
        return result.rows;
    }).catch(() => {
        return [];
    });

}

async function fetchGameFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Price, Name, Genre, Platform, release_year FROM Game');
        return result.rows;
    }).catch(() => {
        return [];
    });

}

async function initiateDemotable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE DEMOTABLE`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE DEMOTABLE (
                id NUMBER PRIMARY KEY,
                name VARCHAR2(20)
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function insertDemotable(id, name) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO DEMOTABLE (id, name) VALUES (:id, :name)`,
            [id, name],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

// async function projectPlayerFromDb(columns) {
//     const columnList = columns.map((col) => `"${col}"`).join(", "); // Ensure proper formatting
//     const query = `SELECT ${columnList} FROM Player`; // Adjust 'Player' to your table name

//     try {
//         const result = await oracleDbConnection.execute(query);
//         return result.rows; // Return the selected rows
//     } catch (error) {
//         console.error("Error executing projection query:", error);
//         throw error; // Ensure the error propagates
//     }
// }


async function projectPlayerFromDb(columns) {
    return await withOracleDB(async (connection) => {
        try {
            const columnList = columns.join(", "); 
            const query = `SELECT ${columnList} FROM Player`;

            console.log("Generated Query:", query); 
            const result = await connection.execute(query);
            return result.rows;
        } catch (error) {
            console.error("Error executing projection query:", error);
            throw error;
        }
    });
}







async function countDemotable() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM DEMOTABLE');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

// Function to insert a player into the Oracle database
async function insertPlayerToDb(username, followers, following, reviews, achievements) {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `INSERT INTO Player (username, followers, following, reviews, achievements) 
                 VALUES (:username, :followers, :following, :reviews, :achievements)`,
                [username, followers, following, reviews, achievements],
                { autoCommit: true }
            );
            return result.rowsAffected > 0;  
        } catch (err) {
            console.error('Error inserting player: ', err);
            return false;
        }
    });
}

async function updateItem(oldName, newName, oldPrice, newPrice, oldFunction, newFunction) {
    return await withOracleDB(async (connection) => {
        try{
        const result = await connection.execute(
            `UPDATE ITEM SET name=:newName, price=:newPrice, function=:newFunction where name=:oldName AND price=:oldPrice AND function=:oldFunction`,
            [newName,newPrice,newFunction, oldName, oldPrice, oldFunction],
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }catch(err){
        console.error('Error updating item: ', err);
        return false;

    }

    });

}

async function updateNameDemotable(oldName, newName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE DEMOTABLE SET name=:newName where name=:oldName`,
            [newName, oldName],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function deletePlayer(username) {
    return await withOracleDB(async (connection) => {
        try{
        const result = await connection.execute(
            `DELETE FROM Player WHERE Trim(username) = :username`,
            [username],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0; // True if rows were deleted
    }catch(err) {
        console.error('Error inserting player: ', err);
        return false;
    }
});
}


async function getPlayersWithAtLeast50Followers() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT *
            FROM Player
            WHERE followers >= 50
        `);
        return result.rows;
    }).catch((err) => {
        console.error('Error in HAVING query: ', err);
        return [];
    });
}

// async function getPlayersWithMoreAchievementsThan(username) {
//     return await withOracleDB(async (connection) => {
//         const result = await connection.execute(
//             `
//             SELECT *
//             FROM Player
//             WHERE achievements > (
//                 SELECT achievements
//                 FROM Player
//                 WHERE username = :username
//             )
//             `,
//             [username]
//         );
//         return result.rows;
//     }).catch((err) => {
//         console.error('Error in nested aggregate query:', err);
//         throw err;
//     });
// }



async function getPlayersWithMoreAchievementsThan(username) {
    console.log('Executing nested aggregate query for username:', username);
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `
            SELECT *
            FROM Player
            WHERE achievements > (
                SELECT achievements
                FROM Player
                WHERE username = :username
            )
            `,
            [username]
        );
        console.log('Query result:', result.rows);
        return result.rows;
    }).catch((err) => {
        console.error('Error in nested aggregate query:', err);
        throw err;
    });
}



async function getGamesReviewedByAllUsers() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT G.name, G.developing_company
            FROM Game G
            WHERE NOT EXISTS (
                SELECT R2.author_username
                FROM Review R2
                WHERE NOT EXISTS (
                    SELECT R1.author_username
                    FROM Review R1
                    WHERE R1.game_name = G.name
                      AND R1.game_developing_company = G.developing_company
                      AND R1.author_username = R2.author_username
                )
            )
        `);
        return result.rows;
    }).catch((err) => {
        console.error('Error in division query:', err);
        throw err;
    });
}

async function getGamesWithAverageRating() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT
                G.name AS game_name,
                G.developing_company,
                AVG(R.rating) AS average_rating
            FROM Game G
                     JOIN Review R ON G.name = R.game_name AND G.developing_company = R.game_developing_company
            GROUP BY G.name, G.developing_company
        `);
        return result.rows;
    }).catch((err) => {
        console.error('Error in group by query:', err);
        throw err;
    });
}



async function getGamesByConditions(conditions) {
    return await withOracleDB(async (connection) => {
        const query = `SELECT Price, Name, Genre, Platform, release_year FROM Game WHERE ${conditions}`;
        console.log('Generated Query:', query); // Debugging purposes

        const result = await connection.execute(query);
        return result.rows;
    }).catch((err) => {
        console.error('Error in SELECT query:', err);
        throw err;
    });
}


async function joinTable(where) {
    return await withOracleDB(async (connection) => {
        const query = `SELECT G.price, G.name, G.genre, G.platform, G.release_year,
            R.rating, R.text, R.time, R.author_username
            FROM Game G
            JOIN Review R
            ON G.name = R.game_name AND G.developing_company = R.game_developing_company
            WHERE ${where}`;
        console.log('Generated Query:', query);

        const result = await connection.execute(query, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        // Process rows to read LOBs
        const rows = await Promise.all(
            result.rows.map(async (row) => {
                if (row.TEXT && row.TEXT instanceof oracledb.Lob) {
                    row.TEXT = await readLobContent(row.TEXT);
                }
                return row;
            })
        );

        console.log('Processed Rows:', rows); // Debugging output
        return rows;
    }).catch((err) => {
        console.error('Error joining:', err);
        return false;
    });
}

// Helper function to read CLOB content
function readLobContent(lob) {
    return new Promise((resolve, reject) => {
        let content = '';
        lob.setEncoding('utf8');
        lob.on('data', (chunk) => {
            content += chunk;
        });
        lob.on('end', () => resolve(content));
        lob.on('error', (err) => reject(err));
    });
}



module.exports = {
    insertPlayerToDb,
    getGamesByConditions,
    joinTable, 
    deletePlayer,
    getPlayersWithAtLeast50Followers,
    getGamesWithAverageRating,
    getGamesReviewedByAllUsers,
    getPlayersWithMoreAchievementsThan,
    updateItem, 
    testOracleConnection,
    fetchDemotableFromDb,
    fetchPlayerFromDb,
    fetchItemFromDb,
    fetchGameFromDb,
    initiateDemotable, 
    projectPlayerFromDb,
    insertDemotable, 
    updateNameDemotable, 
    countDemotable
};
