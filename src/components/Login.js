import React, { useState, useContext,useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import AlertContext from '../context/alert/AlertContext';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: "", password: "" })
    const { email, password } = credentials
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

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password }), // body data type must match "Content-Type" header
            });

            if (response.status === 200) {
                const json = await response.json();
                // Save the auth token and redirect
                localStorage.setItem(process.env.REACT_APP_AUTH_TOKEN_KEY, json.authToken);
                navigate("/");
                showAlert("Logged in successfully", "success")
            }else {
                // Error handling
                showAlert("Invalid credentials", "danger")
            }

        } catch (error) {
            console.error(error.message);
        }
    }

    return (
        <div className = "container my-3" style = {{ width: "500px" }}>
            <h1>Login</h1>            
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" aria-describedby="emailHelp" name='email' required value={email} onChange={onChange} />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name='password' required value={password} onChange={onChange} minLength={5} />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>
    )
}

export default Login
