import { useState, useContext } from "react";
import UserContext from "./UserContext";
import AlertContext from '../../context/alert/AlertContext';
import axiosInstance from "../../axiosInstance";

const NoteState = (props) => {
    const [user, setUser] = useState({ name: "", email: "" })
    const context = useContext(AlertContext)
    const { showAlert } = context;
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Get User Details
    const getUser = async () => {
        setLoading(true);
        return axiosInstance.get("/user").then((response) => {
            setUser(response.data)
            return response;
        }).catch((error) => {
            console.error('An error occurred:', error);
            return error;
        }).finally(() => {
            setLoading(false);
        });
    }

    // Edit a User
    const updateUser = async (name, profileImg) => {
        setLoading(true);
        const formData = new FormData();
        formData.append("profile_picture", profileImg);
        formData.append('name', name);

        return axiosInstance.put("/user/update", formData)
        .then((response) => {
            setErrors({})

            const resJson = response.data;
            let newUser = JSON.parse(JSON.stringify(user))
            newUser.name = resJson.name
            newUser.profile_picture = resJson.profile_picture
            setUser(newUser)
            showAlert("User Updated successfully.", "success")

            return response;
        }).catch((error) => {
            if (error.validationErrors) {
                setErrors(error.validationErrors);
            } else {
                console.error('An error occurred:', error);
            }

            return error;
        }).finally(() => {
            setLoading(false);
        });
    }

    // Change Password
    const changePassword = (password, cpassword) => {
        setLoading(true);
        return axiosInstance.put("/user/change-password", { password, cpassword }).then((response) => {
                    setErrors({})

                    return response;
                }).catch((error) => {
                    if (error.validationErrors) {
                        setErrors(error.validationErrors);
                    } else {
                        console.error('An error occurred:', error);
                    }

                    return error;
                }).finally(() => {
                    setLoading(false);
                });
    }

    return (
        <UserContext.Provider value={{ user, getUser, updateUser, setUser, changePassword, loading, errors }}>
            {props.children}
        </UserContext.Provider>
    )
}

export default NoteState