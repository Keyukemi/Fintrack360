import React from 'react';

const NotFound = () => {
    return(
        <div className="flex justify-center items-center h-screen">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-red-600 mb-4">404 - Page Not Found</h1>
                <p className="text-gray-600">Sorry, the page you are looking for does not exist.</p>
            </div>
        </div>
    )
}

export default NotFound;
