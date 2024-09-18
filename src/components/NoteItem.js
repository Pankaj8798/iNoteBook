import React, { useContext } from 'react'
import NoteContext from '../context/notes/NoteContext'
const NoteItem = (props) => {
    const { note, updateNote } = props
    const context = useContext(NoteContext)
    const { deleteNote } = context

    return (
        <div className="col-md-3">
            <div className="card my-3">
                <div className="card-body">
                    <span className="badge text-bg-secondary" style={{ position: "absolute", top: "-10px", right: "0" }}>{note.tag}</span>
                    <div className="d-flex">
                        <h5 className="card-title" style={{ width: "82%" }}>{note.title}</h5>
                        <div style={{ width: "18%" }}>
                            <i className="fa-solid fa-pen-to-square mx-1" onClick={() => { updateNote(note) }}></i>
                            <i className="fa-solid fa-trash mx-1" style={{ color: "red" }} onClick={() => { deleteNote(note._id) }}></i>
                        </div>
                    </div>
                    <p className="card-text">{note.description}</p>
                </div>
            </div>
        </div>
    )
}

export default NoteItem
