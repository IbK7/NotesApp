import { Button, Grid, IconButton, TextField, Typography } from "@mui/material";
import {makeStyles} from "@mui/styles"
import React, { useState, useEffect } from "react";
import EventNoteIcon from '@mui/icons-material/EventNote';
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import axios from '../axios/axios';
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    header:{
        backgroundColor: "#FFA700",
        padding: "5px",
        width: "100vw"
    },
    form:{
        padding: theme.spacing(2),
        border: "5px solid #FFA700"
    },
    footer:{
        width: "100vw",
        backgroundColor: "#101820",
        padding: "5px"
    },
    errorText:{
        color: "red"
    }
}))

const Register = () => {
    const classes = useStyles();
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState("")
    const [lastName, setlastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [errorText, setErrorText] = useState("")

    useEffect(() => {
        axios.get('/getUser', {
            headers: {
                "x-access-token": localStorage.getItem("token")
            }
        }).then(res => {
            if (res.data.isLoggedIn) navigate('/home')
        })
    }, [navigate])

    const RegisterButton = styled(Button)(({ theme }) => ({
        color: theme.palette.getContrastText("#101820"),
        backgroundColor: '#101820',
        '&:hover': {
          backgroundColor: "#1018FF",
        },
        padding: theme.spacing(1)
    }));

    const handleRegister = async () =>{
        if (email === "" || password === "" || firstName === "" || lastName === ""){
            setErrorText("All fields are required!")
            return
        }
        await axios.post('/register', {
            firstName: `${firstName}`,
            lastName: `${lastName}`,
            email: `${email}`,
            password: `${password}`
        }).then((res) => {
            if (res.status !== 201){
                setErrorText(res.data.message);
            }
            else {
                localStorage.setItem('token', res.data.token)
                navigate('/home');
            }
        })
    }

    return(
        <Grid container direction="column" alignItems="center" justifyContent="space-between" style = {{height:"100vh"}}>
            <Grid item className={classes.header}>
                <Grid container direction="row" alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <IconButton>
                            <EventNoteIcon fontSize="large" sx={{color: "#101820"}} />
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <RegisterButton variant="contained">Login</RegisterButton>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item>
                <Grid container direction="column" alignItems="center" justifyContent="center" spacing={2} className={classes.form}>
                    <Grid item>
                        <Typography variant = "h5">Welcome to Note Keeper! Let's get you registered with our application</Typography>
                    </Grid>
                    <Grid item>
                        <TextField variant="outlined" label="First Name"  
                        onChange={(event) => setFirstName(event.target.value)}
                        />
                    </Grid>
                    <Grid item>
                        <TextField variant="outlined" label="Last Name"  
                        onChange={(event) => setlastName(event.target.value)}
                        />
                    </Grid>
                    <Grid item>
                        <TextField variant="outlined" type="email" label="Email"  
                        onChange={(event) => setEmail(event.target.value)}
                        />
                    </Grid>
                    <Grid item>
                        <TextField variant="outlined" type="password" label="Password" 
                        onChange={(event) => setPassword(event.target.value)}
                        />
                    </Grid>
                    <Grid item>
                        <Typography variant="body2" className={classes.errorText}>{errorText}</Typography>
                    </Grid>
                    <Grid item>
                        <RegisterButton onClick={handleRegister} >Register</RegisterButton>
                    </Grid>
                    <Grid item>
                        <Typography variant="body2">Don't have an account yet? <Link to='/login'>Login here</Link></Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item className={classes.footer}>
                <Grid container direction="row" alignItems="center" justifyContent="space-between">
                    <Grid item>    
                        <Typography variant="body1" style={{color: 'white'}}>Note Keeper</Typography>
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

export default Register;