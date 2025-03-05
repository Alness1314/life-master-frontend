import React from 'react';

const MaterialFileInput = ({ onChange, accept, className }) => {
    return (
        <div className={`input-container ${className}`}>
            <input
                type="file"
                onChange={onChange}
                accept={accept}
                className={`w-full border border-blue-900 font-extralight tracking-wider text-black dark:text-white bg-transparent cursor-pointer outline-none rounded-lg`}
            />
        </div>
    );
};

export default MaterialFileInput;