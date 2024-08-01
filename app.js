const express = require('express'); 
const mysql = require('mysql2'); 
const app = express(); 
  
const port = 3000; 
  
app.use(express.json()); 
  
// Create MySQL connection 
const connection = mysql.createConnection({ 
//host: 'localhost', 
//port: '3316', 
//user: 'root', 
//password: '', 
//database: 'c237_studymates' 

host: 'mysql-jamal.alwaysdata.net',
user: 'jamal',
password: 'Ca201820192020!',
database: 'jamal_c237'

}); 
  
connection.connect((err) => { 
if (err) { 
console.error('Error connecting to MySQL:', err); 
return; 
} 
console.log('Connected to MySQL database'); 
}); 
// Set up view engine 
app.set('view engine', 'ejs'); 
// enable static files 
app.use(express.static('public')); 
//enable form process 
app.use(express.urlencoded({ 
    extended:false 
})); 
  
app.get('/', (req,res)=>{ 
    const sql = 'SELECT * FROM goaltable'; 
    connection.query(sql,(error,results) =>{ 
        if(error){ 
            console.log('Database query error:', error.message); 
            return res.status(500).send('Error Retrieving goal'); 
  
        } 
        res.render('index', {goaltable: results}); 
    }); 
}); 
    
app.get('/goal/:id', (req,res)=>{ 
    const goalId = req.params.id; 
    const sql = 'SELECT * FROM goaltable WHERE goalId = ?'; 
connection.query(sql, [goalId], (error,results)=> { 
    if (error){ 
        console.error('Database query error', error.message); 
        return res.status(500).send('Error Retrieving goal by ID'); 
    } 
  
    if (results.length >0){ 
        res.render('goals', { goals : results[0] }); 
    } else { 
        res.status(404).send('goals not found'); 
    } 
});

}); 
app.get('/addGoal', (req,res) =>{ 
    res.render('addGoal'); 
}); 

app.get('/calendar', (req,res) =>{ 
    res.render('calendar'); 
}); 
  
app.post('/goal', (req, res) => { 
    const { goal, targetDate, goalDescription } = req.body; 
    const sql = 'INSERT INTO goaltable (goal, targetDate, goalDescription) VALUES (?, ?, ?)'; 
    
    connection.query(sql, [goal, targetDate, goalDescription], (error, results) => { 
        if (error) { 
            console.log('Error adding goal:', error); 
            res.status(500).send('Error adding goal'); 
        } else { 
            console.log('New goal added:', results); 
            res.redirect('/'); 
        } 
    }); 
}); 
app.get('/editGoal/:id', (req,res)=>{ 
    const goalId=req.params.id; 
    const sql = 'SELECT * FROM goaltable WHERE goalId = ?'; 
    connection.query(sql, [goalId], (error,results)=> { 
        if (error){ 
            console.error('Database query error', error.message); 
            return res.status(500).send('Error Retrieving goal by ID'); 
        } 
      
        if (results.length >0){ 
            res.render('editGoal', { goals : results[0] }); 
        } else { 
            res.status(404).send('goals not found'); 
        } 
    }); 
}); 
 
app.post('/editGoal/:id', (req,res)=>{ 
    const goalId=req.params.id; 
    const { goal, targetDate, goalDescription } = req.body; 
    const sql = 'UPDATE goaltable SET goal = ?, targetDate = ?, goalDescription = ? WHERE goalId = ?' 
    
    connection.query(sql, [goal, targetDate, goalDescription, goalId], (error, results) => { 
        if (error) { 
            console.error('Error updating goal:', error); 
            res.status(500).send('Error updating goal'); 
        } else { 
            res.redirect('/'); 
        } 
    }); 
}) 

app.get('/deleteGoal/:id', (req,res)=>{ 
    const goalId = req.params.id; 
    const sql = 'DELETE FROM goaltable WHERE goalId = ?'; 
    connection.query(sql, [goalId], (error,results)=> { 
    if (error) { 
        console.error("Error deleting goal:", error); 
        res.status(500).send('Error deleting goal'); 
    } else { 
        res.redirect('/') 
    } 
    }); 
}) 

app.get('/profile', (req,res)=>{ 
    const sql = 'SELECT * FROM usertable'; 
    connection.query(sql,(error,results) =>{ 
        if(error){ 
            console.log('Database query error:', error.message); 
            return res.status(500).send('Error Retrieving user'); 
  
        } 
        res.render('profile', {usertable: results}); 
    }); 
}); 

app.get('/profile/:id', (req,res)=>{ 
    const userId = req.params.id; 
    const sql = 'SELECT * FROM usertable WHERE userId = ?'; 
connection.query(sql, [userId], (error,results)=> { 
    if (error){ 
        console.error('Database query error', error.message); 
        return res.status(500).send('Error Retrieving goal by ID'); 
    } 
  
    if (results.length >0){ 
        res.render('profile', { user : results[0] }); 
    } else { 
        res.status(404).send('user not found'); 
    } 
});

});

app.get('/editProfile/:id', (req,res)=>{ 
    const userId=req.params.id; 
    const sql = 'SELECT * FROM usertable WHERE userId = ?'; 
    connection.query(sql, [userId], (error,results)=> { 
        if (error){ 
            console.error('Database query error', error.message); 
            return res.status(500).send('Error Retrieving user by ID'); 
        } 
      
        if (results.length >0){ 
            res.render('editProfile', { user : results[0] }); 
        } else { 
            res.status(404).send('profile not found'); 
        } 
    }); 
}); 
 
app.post('/editProfile/:id', (req,res)=>{ 
    const userId=req.params.id; 
    const { userName, password, email } = req.body; 
    const sql = 'UPDATE usertable SET userName = ?, password = ?, email = ? WHERE userId = ?' 
    
    connection.query(sql, [userName, password, email, userId], (error, results) => { 
        if (error) { 
            console.error('Error updating profile:', error); 
            res.status(500).send('Error updating profile'); 
        } else { 
            res.redirect('/'); 
        } 
    }); 
}) 

app.listen(port, () =>{ 
    console.log(`server is running at http://localhost:${port}`); 
});