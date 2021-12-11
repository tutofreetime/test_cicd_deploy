import React, {useEffect} from 'react';
import Loader from '../utils/Loader';
import axios from "axios";

//TODO - to set into a service file and import when needed
const axiosInstance = axios.create({
    baseURL: process.env.SERVER_URL || 'http://localhost:9000/',
    withCredentials: true
});

// TODO - example of how to use axios to make a request to the server
const Profile = () => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async () => {
        const url = 'users/auth/google/callback';
        await axiosInstance.get(url, {
            withCredentials: true
        }).then(res => {
            console.log(res.data);
        });
    }, []);

  return (
    <>
      <Loader />
    </>
  );
};

export default Profile;
