/*
 * These functions below are for various webpage functionalities. 
 * Each function serves to process data on the frontend:
 *      - Before sending requests to the backend.
 *      - After receiving responses from the backend.
 * 
 * To tailor them to your specific needs,
 * adjust or expand these functions to match both your 
 *   backend endpoints 
 * and 
 *   HTML structure.
 * 
 */


// This function checks the database connection and updates its status on the frontend.
async function checkDbConnection() {
    const statusElem = document.getElementById('dbStatus');
    const loadingGifElem = document.getElementById('loadingGif');

    const response = await fetch('/check-db-connection', {
        method: "GET"
    });

    loadingGifElem.style.display = 'none';
    statusElem.style.display = 'inline';

    response.text()
    .then((text) => {
        statusElem.textContent = text;
    })
    .catch((error) => {
        statusElem.textContent = 'connection timed out';  
    });
}

// Fetches data from the demotable and displays it.
async function fetchAndDisplayUsers() {
    const tableElement = document.getElementById('demotable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/demotable', {
        method: 'GET'
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// Fetches data from the player and displays it.
async function fetchAndDisplayPlayer() {
    const tableElement = document.getElementById('playertable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/player', {
        method: 'GET'
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

//For projection

async function projectPlayerColumns(event) {
    event.preventDefault();

    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const selectedColumns = Array.from(checkboxes).map((checkbox) => checkbox.value);

    if (selectedColumns.length === 0) {
        alert("Please select at least one column.");
        return;
    }

    const response = await fetch('/project-player', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ columns: selectedColumns }),
    });

    const responseData = await response.json();
    console.log("Projection Response Data:", responseData); 

    if (responseData.success) {
        const tableElement = document.getElementById('playertable');
        const tableBody = tableElement.querySelector('tbody');
        const tableHeader = tableElement.querySelector('thead tr');

        // Clear existing headers and rows
        tableHeader.innerHTML = ''; // Clear previous headers
        tableBody.innerHTML = ''; // Clear previous rows

        selectedColumns.forEach(col => {
            const headerCell = document.createElement('th');
            headerCell.textContent = col;
            tableHeader.appendChild(headerCell);
        });

        responseData.data.forEach(row => {
            const tableRow = tableBody.insertRow();
            row.forEach(value => {
                const cell = tableRow.insertCell();
                cell.textContent = value;
            });
        });
    } else {
        alert(responseData.message || "Error fetching data.");
    }
}


// Fetches data from the Item and displays it.
async function fetchAndDisplayItem() {
    const tableElement = document.getElementById('itemtable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/item', {
        method: 'GET'
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// Fetches data from the Game and displays it.
async function fetchAndDisplayGame() {
    const tableElement = document.getElementById('gametable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/game', {
        method: 'GET'
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}



// This function resets or initializes the demotable.
async function resetDemotable() {
    const response = await fetch("/initiate-demotable", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetResultMsg');
        messageElement.textContent = "demotable initiated successfully!";
        fetchTableData();
    } else {
        alert("Error initiating table!");
    }
}

// Inserts new records into the demotable.
async function insertDemotable(event) {
    event.preventDefault();

    const idValue = document.getElementById('insertId').value;
    const nameValue = document.getElementById('insertName').value;

    const response = await fetch('/insert-demotable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: idValue,
            name: nameValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Data inserted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error inserting data!";
    }
}

// Updates names in the demotable.
async function updateNameDemotable(event) {
    event.preventDefault();

    const oldNameValue = document.getElementById('updateOldName').value;
    const newNameValue = document.getElementById('updateNewName').value;

    const response = await fetch('/update-name-demotable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            oldName: oldNameValue,
            newName: newNameValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateNameResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Name updated successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error updating name!";
    }
}

// Counts rows in the demotable.
// Modify the function accordingly if using different aggregate functions or procedures.
async function countDemotable() {
    const response = await fetch("/count-demotable", {
        method: 'GET'
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('countResultMsg');

    if (responseData.success) {
        const tupleCount = responseData.count;
        messageElement.textContent = `The number of tuples in demotable: ${tupleCount}`;
    } else {
        alert("Error in count demotable!");
    }
}

// Inserting a player
async function insertPlayer(event) {
    event.preventDefault();

    const username = document.getElementById('insertUsername').value;
    const followers = document.getElementById('insertFollowers').value;
    const following = document.getElementById('insertFollowing').value;
    const reviews = document.getElementById('insertReviews').value;
    const achievements = document.getElementById('insertAchievements').value;

    const response = await fetch('/insert-player', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            followers: followers,
            following: following,
            reviews: reviews,
            achievements: achievements
        })
    });

    const data = await response.json();
    const messageElement = document.getElementById('insertResultMsg');
    if (data.success) {
        messageElement.textContent = "Player inserted successfully!";
        fetchPlayer(); 
    } else {
        messageElement.textContent = "Error inserting player!";
    }
}
async function updateItem(event) {
    event.preventDefault();

    const oldNameValue = document.getElementById('updateOldItemName').value;
    const newNameValue = document.getElementById('updateNewItemName').value;
    const oldPriceValue = document.getElementById('updateOldItemPrice').value;
    const newPriceValue = document.getElementById('updateNewItemPrice').value;
    const oldFunctionValue = document.getElementById('updateOldItemFunction').value;
    const newFunctionValue = document.getElementById('updateNewItemFunction').value;
    
    const response = await fetch('/update-item', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            oldName: oldNameValue,
            newName: newNameValue,
            oldPrice: oldPriceValue,
            newPrice: newPriceValue,
            oldFunction: oldFunctionValue,
            newFunction: newFunctionValue

        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateNameResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Item updated successfully!";
        fetchItem();
    } else {
        messageElement.textContent = "Error updating item!";
    }
}
async function deletePlayer(event){


    event.preventDefault(); 

    const username = document.getElementById('deleteOldFollowers').value;

  
    const response = await fetch("/delete-Player", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username
            })
        });

        const data = await response.json();
        const messageElement = document.getElementById('deleteResultMsg');
      

        if (data.success) {
            messageElement.textContent = "Player deleted successfully!";
            fetchPlayer(); // Optional
            
        } else {
            messageElement.textContext = "Error in deleting!";
        }

   
};


async function fetchPlayersWithAtLeast50Followers() {
    const response = await fetch('/having-aggregate', { method: 'GET' });
    const data = await response.json();
    const messageElement = document.getElementById('havingResultMsg');
    if (data.success) {
        messageElement.textContent = JSON.stringify(data.data); // Display results (format as needed)
    } else {
        messageElement.textContent = 'Error fetching data!';
    }
}

// async function fetchPlayersWithMoreAchievements(event) {
//     event.preventDefault();
//     const username = document.getElementById('insertGroupPlayer').value;

//     const response = await fetch('/nested-aggregate', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username })
//     });

//     const data = await response.json();
//     const messageElement = document.getElementById('nestedgroupResultMsg');
//     messageElement.textContent = '';

//     if (data.success) {
//         if (data.data.length === 0) {
//             messageElement.textContent = 'No players found with more achievements than the given player.';
//             return;
//         }

//         const output = data.data
//             .map(player => `Username: ${player[0]}, Followers: ${player[1]}, Following: ${player[2]}, Reviews: ${player[3]}, Achievements: ${player[4]}`)
//             .join('\n');

//         messageElement.textContent = output;
//     } else {
//         messageElement.textContent = 'Error fetching players!';
//     }
// }


async function fetchPlayersWithMoreAchievements(event) {
    event.preventDefault();
    const username = document.getElementById('insertGroupPlayer').value;
    console.log('Fetching players with more achievements than:', username);

    try {
        const response = await fetch('/nested-aggregate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Response received:', data);

        const messageElement = document.getElementById('nestedgroupResultMsg');
        messageElement.textContent = '';

        if (data.success) {
            if (data.data.length === 0) {
                messageElement.textContent = 'No players found with more achievements than the given player.';
                return;
            }

            const output = data.data
                .map(player => `Username: ${player[0]}, Followers: ${player[1]}, Following: ${player[2]}, Reviews: ${player[3]}, Achievements: ${player[4]}`)
                .join('\n');

            messageElement.textContent = output;
        } else {
            messageElement.textContent = 'Error fetching players!';
        }
    } catch (error) {
        console.error('Error fetching players:', error);
        const messageElement = document.getElementById('nestedgroupResultMsg');
        messageElement.textContent = 'An error occurred while fetching players.';
    }
}



async function fetchGamesReviewedByAllUsers() {
    const response = await fetch('/division', { method: 'GET' });
    const data = await response.json();
    const messageElement = document.getElementById('divisionResultMsg');
    messageElement.textContent = '';

    if (data.success) {
        if (data.data.length === 0) {
            messageElement.textContent = 'No games found that have been reviewed by every user.';
            return;
        }

        const output = data.data
            .map(game => `Game Name: ${game[0]}, Developing Company: ${game[1]}`)
            .join('\n');

        messageElement.textContent = output;
    } else {
        messageElement.textContent = 'Error fetching games!';
    }
}


async function fetchGamesWithAverageRating() {
    const response = await fetch('/group-by', { method: 'GET' });
    const data = await response.json();
    const messageElement = document.getElementById('groupbyResultMsg');
    messageElement.textContent = '';

    if (data.success) {
        if (data.data.length === 0) {
            messageElement.textContent = 'No games found with average ratings.';
            return;
        }

        const output = data.data
            .map(game => `Game Name: ${game[0]}, Developing Company: ${game[1]}, Average Rating: ${game[2]}`)
            .join('\n');

        messageElement.textContent = output;
    } else {
        messageElement.textContent = 'Error fetching games!';
    }
}


async function fetchGamesWithConditions(event) {
    event.preventDefault(); 

    const selectionInput = document.getElementById('selectGameInput').value.trim();

    if (!selectionInput) {
        alert("Please enter a valid selection query.");
        return;
    }

    try {
        const response = await fetch('/select-game', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ conditions: selectionInput })
        });

        const data = await response.json();
        const messageElement = document.getElementById('selectResultMsg');

        messageElement.textContent = ''; // Clear any previous messages

        if (data.success) {
            if (data.data.length === 0) {
                messageElement.textContent = 'No games found matching the given conditions.';
                return;
            }

            // Display results in plain text
            const output = data.data
                .map(row => `Price: ${row[0]}, Name: ${row[1]}, Genre: ${row[2]}, Platform: ${row[3]}, Release Year: ${row[4]}`)
                .join('\n');
            messageElement.textContent = output;
        } else {
            messageElement.textContent = 'Error fetching games!';
        }
    } catch (error) {
        console.error('Error fetching games with conditions:', error);
        const messageElement = document.getElementById('selectResultMsg');
        messageElement.textContent = 'An error occurred while fetching games.';
    }
}


// function displayResults(data) {
//     const table = document.getElementById('jointable');
//     const tbody = tableElement.querySelector('tbody');

   
//     // Create data rows
//     if (tableBody) {
//         tableBody.innerHTML = '';
//     }

//     // Populate the table with the data provided
//     data.forEach(rowData => {
//         const row = tableBody.insertRow();
//         rowData.forEach((field, index) => {
//             const cell = row.insertCell(index);
//             cell.textContent = field;
//         });
//     });
// }


// function displayResults(data) {
//     const tableElement = document.getElementById('jointable');
//     const tableBody = tableElement.querySelector('tbody');

//     tableBody.innerHTML = ''; // Clear any existing rows

//     if (data.length === 0) {
//         console.log("No data to display in the table."); // Debugging log
//         const emptyRow = document.createElement('tr');
//         const emptyCell = document.createElement('td');
//         emptyCell.textContent = 'No results found';
//         emptyCell.colSpan = tableElement.querySelector('thead tr').children.length;
//         emptyRow.appendChild(emptyCell);
//         tableBody.appendChild(emptyRow);
//         return;
//     }

//     console.log("Displaying Results:", data); // Debugging log

//     data.forEach(row => {
//         const tableRow = document.createElement('tr');
//         row.forEach(cellData => {
//             const cell = document.createElement('td');
//             cell.textContent = cellData;
//             tableRow.appendChild(cell);
//         });
//         tableBody.appendChild(tableRow);
//     });
// }
function displayResults(data) {
    const tableElement = document.getElementById('jointable');
    const tableBody = tableElement.querySelector('tbody');

    // Clear existing rows
    tableBody.innerHTML = '';

    if (!data || data.length === 0) {
        console.error('No data to display in the table.');
        const emptyRow = document.createElement('tr');
        const emptyCell = document.createElement('td');
        emptyCell.textContent = 'No results found';
        emptyCell.colSpan = tableElement.querySelector('thead tr').children.length;
        emptyRow.appendChild(emptyCell);
        tableBody.appendChild(emptyRow);
        return;
    }

    console.log('Rendering Join Table Results:', data);

    data.forEach((row) => {
        const tableRow = document.createElement('tr');

        Object.keys(row).forEach((key) => {
            const cell = document.createElement('td');
            if (key === 'TIME') {
                cell.textContent = new Date(row[key]).toLocaleString();
            } else {
                cell.textContent = row[key];
            }
            tableRow.appendChild(cell);
        });

        tableBody.appendChild(tableRow);
    });
}

async function joinTables(event) {
    event.preventDefault();

    const whereCondition = document.getElementById('joinWhere').value;

    try {
        const response = await fetch('/join-table', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ where: whereCondition }),
        });

        const responseData = await response.json();

        if (response.ok && responseData.success) {
            displayResults(responseData.data);
            document.getElementById('joinResultMsg').textContent = 'Join operation successful!';
        } else {
            throw new Error(responseData.message || 'Error performing join operation');
        }
    } catch (error) {
        console.error('Join operation error:', error);
        document.getElementById('joinResultMsg').textContent = 'An error occurred while performing the join operation.';
    }
}


// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    checkDbConnection();
    fetchTableData();
    fetchPlayer();
    fetchItem();
    fetchGame();
    // document.getElementById("resetDemotable").addEventListener("click", resetDemotable);
    // document.getElementById("insertDemotable").addEventListener("submit", insertDemotable);
    // document.getElementById("updataNameDemotable").addEventListener("submit", updateNameDemotable);
    // document.getElementById("countDemotable").addEventListener("click", countDemotable);
    document.getElementById("insertPlayer").addEventListener("submit", insertPlayer);
    document.getElementById("deletePlayer").addEventListener("submit", deletePlayer);
    document.getElementById("updateItem").addEventListener("submit", updateItem);
    document.getElementById("projectPlayer").addEventListener("submit", projectPlayerColumns);
    document.getElementById('having').addEventListener('click', fetchPlayersWithAtLeast50Followers);
    document.getElementById('nestedgroupby').addEventListener('click', fetchPlayersWithMoreAchievements);
    document.getElementById('division').addEventListener('click', fetchGamesReviewedByAllUsers);
    document.getElementById('groupby').addEventListener('click', fetchGamesWithAverageRating);
    document.getElementById('selectGame').addEventListener('submit', fetchGamesWithConditions);
    document.getElementById("join").addEventListener("submit", joinTables);

};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayUsers();
}

function fetchPlayer(){
    fetchAndDisplayPlayer();
}

function fetchItem(){
    fetchAndDisplayItem();
}

function fetchGame(){
    fetchAndDisplayGame(); 
}

