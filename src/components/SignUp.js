import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import AlertContext from '../context/alert/AlertContext';
const SignUp = () => {
    const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" })
    const { name, email, password, cpassword } = credentials
    let navigate = useNavigate();
    const context = useContext(AlertContext)
    const { showAlert } = context;

    useEffect(() => {
        if (localStorage.getItem(process.env.REACT_APP_AUTH_TOKEN_KEY)) {
            navigate("/");
        }
        // eslint-disable-next-line
    }, [])
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    // Handle Login
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (password !== cpassword) {
            showAlert("Passwords do not match", "danger")
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, password }), // body data type must match "Content-Type" header
            });

            if (response.status === 200) {
                const json = await response.json();
                // Save the auth token and redirect
                localStorage.setItem(process.env.REACT_APP_AUTH_TOKEN_KEY, json.authToken);
                navigate("/login");
                showAlert("Account created successfully", "success")
            }else {
                // Error handling
                const json = await response.json();
                showAlert(json.error, "danger")
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    return (
        <div className="container my-3" style={{ width: "500px" }}>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" name='name' value={name} onChange={onChange} minLength={3} />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" aria-describedby="emailHelp" name='email' value={email} onChange={onChange} />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name='password' value={password} onChange={onChange} minLength={5} />
                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" id="cpassword" name='cpassword' value={cpassword} onChange={onChange} minLength={5} />
                </div>
                <button type="submit" className="btn btn-primary">Register</button>
            </form>
        </div>
    )
}

export default SignUp
