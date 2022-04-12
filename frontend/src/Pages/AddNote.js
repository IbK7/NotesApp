import { Grid, Modal, Paper, TextField, Typography, TextareaAutosize } from "@mui/material";
import React, { useState } from "react";
import StyledButton from "../Compnenets/StyledButton";
import {makeStyles} from "@mui/styles"
import axios from '../axios/axios'

const useStyles = makeStyles((theme) => ({
    modal: {
        "&:focus": {
          borderColor: "white",
        },
    },
    paper: {
        position: "absolute",
        width: "40%",
        // height: "50%",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        outline: "none",
        borderRadius: "20px",
        padding: theme.spacing(4),
        border: "3px solid #FFA700"
    },
    gridContainer:{
        width: "100%"
    }
}))

const AddNote = (props) => {
    const classes = useStyles();

    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [note, setNote] = useState("")
    const [message, setMessage] = useState("");
    const [err, setErr] = useState("");


    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setMessage("")
        setErr("")
        setOpen(false);
    }

    const handleAddNote = async () => {
        const userEmail = props.user;

        if(title === "") {
            setErr("Note Title cannot be empty!")
            return null;
        }

        const newNote = {
            email: userEmail,
            noteTitle: title,
            noteContent: note,
        }
       await axios.post('/addNote', newNote)
       .then((res) => {
           if (res.status === 201) {
               setMessage(res.data.message);
               handleClose();
           }
           else console.log("Error")
       })
    }

    const body = (
        <Paper className={classes.paper}>
            <Grid container direction="column" alignItems="center" justifyContent="space-between" spacing={2} className={classes.gridContainer} >
                <Grid item>
                    <Typography variant="h4">Add New Note</Typography>
                </Grid>
                <Grid item>
                    <TextField 
                    variant="outlined" 
                    label="Note Title" 
                    onChange={(event) => setTitle(event.target.value)}
                    style = {{width: "30vw"}} />
                </Grid>
                <Grid item>
                    <TextareaAutosize
                        minRows={3}
                        placeholder="Add note here"
                        onChange={(event) => setNote(event.target.value)}
                        style={{ width: "30vw" }}
                    />
                </Grid>
                <Grid item>
                    <Typography variant="body2" style={{color: "red"}}>{err}</Typography>
                </Grid>
                <Grid item>
                    <StyledButton onClick={handleAddNote}>
                        Add Note
                    </StyledButton>
                </Grid>
                <Grid item>
                    <Typography variant = "body1" sc ={{color: "green"}}>
                        {message}
                    </Typography>
                </Grid>
            </Grid>
        </Paper>
    );

    return(
        <div>
            <StyledButton
            variant="contained"
            onClick={handleOpen}
            >
                Add New Note
            </StyledButton>

            <Modal open={open} onClose={handleClose} className={classes.modal} >
                {body}
            </Modal>
        </div>
    )
}

export default AddNote;