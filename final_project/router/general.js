const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  let user = req.body.username;
  let pass = req.body.password;

  if (user && pass) {
    if (!isValid(user)) { 
      users.push({"username":user,"password":pass});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.send(books);
  getBooks();
});

async function getBooks() {
  const resp = await axios.get('http://localhost:5000/');
  const books = resp.data;
  return books;
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  if (isbn) {
    res.send(books[isbn]);
  }
  res.send("Invalid ISBN.")
 });

async function getBookByISBN(isbn) {
  const resp = await axios.get(`http://localhost:5000/isbn/${isbn}`);
  const book = resp.data;
  return book;
}
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  let filtered = []
  for (const [k,v] of Object.entries(books)) {
    if (v.author === author) {
      filtered.push(v);
    }
  }
  if (filtered.length > 0) {
    res.send(filtered);
  } else {
    res.send("No books found by that author.")
  }
});

async function getBookByAuthor(author) {
  const resp = await axios.get(`http://localhost:5000/author/${author}`);
  const book = resp.data;
  return book;
}

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title;
  let filtered = []
  for (const [k,v] of Object.entries(books)) {
    if (v.title === title) {
      filtered.push(v);
    }
  }
  if (filtered.length > 0) {
    res.send(filtered);
  } else {
    res.send("No books found by that title.")
  }
});

async function getBooksByTitle(title) {
  const resp = await axios.get(`http://localhost:5000/title/${title}`);
  const book = resp.data;
  return book;
}

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  if (isbn) {
    res.send(books[isbn].reviews)
  }
  res.send("Invalid ISBN.")
});

module.exports.general = public_users;
