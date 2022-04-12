import { Grid, Modal, Paper, TextField, Typography, TextareaAutosize, IconButton } from "@mui/material";
import React, { useState } from "react";
import StyledButton from "../Compnenets/StyledButton";
import {makeStyles} from "@mui/styles"
import axios from '../axios/axios'
import EditIcon from '@mui/icons-material/Edit';


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
}))

const UpdateNote = (props) => {
    const classes = useStyles();


    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState(props.title);
    const [note, setNote] = useState(props.content)
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

    const handleUpdate = async () => {
        const userEmail = props.user;
        const noteId = props.id;

        console.log(noteId);

        if(title === "") {
            setErr("Note Title cannot be empty!")
            return null;
        }

        const updatedNote = {
            id: noteId,
            email: userEmail,
            noteTitle: title,
            noteContent: note,
        }

        await axios.post('/updateNote', updatedNote)
        .then((res) => {
            if (res.status === 200) {
                setMessage(res.data.message);
                console.log(res)
                handleClose();
            }
            else console.log("Error")
        })

    }

    const body = (
        <Paper className={classes.paper}>
            <Grid container direction="column" alignItems="center" justifyContent="space-between" spacing={2} className={classes.gridContainer} >
                <Grid item>
                    <Typography variant="h4">Update Note</Typography>
                </Grid>
                <Grid item>
                    <TextField 
                    variant="outlined" 
                    label="Note Title" 
                    defaultValue = {props.title}
                    onChange={(event) => setTitle(event.target.value)}
                    style = {{width: "30vw"}} />
                </Grid>
                <Grid item>
                    <TextareaAutosize
                        minRows={3}
                        placeholder="Add note here"
                        defaultValue={props.content}
                        onChange={(event) => setNote(event.target.value)}
                        style={{ width: "30vw" }}
                    />
                </Grid>
                <Grid item>
                    <Typography variant="body2" style={{color: "red"}}>{err}</Typography>
                </Grid>
                <Grid item>
                    <StyledButton onClick={handleUpdate}>
                        Update Note
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

    return (
        <div>
            <IconButton 
            onClick={handleOpen}
            sx={{marginTop:'3%'}}
            >
                <EditIcon fontSize="small"/> 
            </IconButton>

            <Modal open={open} onClose={handleClose} className={classes.modal} >
                {body}
            </Modal>
        </div>
        
    )
}

export default UpdateNote;