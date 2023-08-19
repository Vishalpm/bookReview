const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  {"username": "Vishal", "password":"vishal@123"}
];

const isValid = (username)=>{ 
  const userWithUsername = users.filter((user)=>{return user.username === username})
  if(userWithUsername.length > 0){
      return true;
  }
  else{
      return false;
  }
}

const authenticatedUser = (username,password)=>{ 
  const registeredUser = users.filter((user)=> user.username === username && user.password === password);
  if(registeredUser.length > 0){
      return true;
  }
  else{
      return false;
  }
}

// regd_users.get("/", (req, res)=>{
//   return res.status(300).json({message:"Hello customer!!!"});
// })

//only registered users can login
regd_users.post("/login", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;

  console.log(username);
  console.log(password);

  if(!username || !password){
      res.status(404).json({message : "Error logging in."})
  }

  if(authenticatedUser(username, password)){
     let accessToken = jwt.sign({
      data: password
     }, "access", {expiresIn : 60*60});

     req.session.authorization = {
      accessToken, username
     };

     return res.status(200).send("User successfully logged in");
  }
  else{
      return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization['username'];
  const reviewData = req.body.review;

  if(books[isbn].reviews[username]){
    books[isbn].reviews[username] = reviewData;
    return res.status(200).json({message: "Review updated successfully!"})
  }
  
  books[isbn].reviews[username] = reviewData;

  return res.status(200).json({message: "Thak you for Rating Us!"})
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization['username'];
  
  if(books[isbn].reviews[username]){
    delete books[isbn].reviews[username];
    return res.status(200).json({message: "Review succesfully deleted."})
  }
  else{
    return res.status(200).json({message: "You still have not reviewd this book."})
  }

})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
