/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React from 'react';

import { Dialog, DialogTitle, DialogContent, DialogContentText } from '@mui/material';

const PopupDialog = (props) => (
    <Dialog open={props.open} aria-labelledby="form-dialog-title" fullWidth maxWidth="sm">
      <DialogTitle id="form-dialog-title">{props.dialogParams.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{props.dialogParams.text}</DialogContentText>
        {props.children}
      </DialogContent>
    </Dialog>
  );

export default PopupDialog;