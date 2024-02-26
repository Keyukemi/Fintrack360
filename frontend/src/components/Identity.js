import React, { useState, useEffect } from 'react';
import axiosInstance from '../config/axiosConfig';
import { BsPersonBoundingBox } from "react-icons/bs";

const Identity = () => {
    const [identityData, setIdentityData] = useState(null);
    const [photoUrl, setPhotoUrl] = useState('');

    useEffect(() => {
        const fetchIdentityData = async () => {
            try {
                const userId = sessionStorage.getItem('userId');
                if (!userId) {
                    throw new Error('User ID not found in sessionStorage');
                }

                const response = await axiosInstance.get(`/api/identity/${userId}`);

                const fetchedIdentityData = response.data.data;
                setIdentityData(fetchedIdentityData);
                const imageUrl = `data:image/jpeg;base64,${fetchedIdentityData.photoId}`;
                setPhotoUrl(imageUrl);
            } catch (error) {
                console.error('Error fetching identity data:', error);
            }
        };
        fetchIdentityData();
    }, []);

    return (
        <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-tertiary">Identity Data</h1>
            {photoUrl ? (
                <img src={photoUrl} alt='profile-id' className='border-4 border-tertiary object-cover rounded-full h-24 w-24 mx-auto mb-4' />
            ) : (
                <BsPersonBoundingBox size={48} className='border-4 border-tertiary rounded-full mx-auto mb-4' />
            )}
            
            <div className='grid grid-cols-1 gap-2 mx-auto'>
                {identityData ? (
                    <>
                        <div className="flex items-center justify-between bg-tertiary text-white p-3 rounded-md">
                            <div className="">First Name:</div>
                            <div className="pl-4">{identityData.middleName}</div>
                        </div>
                        <div className="flex items-center justify-between bg-tertiary text-white p-3 rounded-md">
                            <div className="">Last Name:</div>
                            <div className="pl-4">{identityData.lastName}</div>
                        </div>
                        
                        <div className="flex items-center justify-between bg-tertiary text-white p-3 rounded-md">
                            <div className="">Phone Number: </div>
                            <div className="pl-4"> {identityData.phoneNumber2}</div>
                        </div>
                        <div className="flex items-center justify-between bg-tertiary text-white p-3 rounded-md">
                            <div className="">Gender:</div>
                            <div className="pl-4">{identityData.gender}</div>
                        </div>
                    </>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
};

export default Identity;
