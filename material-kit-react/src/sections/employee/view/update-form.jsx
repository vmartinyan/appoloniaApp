/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import * as Yup from 'yup';
// import styled from 'styled-components/macro';
// import { spacing } from '@mui/system';

import { Formik } from 'formik';

import { Check as CheckIcon } from '@mui/icons-material';
import {
    Box,
    Alert,
    Button,
    Select,
    Divider,
    MenuItem,
    TextField,
    InputLabel,
    FormControl,
    FormHelperText,
    CircularProgress
} from '@mui/material';

import axios from '../../../utils/axiosapi';


const handleInitialValues = (params) => {
    const init = {
        name: params.name,
        lastName: params.lastName,
        departmentId: params.departmentId
    };
    return init;
};

const validationObject = {};
validationObject.name = Yup.string().required('The name is required');
validationObject.lastName = Yup.string().required('The last name is required');
validationObject.departmentId = Yup.string().required('Department is required');

const validationSchema = Yup.object().shape({
    ...validationObject
})

function CreateForm({ params }) {
    const [isDisabled, setIsDisabled] = React.useState(false);
    const [departments, setDepartments] = React.useState([]);

    React.useEffect(() => {
        axios.get(`departments`).then((res) => {
            setDepartments(res.data.deps);
        }).catch(error => { })
    }, []);


    const handleFormSubmit = async (values, { setErrors, setStatus }) => {
        setIsDisabled(true);
        setStatus({ loader: true });

        const obj = { id: params.id, name: values.name, lastName: values.lastName, departmentId: values.departmentId }

        axios
            .put(`employees`, obj)
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
            initialValues={handleInitialValues(params)}
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
                            label='first name'
                            placeholder='first name'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            fullWidth
                            disabled={isDisabled}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            id='lastName'
                            key='lastName'
                            value={values.lastName}
                            error={errors && Boolean(touched.lastName && errors.lastName)}
                            helperText={errors && touched.lastName && errors.lastName}
                            name='lastName'
                            label='last name'
                            placeholder='last name'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            fullWidth
                            disabled={isDisabled}
                            sx={{ mb: 2 }}
                        />

                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel id="depLabel">Department</InputLabel>
                            <Select
                                labelId="depLabel"
                                key="departmentId"
                                id="departmentId"
                                name="departmentId"
                                value={values.departmentId}
                                label="Department"
                                placeholder='department'
                                fullWidth
                                onChange={handleChange}
                                error={errors && Boolean(touched.departmentId && errors.departmentId)}
                                helperText={errors && touched.departmentId && errors.departmentId}
                                disabled={isDisabled}
                            >
                                {departments && departments.map((item) => (
                                    <MenuItem value={item._id} key={item._id}>
                                        {item.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors && errors.departmentId && touched.departmentId && <FormHelperText error>{errors.departmentId}</FormHelperText>}
                        </FormControl>
                        <Divider sx={{ mb: 2 }} />
                        <Button type="submit" variant="contained" color="primary" sx={{ mb: 2 }} disabled={isDisabled}>
                            <CheckIcon />
                            Update
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
