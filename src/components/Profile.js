import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../context/user/UserContext';
import { useNavigate } from "react-router-dom";
import Loader from './Loader';

const Profile = () => {
    const userContext = useContext(UserContext)
    const { user, updateUser, setUser, loading, errors } = userContext;
    const { name, email } = user;
    const navigate = useNavigate();
    const [file, setFile] = useState(null)

    useEffect(() => {
        if (!localStorage.getItem(process.env.REACT_APP_AUTH_TOKEN_KEY)) {
            navigate("/");
        }
        // eslint-disable-next-line
    }, [])
    const onChange = (e) => {
        e.preventDefault();
        if(e.target.name === "profile_picture"){
            setFile(e.target.files[0])
        }else {
            setUser({ ...user, [e.target.name]: e.target.value })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await updateUser(name, file);
        } catch (error) {
            console.error('Error updating profile:', error);            
        }
    }

    return (
        <div className="container my-3" style={{ width: "500px" }}>
            <h1>My Profile</h1>
            {loading && <Loader />}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" name='name' value={name} onChange={onChange} />
                    {errors.name && <p className="text-danger mt-1">{errors.name}</p>}
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" aria-describedby="emailHelp" name='email' value={email} disabled />
                </div>
                <div className="mb-3">
                    <label htmlFor="profile_picture" className="form-label">Upload Profile Picture</label>
                    <input type="file" className="form-control" id="email" aria-describedby="emailHelp" name='profile_picture' onChange={onChange} />
                </div>
                {user.profile_picture && <div className='mb-3'>
                    <img src={user.profile_picture} alt="Profile" style={{ width: "100px", height: "100px" }} />
                </div>}
                <button type="submit" className="btn btn-primary">Update</button>
            </form>
        </div>
    )
}

export default Profile
