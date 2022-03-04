require("dotenv").config();
const express = require("express");
const mongoose= require('mongoose');


//database
const Database =require("./database");

mongoose.connect(
    process.env.MONGO_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
).then(() => console.log("MongoDB connected")) .catch((err) => console.log(err));


//initialization
const OurAPP= express();

OurAPP.use(express.json());

OurAPP.get("/",(request, response) => {
 response.json({ message:"Server is working!!" });   
});



// Route     -/book
//Des        -To get all books
// Access    -Public
// Method    -GET
// Params    -none
// Body      -none

OurAPP.get("/book", (req,res) => { 
    return res.json({books: Database.Book});
});

// Route     -/book/:bookID
//Des        -To get a book based on ISBN
// Access    -Public
// Method    -GET
// Params    -bookID
// Body      -none


OurAPP.get("/book/:bookID", (req, res) => {
    const getBook = Database.book.filter(
        (book) => book.ISBN === req.params.bookID
    );

    return res.json({book: getBook });
    });

// Route     -/book/c/:category
// Des       -To get a list of books based on category
// Access    -Public
// Method    -GET
// Params    -bookID
// Body      -none

OurAPP.get("/book/c/:category", (req, res) => {
    const getBook = Database.book.filter(
        (book) => book.category.includes(req.params.category)
    );

    return res.json({book: getBook });
});


// Route     -/author/c/:category
// Des       -To get all authors
// Access    -Public
// Method    -GET
// Params    -bookID
// Body      -none

OurAPP.get("/book", (req,res) => { 
    return res.json({author: Database.Author });
});


//Route         /book/new
//Description   add new book
//Access        PUBLIC
//Parameters    NONE
//Method        POST
OurAPP.post("/book/new", (req,res) =>{
   const {newBook}=req.body;

   //add new data
   Database.Book.push(newBook);

   return res.json(Database.Book)
});

//Route      /author/new
//Description add new author
//Access PUBLIC
//Parameters NONE
//METHOD POST
OurAPP.post("/author/new", (req,res) => {
    const { newAuthor }=req.body;

    Database.Author.push(newAuthor);

    return res.json(Database.Author);
});

OurAPP.post("/publication/new", (req,res) => {
    const {newPublication}=req.body;

    Database.Publication.push(newPublication);

    return res.json(Database.Publication);
});


//Route           /book/updateTitle
//Description     update any details of the book
//Access          PUBLIC
//Parameters      isbn
//Method          PUT
OurAPP.put("/book/updateTitle/:isbn", (req,res) =>{
     const {updatedBook} =req.body;
     const{isbn}=req.params;

     const book=Database.Book.forEach ((book)=>{
         if(book.ISBN === isbn) {
            book.title= updatedBook.title;
            book.language= updatedBook.language;
            return book; 
         }
         return book;    
    });
        return res.json(Database.Book);
});

// Route           /book/updateAuthor/:isbn
// Description     update/add new author to a book
// Access          Public
// Parameters      isbn
// Method          put

OurAPP.put("/book/updateAuthor/:isbn", (req,res) => {
    const {newAuthor} = req.body;
    const {isbn} = req.params;
    
    // updating book database object    
    const book =Database.Book.forEach((book) => {
        // check if ISBN match
        if(book.ISBN===isbn){
            // check if author already exist
            if(!book.authors.includes(newAuthor)){
                // if not,then push new author
                return book.authors.push(newAuthor);
            }

            // else return
            return book;
        }
        return book;
    });

    // updating author Database object
    Database.Author.forEach((author) => {
        // check if author id match
        if (author.id === newAuthor) { 
          // check if book already exist
          if (!author.books.includes(isbn)) {
              // if not,then push new book
              return author.books.push(isbn);
          }

          // else return if isbn equal but author id does not match  
          return author;
        }
        return author;
    });

    return res.json({ book: Database.Book, author: Database.Author });
});


// Route          /author/update
// Description    Update any details
// Access         Public
// Parameters     id
// Method         Put
// Params in the req.body are always in string format


OurAPP.put("/author/update/:id", (req,res) => {
    const {updateAuthor} = req.body;
    const {id}= req.params;

    Database.Author.forEach((author) => {
        if(author.id === parseInt(id)){
           author.name=updateAuthor;    
           return author;   
        }
        return author;
    }); 

    return res.json(Database.Author);
});

/*
Route              /book/delete/:isbn
Description        delete a book
Access             PUBLIC
Parameters         isbn
Method             DELETE
*/
OurAPP.delete("/book/delete/:isbn", (req,res) => {
    const { isbn } = req.params;

    const filteredBooks = Database.Book.filter((book)=> book.ISBN !== isbn)

    Database.Book = filteredBooks;

    return res.json(Database.Book);
});

/*
Route                 /book/deleter/author
Description           delete an author from a book
Access                PUBLIC
Parameters            id, isbn
Method                DELETE
*/
OurAPP.delete("/book/delete.author/:isbn/:id", (req,res) => {
    const {isbn, id} = req.params;

    //updating book database object
    Database.Book.forEach((book) => {
        if(book.ISBN === isbn){
            if(!book.author.includes(parseInt(id))){
                return book;
            }
            book.authors = book.authors.filter((databaseId) => databaseId !== parseInt(id));

            return book;
        }
        return book;
    });
    
    Database.Author.forEach((author) => {
        if(author.id === parseInt(id)){
            if(!author.books.includes(isbn)){
                return author;
            }
            
            author.books= author.books.filter((book) => book !== isbn);

            return author;
        }
        return author;
    });
    return res.json({book : Database.Book, author :  Database.Author});
});

 
/*
Route               /author/delete
Description         delete an author
Access              PUBLIC
Parameters          id
Method              DELETE
*/ 

OurAPP.delete("/author/delete/:id", (req,res) => {
    const {id} = req.params;

    const filteredAuthors = Database.Author.filter(() => author.id !== parseInt(id));

    Database.Author = filteredAuthors;

    return res.json(Database.Author);
});


/*
Route                 /publication/delete
Description           delete a publication
Access                PUBLIC
Parameters            id
Method                DELETE
*/

OurAPP.delete("/publication/delete/:id", (req,res) =>{
    const {id} = req.params;

    const filteredPub = Database.Publication.filter(
        (pub) => pub.id !== parseInt(id)
    );

    Database.Publication = filteredPub;

    return res.json(Database.Publication);
});


/*
Route                 /publication/delete/book
Description           delete a book from publication
Access                PUBLIC
Parameters            id, isbn
Method                DELETE
*/  
OurAPP.delete("/publication/delete/book/:isbn/:id", (req,res) => {
    const { isbn, id } = req.params;

    Database.Book.forEach((book) => {
        if(book.ISBN === isbn){
           book.publication = 0;
           return book;
        }
        return book;
    });

    Database.Publication.forEach((publication) => {
        if(publication.id === parseInt(id)){
            const filteredBooks = publication.books.filter(
                (book) => book !== isbn
            );
            publication.books = filteredBooks;
            return publication;
        }
        return publication;
    });
    return res.json({book: Database.Book, publication: Database.Publication});
});


OurAPP.listen(4000, () => console.log("Server is running"));