/* eslint-disable import/extensions */
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import axios from '../../utils/axiosapi';
import Iconify from '../../components/iconify';

// ----------------------------------------------------------------------

export default function EmployeeTableRow({
  selected,
  id,
  name,
  lastName,
  depId,
  onDelete,
  onUpdate
}) {
  const [open, setOpen] = useState(null);
  const [department, setDepartment] = useState({});

  useEffect(() => {
    axios.get(`departments`
    ).then((res) => {
      const dep = res.data.deps.find(x => x._id === depId);
      setDepartment(dep);
    }).catch(error => { })
  },[depId]);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap sx={{ pl: 2 }}>
              {name} {lastName}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap sx={{ pl: 2 }}>
              {department.name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={() => onUpdate(id, name, lastName, depId)}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={() => onDelete(id, name, lastName)} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}

EmployeeTableRow.propTypes = {
  name: PropTypes.any,
  id: PropTypes.any,
  lastName: PropTypes.any,
  depId: PropTypes.any,
  selected: PropTypes.any,
  onDelete: PropTypes.any,
  onUpdate: PropTypes.any,
};
