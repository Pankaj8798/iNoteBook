import React, { useContext, useState, useEffect } from 'react'
import UserContext from '../context/user/UserContext';
import AlertContext from '../context/alert/AlertContext';
import { useNavigate } from "react-router-dom";
import Loader from './Loader';

const ChangePassword = () => {
    const [credentials, setCredentials] = useState({ password: "", cpassword: "" })
    const { password, cpassword } = credentials
    const userContext = useContext(UserContext);
    const { changePassword, loading, errors } = userContext;
    const { showAlert } = useContext(AlertContext);
    let navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem(process.env.REACT_APP_AUTH_TOKEN_KEY)) {
            navigate("/");
        }
        // eslint-disable-next-line
    }, [])
    const onChange = (e) => {
        e.preventDefault();
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    const handleSubmit = async(e) => {
        e.preventDefault();

        try {
            const response = await changePassword(password, cpassword);
            if (response && response.status === 200) {
                setCredentials({ password: "", cpassword: "" })
                showAlert(response.data, "success")
            }
        } catch (err) {
            console.error('Error updating password:', err);
        }
    }

    return (
        <div className="container my-3" style={{ width: "500px" }}>
            <h1>Change Password</h1>
            {loading && <Loader />}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name='password' value={password} onChange={onChange} />
                    {errors.password && <p className="text-danger mt-1">{errors.password}</p>}
                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" id="cpassword" name='cpassword' value={cpassword} onChange={onChange} />
                    {errors.cpassword && <p className="text-danger mt-1">{errors.cpassword}</p>}
                </div>
                <button type="submit" className="btn btn-primary">Update Password</button>
            </form>
        </div>
    )
}

export default ChangePassword
