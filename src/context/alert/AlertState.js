import { useState } from "react";
import AlertContext from "./AlertContext";

const NoteState = (props) => {
    const [alert, setAlert] = useState(null)

    // Show Alert
    const showAlert = async (message, type) => {
        setAlert({
            msg: message,
            type: type
        });

        setTimeout(() => {
            setAlert(null);
        }, 2000);
    }

    return (
        <AlertContext.Provider value={{ alert, showAlert }}>
            {props.children}
        </AlertContext.Provider>
    )
}

export default NoteState