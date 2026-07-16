const express = require ("express")
const app = express()
const PORT = 3000
const path = require("path")
const fs = require("fs")


app.set("view engine" , "ejs")
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,"public")))



app.get("/", (req, res)=>{
    fs.readdir(`./files`, (err,files)=>{
        res.render("index", {varfiles: files}) 
    })
    
})

app.get("/file/:filename", (req, res)=>{
    fs.readFile(`./files/${req.params.filename}`, "utf-8", (err, filedata)=>{
        res.render("show", {filename: req.params.filename, filedata:filedata})
    })   
})

app.get("/edit/:filename", (req, res)=>{
        res.render("edit" , {filename: req.params.filename})
    })  

app.post("/edit", (req, res)=>{
        fs.rename(`./files/${req.body.previous}`, `./files/${req.body.new}`,(err)=>{
            res.redirect("/")
        })
    })  

app.post("/create", (req, res)=>{
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.details, (err)=>{
        res.redirect("/")
    })
    
})


app.get("/delete/:filename", (req, res)=>{
        res.render("delete" , {filename: req.params.filename})
    })  

app.post("/delete/:filename", (req, res) => {
    fs.unlink(`./files/${req.params.filename}`, (err) => {
        if (err) {
            return res.status(500).send("Couldn't delete file");
        }

        res.redirect("/");
    });
});




app.listen(PORT,()=>{
    console.log(`server is running`)
})