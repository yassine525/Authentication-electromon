let express = require('express')
let app = express();  
const bcrypt = require ('bcryptjs')
var bodyParser = require('body-parser')
var jwt = require('jsonwebtoken')
const msg = require ('./auth')
const mongoose = require ('mongoose')
const users = require('./usersdb')

require("dotenv").config()
let password = process.env.PASSWORD
mongoose.connect(`mongodb+srv://yassine:${password}@cluster0-gzn8r.mongodb.net/test?retryWrites=true&w=majority`,{useNewUrlParser: true,  useUnifiedTopology: true});
const db =mongoose.connection
db.on('error', error => console.log(error))
db.once('open', ()=> console.log("connected to mongoose"))

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use(express.json())

const EMAIL_SECRET = 'asdf1093KMnzxcvnkljvasdu09123nlasdasdf'




app.post('/users/main', (req, res)=>{
    res.redirect('/index')
})



/*app.get('/users', (req, res)=>{ 
    db.users.find().find(function(err, result){
        res.send('result')
    })
})*/

app.post('/users/signin', async (req, res)=>{
     
    users.findOne( { "email" : req.body.email} ).then (user =>{
        if (user){
        return res.redirect('/exist')
            }else{
                var user = new users ({
                    name: req.body.name,
                    password: req.body.password,
                    email: req.body.email,
                    confirmed: false
                })
                
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, function (err, hash) {
                   if (err) throw err
                    user.password = hash
                    user.save()
            }) 
        }) 

        try {
                //const newUser = await user.save()
                res.redirect('/sucess')
                try {
                    msg(user, EMAIL_SECRET);
                } catch (error) {
                    return res.send(error)
                }
                
               } catch  (err){
                res.status(400).json({ message: err.message })
               }
            }

    }) 
})

//Login user
app.post('/users/login', async (req,res)=>{

    const user = await users.findOne( { name : req.body.name} )
    if (!user){
        return res.redirect('/return')
    }
    if (!user.confirmed) {
        return res.redirect('/confirmMail');
      }
    bcrypt.compare(req.body.password, user.password, function(err, result){
           if (result){
                res.redirect('/welcome')
           } else {
                return res.redirect('/return')
           }
     })  
    })
//mail confirmation and change the confirmed    
app.get('/confirmation/:token', async (req, res) => {
    
    try {
        const { user: { id } } = jwt.verify(req.params.token, EMAIL_SECRET);
         //users.update({ confirmed: true }, { where: { id } });
          await users.update({ _id: id },
                {
                $set: {
                    confirmed: true
                }
                }
      );
        res.redirect('/confirmed')
    } catch (e) {
        res.send(e);
    }

   //return res.redirect('/confirmed');
}); 

app.get('/users/fetch', async (req, res) => {
    try {
      const user = await users.find()
      res.json(user)
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  }) 
 
//creating paths to html pages
app.get('/exist', function(req, res) {
    res.sendFile(__dirname + "/HTMLpages/exist.html");
    });  
app.get('/welcome', function(req, res) {
     res.sendFile(__dirname + "/HTMLpages/welcome.html");
     });   
app.get('/return', function(req, res) {
    res.sendFile(__dirname + "/HTMLpages/return.html");
    }); 
app.get('/index', function(req, res) {
    res.sendFile(__dirname + "/HTMLpages/index.html");
    });        
app.get('/sucess', function(req, res) {
    res.sendFile(__dirname + "/HTMLpages/success.html");
    });   
app.get('/signin', function(req, res) {
     res.sendFile(__dirname + "/HTMLpages/sigup.html");
     });   
app.get('/confirmMail', function(req, res) {
     res.sendFile(__dirname + "/HTMLpages/confirmMail.html");
     });
app.get('/confirmed', function(req, res) {
     res.sendFile(__dirname + "/HTMLpages/Mailconfirmed.html");
     });    
    
app.listen(8000, () => console.log('Server Started'))

module.exports = app; 