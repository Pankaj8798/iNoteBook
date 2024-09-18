import React, { useContext, useState } from 'react'
import NoteContext from '../context/notes/NoteContext'
import AlertContext from '../context/alert/AlertContext';
const AddNote = (props) => {
    const context = useContext(NoteContext)
    const { addNote } = context
    const [note, setNote] = useState({ title: "", description: "", tag: "Default" })
    const alertContext = useContext(AlertContext)
    const { showAlert } = alertContext;
    const handleClick = (e) => {
        e.preventDefault()
        addNote(note.title, note.description, note.tag)
        setNote({ title: "", description: "", tag: "" })
        showAlert("Note Added successfully.", "success")
        props.refClose.current.click();
    }

    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value })
    }

    return (
        <div>
            <div className="modal fade" id="staticBackdrop1" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Add a new Note</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Title</label>
                                    <input type="text" className="form-control" id="title" aria-describedby="title" name="title" onChange={onChange} value={note.title} required minLength={5} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <textarea className="form-control" id="description" name="description" rows="3" onChange={onChange} value={note.description} required minLength={5}></textarea>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="tag" className="form-label">Tag</label>
                                    <input type="text" className="form-control" id="tag" aria-describedby="tag" name="tag" onChange={onChange} value={note.tag || "Default"} />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" ref={props.refClose} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="submit" className="btn btn-primary" onClick={handleClick} disabled={note.title.length < 5 || note.description.length < 5}>Add Note</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddNote
