
//DB initialization
const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const app =express();
app.use(express.json());
app.use(cors());


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "bookshop"

})
//=============================================================================================================================
//========================================== Admin CRUD Functions ==============================================================

// get all book details, admin will handle those details
app.get("/adminBookList", (req,res) =>{
    const sql = "SELECT * FROM bookinfo";
    db.query(sql, (err,data)=>{
        if(err) return res.json("Error");
        return res.json(data);
    })
})

app.post("/postbook", (req, res) => {
    const sql = "INSERT INTO bookinfo (`bookName`, `bookAuthor`, `book_publication_date`, `bookType`, `bookPrize`, `bookDescription`) VALUES (?,?,?,?,?,?)";
    const values = [
      req.body.bookName,
      req.body.bookAuthor,
      req.body.book_publication_date,
      req.body.bookType,
      req.body.bookPrize,
      req.body.bookDescription
    ];
  
    db.query(sql, values, (err, data) => {
      if (err) {
        console.error('Error executing query: ' + err.stack);
        return res.status(500).json("Error");
      }
      return res.json(data);
    });
  });
  

  app.put("/updatebook/:bookId", (req, res) => {
    const bookId = req.params.bookId;
    const { bookName, bookAuthor, book_publication_date, bookType, bookPrize, bookDescription } = req.body;
  
    const sql = "UPDATE bookinfo SET bookName = ?, bookAuthor = ?, book_publication_date = ?, bookType = ?, bookPrize = ?, bookDescription = ? WHERE bookId = ?";
    const values = [bookName, bookAuthor, book_publication_date, bookType, bookPrize, bookDescription, bookId];
  
    db.query(sql, values, (err, data) => {
      if (err) {
        console.error('Error executing query: ' + err.stack);
        return res.status(500).json("Error");
      }
  
      if (data.affectedRows === 0) {
        return res.status(404).json({ error: "Book not found" });
      }
  
      return res.json({ message: "Book updated successfully" });
    });
  });
  



app.delete('/bookshop/:bookId',(req,res)=>{
    const sql="DELETE FROM bookinfo WHERE bookId =?";
    const id = req.params.bookId;

    db.query(sql, [id], (err,data)=>{
        if(err) return res.json("error123");
        return res.json(data);
    })
})


// Define Admin login route
app.post('/adminlogin', (req, res) => {
    const { user, password } = req.body;
  
    // Check if the user exists in the database
    const checkUserQuery = 'SELECT * FROM adminuser WHERE user = ? AND password = ?';
    db.query(checkUserQuery, [user, password], (err, results) => {
      if (err) {
        console.error('Error executing query: ' + err.stack);
        res.status(500).json({ error: 'An internal server error occurred' });
        return;
      }
  
      if (results.length === 0) {
        // User not found or invalid credentials
        res.status(401).json({ error: 'Invalid username or password' });
      } else {
        // User logged in successfully
        res.status(200).json({ message: 'Login successful' });
      }
    });
  });

// Define registration route
app.post('/adminregister', (req, res) => {
    const { user, password, email } = req.body;
  
    // Check if the user already exists in the database
    const checkUserQuery = 'SELECT * FROM adminuser WHERE user = ?';
    db.query(checkUserQuery, [user], (err, results) => {
      if (err) {
        console.error('Error executing query: ' + err.stack);
        res.status(500).json({ error: 'An internal server error occurred' });
        return;
      }
  
      if (results.length > 0) {
        // User already exists
        res.status(409).json({ error: 'User already exists' });
      } else {
        // Insert the new user into the database
        const insertUserQuery = 'INSERT INTO adminuser (user, password, email) VALUES (?, ?, ?)';
        db.query(insertUserQuery, [user, password, email], (err, results) => {
          if (err) {
            console.error('Error executing query: ' + err.stack);
            res.status(500).json({ error: 'An internal server error occurred' });
            return;
          }
  
          res.status(201).json({ message: 'User registered successfully' });
        });
      }
    });
  });
  //=================================================================================================================================
  //========================================== Customer CRUD Functions ==============================================================
  

  //get all book details, customers will handle those details
app.get("/booklist", (req,res) =>{
    const sql = "SELECT * FROM booklist";
    db.query(sql, (err,data)=>{
        if(err) return res.json("Error");
        return res.json(data);
    })
})

  // Define Customer login route
app.post('/customerlogin', (req, res) => {
    const { user, password } = req.body;
  
    // Check if the user exists in the database
    const checkUserQuery = 'SELECT * FROM customer WHERE user = ? AND password = ?';
    db.query(checkUserQuery, [user, password], (err, results) => {
      if (err) {
        console.error('Error executing query: ' + err.stack);
        res.status(500).json({ error: 'An internal server error occurred' });
        return;
      }
  
      if (results.length === 0) {
        // User not found or invalid credentials
        res.status(401).json({ error: 'Invalid username or password' });
      } else {
        // User logged in successfully
        res.status(200).json({ message: 'Login successful' });
      }
    });
  });

  // Define registration route
app.post('/customerregister', (req, res) => {
    const { user, password, email } = req.body;
  
    // Check if the user already exists in the database
    const checkUserQuery = 'SELECT * FROM customer WHERE user = ?';
    db.query(checkUserQuery, [user], (err, results) => {
      if (err) {
        console.error('Error executing query: ' + err.stack);
        res.status(500).json({ error: 'An internal server error occurred' });
        return;
      }
  
      if (results.length > 0) {
        // User already exists
        res.status(409).json({ error: 'User already exists' });
      } else {
        // Insert the new user into the database
        const insertUserQuery = 'INSERT INTO customer (user, password, email) VALUES (?, ?, ?)';
        db.query(insertUserQuery, [user, password, email], (err, results) => {
          if (err) {
            console.error('Error executing query: ' + err.stack);
            res.status(500).json({ error: 'An internal server error occurred' });
            return;
          }
  
          res.status(201).json({ message: 'User registered successfully' });
        });
      }
    });
  });



app.listen(8081, ()=>{

    console.log("Iam listing RT");
})
