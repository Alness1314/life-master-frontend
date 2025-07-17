import React from "react";
import PropTypes from 'prop-types';
import { EyeIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";

const ActionButtons = ({ id, handleDetails, handleUpdate, handleDelete }) => {
    ActionButtons.propTypes = {
        id: PropTypes.string.isRequired,
        handleDetails: PropTypes.any,
        handleUpdate: PropTypes.any,
        handleDelete: PropTypes.any
    };


    return (
        <div className="flex gap-2">
            <IconButton
                onClick={() => handleDetails(id)}
                className="bg-deep-purple-400 dark:bg-deep-purple-200"
            >
                <EyeIcon className="h-5 w-5 text-white dark:text-gray-900" />
            </IconButton>
            <IconButton
                onClick={() => handleUpdate(id)}
                className="bg-deep-purple-400 dark:bg-deep-purple-200"
            >
                <PencilSquareIcon className="h-5 w-5 text-white dark:text-gray-900" />
            </IconButton>
            <IconButton
                onClick={() => handleDelete(id)}
                className="bg-deep-purple-400 dark:bg-deep-purple-200"
            >
                <TrashIcon className="h-5 w-5 text-white dark:text-gray-900" />
            </IconButton>
        </div>
    );


}

export default React.memo(ActionButtons);