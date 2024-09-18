import React from 'react'

const EditNote = (props) => {
    return (
        <div>
            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Edit Note</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="etitle" className="form-label">Title</label>
                                    <input type="text" className="form-control" id="etitle" aria-describedby="etitle" name="etitle" value={props.note.etitle || ""} onChange={props.onChange} required minLength={5} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="edescription" className="form-label">Description</label>
                                    <textarea className="form-control" id="edescription" name="edescription" rows="3" onChange={props.onChange} value={props.note.edescription || ""} required minLength={5}></textarea>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="etag" className="form-label">Tag</label>
                                    <input type="text" className="form-control" id="etag" aria-describedby="etag" name="etag" onChange={props.onChange} value={props.note.etag || ""} />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" ref={props.refClose} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={props.handleClick} disabled={(typeof props.note.etitle !== 'undefined' && props.note.etitle.length < 5) || (typeof props.note.edescription !== 'undefined' && props.note.edescription.length < 5)}>Update Note</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditNote
