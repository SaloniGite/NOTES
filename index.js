const express = require("express")
const app = express()
const fs = require("fs")
app.set("view engine","ejs")
// app.get("/" , function(req, res){
//     fs.readdir("./uploads",{withFileTypes:true},function(err,files){
//         if(err) throw err
//         res.render("home",{files:files},)
        
//     })
    
  
    
// })
app.get("/",function(req,res){
fs.readdir("./uploads",{withFileTypes:true },(err,files)=>{
    if (err){
        console.log("err")

    }

    const notes =[]
    for(const file of files){
        
      if(file.isDirectory()){
        notes.push({
            title:file.name,
            content:null,
            type:"folder"
          })
      }
      else{
        const note = fs.readFileSync(`uploads/${file.name}`,"utf8")
        notes.push(
            {
                title:file.name,
                content:note,
                type :"file"
            }
        )
      }
 
    }
    res.render("home",{notes})
})
})

app.get("/create",function(req,res){
    res.render("create")
})

app.get("/createdata",function(req,res){
 
  
    fs.writeFile(`./uploads/${ req.query.title}`,req.query.content,function(err){
        if (err) throw err 
        res.redirect("/")
      
    })
  
    
 
})

app.get("/viewnote/:title",(req,res)=>{

    fs.readFile(`./uploads/${req.params.title}`,"utf-8" , function(err,data){
        if (err) throw err 
        res.send(`${data}`)
    })
    
})
app.listen(3000)

app.get("/delete/:title",function(req,res){
    fs.unlink(`./uploads/${req.params.title}`,function(err){
        if (err) throw err
        res.redirect("/")
    })
})

app.get("/edit/:title",function(req,res){
    fs.readFile(`./uploads/${req.params.title}`,"utf-8",function(err,data){
        if (err) throw err
        res.render("edit",{
            title:req.params.title,
            content:data
        })
    })
})

app.get("/editsval/:oldtitle",function(req,res){
    oldtitle = req.params.oldtitle
    title = req.query.title
    content = req.query.content

    fs.rename(`./uploads/${oldtitle}`,`./uploads/${title}`,function(err){
        if (err) throw err 
        fs.writeFile(`./uploads/${title}`,content,(err)=>{
            if (err) throw err 
            res.redirect("/")
        })
    })
})