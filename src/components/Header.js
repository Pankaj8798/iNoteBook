import React, { useState, useEffect, useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AlertContext from '../context/alert/AlertContext';
import UserContext from '../context/user/UserContext';

const NavBar = () => {
    const location = useLocation();
    const [url, setUrl] = useState(null);
    const isLoggedIn = localStorage.getItem(process.env.REACT_APP_AUTH_TOKEN_KEY) ? true : false;
    let navigate = useNavigate();
    const context = useContext(AlertContext)
    const { showAlert } = context;
    const userContext = useContext(UserContext)
    const { user, getUser } = userContext;

    useEffect(() => {
        if (isLoggedIn) {
            getUser()
        }
        setUrl(location.pathname);
        // eslint-disable-next-line
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem(process.env.REACT_APP_AUTH_TOKEN_KEY);
        navigate("/login");
        showAlert("Logged out successfully.", "success")
    }

    const capitalize = (str) => {
        return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">iNotebook</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className={"nav-link" + (url === "/" ? " active" : "")} aria-current="page" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={"nav-link" + (url === "/about" ? " active" : "")} to="/about">About</Link>
                            </li>
                        </ul>
                        {!isLoggedIn ? <form className="d-flex" role="search">
                            <Link component="button" className="btn btn-primary btn-sm mx-1" variant="contained" role="button" to={"/login"}>Login</Link>
                            <Link className="btn btn-primary btn-sm mx-1" role="button" to={"/signup"}>SignUp</Link>
                        </form> : <div className="dropdown" style={{ position: "absolute", right: "90px" }}>
                                        <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            My Account
                                        </button>
                                        <ul className="dropdown-menu">
                                    <li className="dropdown-item"><strong><img className="mx-1" style={{ borderRadius: "50%", width: "50px", height: "50px" }} src={user.profile_picture} alt="avatar" />{ capitalize(user.name) }</strong></li>
                                            <li><Link className="dropdown-item" to={"/profile"}>My Profile</Link></li>
                                            <li><Link className="dropdown-item" to={"/change-password"}>Change Password</Link></li>
                                            <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                                        </ul>
                                    </div>}
                    </div>
                </div>
            </nav>
        </>
    )
}

export default NavBar
