import React, { useEffect, useState } from "react";
import {Grid, IconButton, Typography, TextField, Card, CardContent} from "@mui/material"
import {makeStyles} from "@mui/styles"
import axios from '../axios/axios'
import { useNavigate } from "react-router-dom";
import EventNoteIcon from '@mui/icons-material/EventNote';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import SearchIcon from '@mui/icons-material/Search';
import StyledButton from "../Compnenets/StyledButton";
import DeleteIcon from '@mui/icons-material/Delete';
import AddNote from "./AddNote";
import UpdateNote from "./UpdateNote";

const useStyles = makeStyles((theme) => ({
    header:{
        backgroundColor: "#FFA700",
        padding: "5px",
        // width: "100vw"
    },
    notes:{
        // width: "100vw",
        padding: theme.spacing(2)
    },
    footer:{
        // width: "100vw",
        backgroundColor: "#101820",
        padding: "5px"
    },
    TextField:{
        width: "40vw"
    }, 
    notesCard:{
        border: "2px solid black"
    }
}));

const Home = () => {
    const classes = useStyles();
    const navigate = useNavigate();
    const [email, setEmail] = useState("")
    const [notes, setNotes] = useState([])

    useEffect(()=>{
        function navigateLogin(){
            navigate('/')
        }

        axios.get('/getUser', {
            headers: {
                "x-access-token": localStorage.getItem("token")
            }
        }).then(res => {
            if(res.data.isLoggedIn === false) navigateLogin();
            else{
                setEmail(res.data.user.email)
                let userEmail = res.data.user.email

                axios.get('/getUserNotes', {
                    params:{
                        email: userEmail
                    }
                }).then((res1) => {
                    setNotes(res1.data.notes);
                })
            }
        })

        
    }, [notes, navigate])

    const handleLogout = () => {
        localStorage.removeItem("token")
        navigate('/')
    }

    return(
        <Grid container direction="column" alignItems="stretch" justifyContent="space-between" style = {{minHeight:"100vh"}}>
            <Grid item className={classes.header} flex = {0}>
                <Grid container direction="row" alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <IconButton>
                            <EventNoteIcon fontSize="large" sx={{color: "#101820"}} />
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <StyledButton variant="contained" onClick={handleLogout}>Logout</StyledButton>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item className={classes.notes} flex = {1}>
                <Grid container direction="column" alignItems="strecth" justifyContent="space-evenly" spacing={5}>
                    <Grid item>
                        <Grid container direction="row" alignItems="center" justifyContent="space-evenly" spacing={5}>
                            <Grid item>
                                <TextField 
                                variant="outlined" 
                                label="Search..." 
                                className={classes.TextField} InputProps={{endAdornment: <SearchIcon/>}}/> 
                            </Grid>
                            <Grid item>
                                <AddNote user = {email} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                       <Grid container direction="row" alignItems="center" justifyContent="center" spacing={1} style = {{flex: "wrap"}}>  
                            {
                                notes.map((note) => 
                                    <Grid item key={note._id}>
                                        <NotesCard
                                        id = {note._id}
                                        email = {note.email}
                                        title = {note.noteTitle}
                                        note = {note.noteContent}
                                        />
                                    </Grid>
                                )
                            }
                        </Grid>  
                    </Grid>
                </Grid>                   
            </Grid>
            <Grid item className={classes.footer} flex = {0}>
                <Grid container direction="row" alignItems="center" justifyContent="space-between">
                    <Grid item>    
                        <Typography variant="body1" style={{color:"white"}}>Note Keeper</Typography>
                    </Grid>
                    <Grid item> 
                        <Typography variant="body2" style={{color:"white"}}>Licencing Info</Typography>
                    </Grid>
                    <Grid item> 
                        <Grid container direction="row" spacing={1}>
                            <Grid item>    
                                <FacebookIcon fontSize="medium" sx={{color:"white"}} />
                            </Grid>
                            <Grid item>    
                                <TwitterIcon fontSize="medium" sx={{color:"white"}} />
                            </Grid>
                            <Grid item>    
                                <LinkedInIcon fontSize="medium" sx={{color:"white"}} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}




const NotesCard = (props) => {

    const deleteNote = () => {
        const id = props.id;

        axios.post('/deleteNote', {id: id})
        .then((res) => {
            
        })
    }

    return(
        <Card variant="outlined" sx = {{width:"30vw"}}> 
            <CardContent>
                <Typography variant="h6">{props.title}</Typography>
                <Typography variant="body1">{props.note}</Typography>
                <Grid container direction="row">
                    <Grid item>
                        <UpdateNote id={props.id} user={props.email} title={props.title} content={props.note} />
                    </Grid>
                    <Grid item>
                        <IconButton sx={{marginTop:'3%'}} onClick = {deleteNote} >
                            <DeleteIcon fontSize="small"/> 
                        </IconButton>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default Home;