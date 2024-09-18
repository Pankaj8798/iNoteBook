import { useState, useContext } from "react";
import NoteContext from "./NoteContext";
import AlertContext from '../../context/alert/AlertContext';
const NoteState = (props) => {
    const notesInitial = [];
    const [notes, setNotes] = useState(notesInitial)
    const context = useContext(AlertContext)
    const { showAlert } = context;

    // Get All Notes
    const getNotes = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/notes`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    [process.env.REACT_APP_AUTH_TOKEN_KEY]: localStorage.getItem(process.env.REACT_APP_AUTH_TOKEN_KEY)
                }
            });

            if (response.status === 200) {
                const json = await response.json();
                setNotes(json)                
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    // Add a Note
    const addNote = async (title, description, tag) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/notes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    [process.env.REACT_APP_AUTH_TOKEN_KEY]: localStorage.getItem(process.env.REACT_APP_AUTH_TOKEN_KEY)
                },
                body: JSON.stringify({ title, description, tag }), // body data type must match "Content-Type" header
            });

            if (response.status === 200) {
                const json = await response.json();
                setNotes(notes.concat(json))
                showAlert("Note Added successfully.", "success")           
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    // Delete a Note
    const deleteNote = async (id) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/notes/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    [process.env.REACT_APP_AUTH_TOKEN_KEY]: localStorage.getItem(process.env.REACT_APP_AUTH_TOKEN_KEY)
                }
            });
            
            if (response.status === 200) {
                let newNotes = notes.filter((note) => {
                    return note._id !== id
                })
                setNotes(newNotes)
                showAlert("Note Deleted successfully.", "success")
            }            
        } catch (error) {
            console.error(error.message);
        }
    }

    // Edit a Note
    const editNote = async (id, title, description, tag) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/notes/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    [process.env.REACT_APP_AUTH_TOKEN_KEY]: localStorage.getItem(process.env.REACT_APP_AUTH_TOKEN_KEY)
                },
                body: JSON.stringify({ title, description, tag }), // body data type must match "Content-Type" header
            });

            if (response.status === 200) {
                const resJson = await response.json();
        
                // Logic to edit in client
                let newNotes = JSON.parse(JSON.stringify(notes))
                for (let index = 0; index < newNotes.length; index++) {
                    const element = newNotes[index];
                    if (element._id === id) {
                        newNotes[index].title = resJson.title;
                        newNotes[index].description = resJson.description;
                        newNotes[index].tag = resJson.tag;
                        break;
                    }
                }
                setNotes(newNotes)
                showAlert("Note Updated successfully.", "success")
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    return (
        <NoteContext.Provider value={{ notes, getNotes, setNotes, addNote, deleteNote, editNote }}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState