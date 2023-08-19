const express = require('express');
const axios = require("axios");
let fs = require("fs");
const { resolve } = require('path');
const { rejects } = require('assert');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
let books = require("./booksdb.js").books;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;
  console.log(users);
  if(username && password){
      if(!isValid(username)){
          users.push({"username": username, "password" : password})
          res.status(200).json({message : "User Successfully registered!! You can login!"});
      }
      else{
          res.status(404).json({message : "User already exists!!!"});
      }
  }
  else{
      res.status(404).json({message : "User already exists!!!"});
  }
});


public_users.get('/', async function (req, res) {
  let data;
  fs.readFile('router/booksdb.json', 'utf8', (error, jsonData) => {
    if (error) {
      console.error('An error occurred:', error);
      return;
    }

    data = JSON.parse(jsonData);
    res.status(200).send(data);
  });

});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let id = req.params.isbn;
  console.log(id);
  let data = new Promise((resolve, reject)=>{
    if(books[id]){
      resolve(books[id]);
    }
    else{
      reject(new Error('Oops!.. No book have.'))
    }
  })

  data.then(data =>{
    return res.status(300).json(data);
  })
  .catch(err =>{
    console.log("No have isbn number book.")
  })
  
 });

 async function filterBook(author){
  let booksId = Object.keys(books);
  let authorBook = {};
  for(let id in booksId){
      if(books[booksId[id]].author === author){
        authorBook[booksId[id]] = books[booksId[id]];
    }
  }

  console.log(typeof authorBook);
  return authorBook;
 }
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author;

  filterBook(author)
  .then((data)=>{
    if(Object.keys(data).length > 0){
      console.log(data);
    return res.status(300).json(data);
    }
    else{
      throw err;
    }
    
  })
  .catch(err =>{
    console.log("No have isbn number book.")
    return res.status(500).json({message : "No have isbn number book."});
  })

 
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let booksId = Object.keys(books);
  let titleBook = {};
  for(let id in booksId){
    if(books[booksId[id]].title === req.params.title){
      titleBook[booksId[id]] = books[booksId[id]];
    }
  }

  if(Object.keys(titleBook).length > 0){
    return res.status(300).json(titleBook);
  }
  else{
    return res.status(300).json({message: "Not fond!!!"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let booksId = Object.keys(books);
  let rating = {};
  for(let id in booksId){
    if(booksId[id] === req.params.isbn){
      rating[booksId[id]] = books[booksId[id]].reviews;
    }
  }

  if(Object.keys(rating).length > 0){
    return res.status(300).json(rating);
  }
  else{
    return res.status(300).json({message: "Not fond!!!"});
  }
});

module.exports.general = public_users;
