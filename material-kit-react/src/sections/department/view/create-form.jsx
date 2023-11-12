/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import * as Yup from 'yup';
// import styled from 'styled-components/macro';
// import { spacing } from '@mui/system';

import { Formik } from 'formik';

import { Add as AddIcon } from '@mui/icons-material';
import {
    Box,
    Alert,
    Button,
    Divider,
    TextField,
    CircularProgress,
} from '@mui/material';

import axios from '../../../utils/axiosapi';

const handleInitialValues = (fields) => {
    const init = {};
    fields.forEach((field) => {
        init[field.name] = '';
    });
    return init;
};

const createSchema = [
    { name: 'name', label: 'name', type: 'text' },
];

const validationObject = {};
validationObject.name = Yup.string().required('department name is required');

const validationSchema = Yup.object().shape({
    ...validationObject
})

function CreateForm({ params }) {
    const [isDisabled, setIsDisabled] = React.useState(false);

    const handleFormSubmit = async (values, { setErrors, setStatus }) => {
        setIsDisabled(true);
        setStatus({ loader: true });

        axios
            .post(`departments`, values)
            .then((response) => {
                setStatus({ sent: true, responseData: response.data, loader: false });
                params.onRefresh();
                setTimeout(() => params.onClose(), 1500);
            })
            .catch((error) => {
                setIsDisabled(false);
                setStatus({ sent: false });
                setErrors({ submit: error.message });
            });
    };

    return (
        <Formik
            initialValues={handleInitialValues(createSchema)}
            validationSchema={validationSchema}
            onSubmit={handleFormSubmit}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, touched, values, status }) => (
                <>
                    {status && status.sent && (
                        <Alert severity="success" my={3}>
                            {`The item has been added successfully! - ${status.responseData.keyName}.`}
                        </Alert>
                    )}

                    {errors && errors.submit && (
                        <Alert severity="error" my={3}>
                            {`The item has not been added! - ${errors.submit}.`}
                        </Alert>
                    )}

                    {status && status.loader && (
                        <Box display="flex" justifyContent="center" my={3}>
                            <CircularProgress />
                        </Box>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Divider sx={{ mb: 2 }} />

                        <TextField
                            id='name'
                            key='name'
                            value={values.name}
                            error={errors && Boolean(touched.name && errors.name)}
                            helperText={errors && touched.name && errors.name}
                            name='name'
                            label='department name'
                            placeholder='department name'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            fullWidth
                            disabled={isDisabled}
                        />

                        <Divider sx={{ mb: 2 }} />
                        <Button type="submit" variant="contained" color="primary" sx={{ mb: 2 }} disabled={isDisabled}>
                            <AddIcon />
                            Add
                        </Button>
                        <Button color="primary" sx={{ mb: 2, ml: 1 }}
                            onClick={params.onClose}
                        >
                            Cancel
                        </Button>
                    </form>
                </>
            )}
        </Formik>
    );
}

export default CreateForm;
