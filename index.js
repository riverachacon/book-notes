import express from "express";
import bodyParser from "body-parser";
import pg from "pg"
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "booknotes",
  password: "holi987",
  port: 5432,
});
db.connect();

let books = [
  // {id: 1, title: 'title', cover: 'http://covers.openlibrary.org/b/id/8463846-M.jpg', author: 'author',review:"one of my favorite bios", date: '2024-10-14', rate: '5'},
  // {id: 2, title: 'title1', cover: 'http://covers.openlibrary.org/b/id/9078085-M.jpg', author: 'author1',review:"starting habits", date: '2023-07-04', rate: 4},
  // {id: 2, title: 'title2', cover: 'http://covers.openlibrary.org/b/id/13290711-M.jpg', author: 'author2',review:"great thinking", date: '2023-09-04', rate: '3'}
]

async function totalBooks(){
  const data = await db.query("SELECT * FROM books")
  let response = data.rows


  return response
}


app.get("/", async (req, res) => {
  try {
    let response = await axios.get("https://api.thecatapi.com/v1/images/search")
    let result = response.data
    let catPic = result[0].url
    const data = await totalBooks()
    let books = data
    


    // console.log("/ BOOKSDB: ", data)
    res.render("index.ejs", {catPic: catPic, books: books})
  } catch (err) {
    console.error("Failed to make request:", err.message);
    res.render("index.ejs", {error: err.message});
  }
})

app.post("/add-book", async (req, res) => {
  let newBook = req.body.newBook
  let date = req.body.date
  let review = req.body.review
  let rate = req.body.rate
  try {
    let response = await axios.get(`https://openlibrary.org/search.json?title=${newBook}`)
    let result = response.data
    let title = result.docs[0].title
    let coverId = result.docs[0].cover_i
    let author = result.docs[0].author_name[0]
    let coverimgDb = `http://covers.openlibrary.org/b/id/${coverId}-M.jpg`


    let coverImg = await axios.get(`http://covers.openlibrary.org/b/id/${coverId}-M.jpg`)
    coverImg = coverImg.data
    
    try {
      db.query(
        "INSERT INTO books (title, cover, author, review, date, rate) VALUES ($1, $2, $3, $4, $5, $6)", 
        [title, coverimgDb, author, review, date, rate]
      )


      console.log(coverId)
      res.redirect("/")
    } catch (err) {
      console.log("add new book to DataBase ERROR: ", err)
      
    }

    
    
  } catch (err) {
    console.log("add new book ERROR: ", err)
    
  }
})

app.post("/delete/:id", async (req, res) => {
  var id = parseInt(req.params.id)

  try {
    await db.query("DELETE FROM books WHERE id = $1", [id])
    

  } catch (err) {
    console.log("Delete data Error: ", err)
    
  }
  // console.log("/ DELETE ID: ", id)
  res.redirect("/")
})

// render to edit.ejs for updating db
app.post("/edit/:id", async (req, res) => {
  let id = parseInt(req.params.id)

  try {
    let dataArray = []
    let response = await db.query("SELECT id, review FROM books WHERE id = $1", [id])
    dataArray = response.rows


    console.log("/ DATA TO EDIT: ", dataArray)
    res.render("edit.ejs", {data: dataArray})
    
  } catch (err) {
    console.log("edit data Error: ", err)
    
  }
})

app.post("/update/:id", async (req, res)=> {
  let id = parseInt(req.params.id)
  let newReview = req.body.reviewUpdate

  try {
    db.query("UPDATE books SET review = $1 WHERE id = $2", [newReview, id])
    console.log("/UPDATE ID TO UPDATE: ", id)
    console.log("/UPDATE new review: ", newReview)
    res.redirect("/")
    
  } catch (err) {
    console.log("update data Error: ", err)
    
  }
})

app.post("/newest", async (req, res)=> {
  let books = []
  let data = await db.query("SELECT * FROM books ORDER BY date DESC ")
  books = data.rows

  console.log("Newest: ", books)
  res.render("index.ejs", {books: books})
})

app.post("/best", async (req, res)=> {
  let books = []
  let data = await db.query("SELECT * FROM books ORDER BY rate DESC ")
  books = data.rows

  console.log("best: ", books)
  res.render("index.ejs", {books: books})
})



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  
  