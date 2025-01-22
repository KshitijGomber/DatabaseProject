const express = require('express');
const appService = require('./appService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

// Endpoint to insert a player
router.post("/insert-player", async (req, res) => {
    const { username, followers, following, reviews, achievements } = req.body;

    const insertResult = await appService.insertPlayerToDb(username, followers, following, reviews, achievements);
    
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/delete-Player", async (req, res) => {
    const { username } = req.body;

  
        const deleteResult = await appService.deletePlayer(username);
        if (deleteResult) {
            res.json({ success: true});
        } else {
            res.status(500).json({ success: false });
        }
  
});

router.post('/update-item',  async (req, res) => {
    const { oldName, newName, oldPrice, newPrice, oldFunction, newFunction } = req.body;
    const updateResult = await appService.updateItem(oldName, newName, oldPrice, newPrice, oldFunction, newFunction);
        if (updateResult) {
            res.json({ success: true});
        } else {
            res.status(500).json({ success: false });
        }


});

router.post('/project-player', async (req, res) => {
    const { columns } = req.body; 

    if (!columns || !Array.isArray(columns) || columns.length === 0) {
        return res.status(400).json({ 
            success: false, 
            message: "Invalid or missing 'columns' parameter." 
        });
    }

    try {
        const tableContent = await appService.projectPlayerFromDb(columns);

        res.json({ 
            success: true, 
            data: tableContent 
        });
    } catch (error) {
        console.error("Error in projection:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch projected data." 
        });
    }
});


router.post("/update-name-demotable", async (req, res) => {
    const { oldName, newName } = req.body;
    const updateResult = await appService.updateNameDemotable(oldName, newName);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-name-demotable", async (req, res) => {
    const { oldName, newName } = req.body;
    const updateResult = await appService.updateNameDemotable(oldName, newName);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});


router.get('/demotable', async (req, res) => {
    const tableContent = await appService.fetchDemotableFromDb();
    res.json({data: tableContent});
});

router.get('/player', async (req, res) => {
    const tableContent = await appService.fetchPlayerFromDb();
    res.json({data: tableContent});
});

router.get('/item', async (req, res) => {
    const tableContent = await appService.fetchItemFromDb();
    res.json({data: tableContent});
});

router.get('/game', async (req, res) => {
    const tableContent = await appService.fetchGameFromDb();
    res.json({data: tableContent});
});


//this is for reset
router.post("/initiate-demotable", async (req, res) => {
    const initiateResult = await appService.initiateDemotable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-demotable", async (req, res) => {
    const { id, name } = req.body;
    const insertResult = await appService.insertDemotable(id, name);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});



router.get('/count-demotable', async (req, res) => {
    const tableCount = await appService.countDemotable();
    if (tableCount >= 0) {
        res.json({ 
            success: true,  
            count: tableCount
        });
    } else {
        res.status(500).json({ 
            success: false, 
            count: tableCount
        });
    }
});

// router.post('/nested-aggregate', async (req, res) => {
//     const { username } = req.body;
//     try {
//         const result = await appService.getPlayersWithMoreAchievementsThan(username);
//         res.json({ success: true, data: result });
//     } catch (err) {
//         console.error('Error in nested aggregate query:', err);
//         res.status(500).json({ success: false, message: 'Error executing nested aggregate query.' });
//     }
// });

router.post('/nested-aggregate', async (req, res) => {
    const { username } = req.body;
    console.log('Received username:', username);
    try {
        const result = await appService.getPlayersWithMoreAchievementsThan(username);
        console.log('Query result:', result);
        res.json({ success: true, data: result });
    } catch (err) {
        console.error('Error in nested aggregate query:', err);
        res.status(500).json({ success: false, message: 'Error executing nested aggregate query.' });
    }
});




router.get('/division', async (req, res) => {
    try {
        const result = await appService.getGamesReviewedByAllUsers();
        res.json({ success: true, data: result });
    } catch (err) {
        console.error('Error in division query:', err);
        res.status(500).json({ success: false, message: 'Error executing division query.' });
    }
});

router.get('/group-by', async (req, res) => {
    try {
        const result = await appService.getGamesWithAverageRating();
        res.json({ success: true, data: result });
    } catch (err) {
        console.error('Error in group by query:', err);
        res.status(500).json({ success: false, message: 'Error executing group by query.' });
    }
});

router.get('/having-aggregate', async (req, res) => {
    try {
        const result = await appService.getPlayersWithAtLeast50Followers();
        res.json({ success: true, data: result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error fetching players with at least 50 followers' });
    }
});

router.post('/select-game', async (req, res) => {
    const { conditions } = req.body;

    if (!conditions || typeof conditions !== 'string') {
        return res.status(400).json({ success: false, message: 'Invalid conditions provided.' });
    }

    try {
        const result = await appService.getGamesByConditions(conditions);
        res.json({ success: true, data: result });
    } catch (err) {
        console.error('Error in SELECT query:', err);
        res.status(500).json({ success: false, message: 'Error executing SELECT query.' });
    }
});


router.post("/join-table", async (req, res) => {
    const { where } = req.body;
    try {
        const result = await appService.joinTable(where);
        
        if (result && result.length > 0) {
            console.log("Join Table Result:", result); 
            res.json({ success: true, data: result });
        } else {
            console.log("No data returned from join query.");
            res.json({ success: true, data: [] }); 
        }
    } catch (err) {
        console.error("Error in join-table route:", err);
        res.status(500).json({ success: false, message: "Error executing join query." });
    }
});


module.exports = router;
