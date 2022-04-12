const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors')
require('dotenv').config()

const app = express();
app.use(cors());

const urlencodedParser = bodyParser.urlencoded({extended: false});
app.use(bodyParser.json(), urlencodedParser);
// app.use(express.json())

const dbURI = `mongodb+srv://admin:${process.env.MONGO_PWD}@cluster0.zh9bk.mongodb.net/NotesApp?retryWrites=true&w=majority`;
const port = process.env.PORT || 8001;

mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then((res) => {
   console.log("mongoDB connected");
}).catch(err => console.log(err));


const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("./models/user");


app.get('/', (req, res) => {
    res.send("Server Running");
})

// app.use('/auth', require('./routes/auth'))

app.post('/register', (req, res) => {
    const user = req.body;
 
    User.findOne({email: user.email}, async function(err, newUser){
        if (err) console.log(err)
        else{
            if (newUser != null) res.json({message: "Email already registered. Please login"})
            else{
                user.password = await bcrypt.hash(req.body.password, 10);
                const userToAdd = new User({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email.toLowerCase(),
                    password: user.password,
                });

                User.create(userToAdd, (err, registeredUser) => {
                    if (err){
                        res.status(500).send(error);
                    }
                    else{
                        const payload = {
                            id: registeredUser._id,
                            email: registeredUser.email,
                            firstName: registeredUser.firstName,
                            lastName: registeredUser.lastName
                        }

                        jwt.sign(
                            payload,
                            process.env.JWT_SECRET,
                            {expiresIn: 86400},
                            (err, token) => {
                                if (err) console.log(err)
                                else res.status(201).json({message: "Registered User", token: token})
                            }
                        )
                    }
                });
            }
        }
    });

})

app.post('/login', (req, res) => {
    const user = req.body;


    User.findOne({email: user.email}, function(err, incomingUser){
        if (err) console.log(err);
        else{
            if (incomingUser == null) res.json({message: "Email or Password is incorrect"})
            else{
                bcrypt.compare(user.password, incomingUser.password, function(err, isValid){
                    if(err) console.log(err)
                    else{
                        if (!isValid) res.json({message:"Email or Password is incorrect"})
                        else{
                            const payload = {
                                id: incomingUser._id,
                                email: incomingUser.email,
                                firstName: incomingUser.firstName,
                                lastName: incomingUser.lastName
                            }

                            jwt.sign(
                                payload,
                                process.env.JWT_SECRET,
                                {expiresIn: 86400},
                                (err, token) => {
                                    if (err) console.log(err)
                                    else res.status(201).json({message: "Logged In", token: token})
                                }
                            )
                        }
                    }
                })
            }
        }
    })
})

const verifyJWT = (req, res, next) => {
    const token = req.headers["x-access-token"]
    
    if (token){
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err)  res.json({isLoggedIn: false, message: "Authentication failed"})
            else{
                req.user = {}
                req.user.id = decoded.id
                req.user.email = decoded.email
                req.user.firstName = decoded.firstName
                req.user.lastName = decoded.lastName
                next();
            }
        })
    }else{
        res.json({isLoggedIn: false, message: "Token invalid"})
    }
}

app.get('/getUser', verifyJWT, (req, res) => {
    res.json({isLoggedIn: true, user: req.user});
})

const Note = require('./models/notes')

app.get('/getUserNotes', (req, res) => {
    Note.find({email: req.query.email}, (err, docs) => {
        // console.log(docs);
        if (err) console.log(err);
        else res.status(200).json({
            message: "Notes retrieved",
            notes: docs,
        })
    })
})

app.post('/addNote', (req, res) => {
    const note = req.body;

    Note.create(note, (err, addedNote) => {
        if (err) console.log(err)
        else res.status(201).json({message: "Note Added Successfully."})
    })
})

app.post('/deleteNote', (req, res) => {
    const note = req.body;

    Note.findByIdAndDelete(note.id, (err, docs) => {
        if (err) console.log(err)
        else res.status(202).json("Note Deleted")
    })
})

app.post('/updateNote', (req, res) => {
    const updatedNote = req.body;

    const updateVal = {
        noteTitle: req.body.noteTitle,
        noteContent: req.body.noteContent
    }    

    Note.findByIdAndUpdate(updatedNote.id, updateVal, (err, doc) => {
        if (err) console.log(err)
        else res.status(200).json({message: "Note Updated", doc: doc})
    })
})

app.listen(port, () => console.log(`listening on localhost: ${port}`));

// 3wqOJyiqAsGURVny