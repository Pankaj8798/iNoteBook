import React, { useContext, useEffect, useRef, useState } from 'react'
import NoteContext from '../context/notes/NoteContext'
import NoteItem from './NoteItem'
import AddNote from './AddNote'
import EditNote from './EditNote'
const Note = () => {
    const context = useContext(NoteContext)
    const { notes, getNotes, editNote } = context
    const ref = useRef(null)
    const refClose = useRef(null)
    const addNoteRef = useRef(null)
    const addNoteRefClose = useRef(null)
    const [note, setNote] = useState({ title: "", description: "", tag: "" })

    useEffect(() => {
        getNotes()
        // eslint-disable-next-line
    }, [])

    const updateNote = async (currentNote) => {
        ref.current.click();
        setNote({ id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag })
    }

    const handleClick = (e) => {
        e.preventDefault()
        editNote(note.id, note.etitle, note.edescription, note.etag)
        refClose.current.click();
    }

    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value })
    }

    return (
        <>
            <AddNote refClose={addNoteRefClose} />

            <button type="button" ref={ref} className="btn btn-primary btn-sm d-none" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                Launch static backdrop modal
            </button>
            <EditNote note={note} refClose={refClose} onChange={onChange} handleClick={handleClick} />

            <div className="row my-3">
                <div className="col-md-8">
                    <h1>Your Notes</h1>
                </div>
                <div className="col-md-4 text-end">
                    <button type="button" ref={addNoteRef} className="btn btn-primary btn-sm mx-2" data-bs-toggle="modal" data-bs-target="#staticBackdrop1">
                        <i className="fa-solid fa-plus"></i> Add Note
                    </button>
                </div>
                <h5 className="text-center">
                    {notes.length === 0 && "No notes to display"}
                </h5>
                    
                {notes.map((note) => {
                    return <NoteItem key={note._id} note={note} updateNote={updateNote} />
                })}
            </div>
        </>
    )
}

export default Note
