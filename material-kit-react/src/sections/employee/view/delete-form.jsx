/* eslint-disable react/prop-types */
/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';

import { Clear as ClearIcon } from '@mui/icons-material';
import { Box, Alert, Button, Divider, CircularProgress } from '@mui/material';

import axios from '../../../utils/axiosapi';

// ---------------------------------------------------------

// ---------------------------------------------------------

export default function DeleteForm({ params }) {
    const [status, setStatus] = React.useState({});
    const [isDisabled, setIsDisabled] = React.useState(false);

    const handleSubmit = () => {
        setIsDisabled(true);
        setStatus({ loader: true });
        const obj = {"id": params.id}
        axios
            .delete(`employees`, {data: obj})
            .then((response) => {
                setStatus({ sent: true, responseData: response.data, loader: false });
                params.onRefresh();
                setTimeout(() => params.onClose(), 1500);
            })
            .catch((error) => {
                setStatus({ submit: error.message, sent: false });
                setIsDisabled(false);
            });
    };

    return (
        <>
            {status && status.sent && (
                <Alert severity="success" my={3}>
                    The item has been deleted successfully!
                </Alert>
            )}
            {status && status.submit && (
                <Alert severity="error" my={3}>
                    {`The item has not been deleted! - ${status.submit}.`}
                </Alert>
            )}
            {status && status.loader && (
                <Box display="flex" justifyContent="center" my={3}>
                    <CircularProgress />
                </Box>
            )}
            <Divider sx={{my: 2}} />
            <Button variant="contained" color="error" onClick={() => handleSubmit()} disabled={isDisabled}>
                <ClearIcon />
                Delete
            </Button>
            <Button color="primary" onClick={params.onClose} sx={{ml: 1}}>
                Cancel
            </Button>
        </>
    );
}
