import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import CreateForm from './create-form';
import DeleteForm from './delete-form';
import UpdateForm from './update-form';
import PopupDialog from './popup-dialog';
import TableNoData from '../table-no-data';
import axios from '../../../utils/axiosapi';
import TableEmptyRows from '../table-empty-rows';
import Iconify from '../../../components/iconify';
import EmployeeTableRow from '../employee-table-row';
import Scrollbar from '../../../components/scrollbar';
import EmployeeTableHead from '../employee-table-head';
import EmployeeTableToolbar from '../employee-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function EmployeePage() {
  const [page, setPage] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogParams, setDialogParams] = useState({});
  const [reRenders, setReRenders] = useState(false);

  const [order] = useState('asc');

  const [selected] = useState([]);

  const [employees, setEmployees] = useState([]);

  const [orderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const getData = async () => {
    await axios.get(`employees`).then((res) => {
      setEmployees(res.data.employees);
    }).catch(error => { })
    // .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    getData();
  }, [reRenders]);


  const handleAddButton = () => {
    const params = {
      title: 'Add employee',
      text: 'Create a new employee',
      acction: 'create',
      onClose: () => setDialogOpen(false),
      onRefresh: () => {
        setReRenders(!reRenders);
      },
    };
    setDialogParams(params);
    setDialogOpen(true);
  };

  const handleDeleteButton = (id, name, lastName) => {
    const params = {
      id,
      title: 'Delete Employee',
      text: `Do you want to delete the employee - "${name} ${lastName}"?`,
      acction: 'delete',
      onClose: () => setDialogOpen(false),
      onRefresh: () => {
        setReRenders(!reRenders);
      },
    };
    setDialogParams(params);
    setDialogOpen(true);
  };

  const handleUpdateButton = (id, name, lastName, departmentId) => {
    const params = {
      id,
      name,
      lastName,
      departmentId,
      title: 'Update Employee',
      text: `Do you want to update the employee - "${name} ${lastName}"?`,
      acction: 'update',
      onClose: () => setDialogOpen(false),
      onRefresh: () => {
        setReRenders(!reRenders);
      },
    };
    setDialogParams(params);
    setDialogOpen(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: employees,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Employees</Typography>

        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => handleAddButton()}>
          New Employee
        </Button>
      </Stack>

      <Card>
        <EmployeeTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <EmployeeTableHead
                order={order}
                orderBy={orderBy}
                rowCount={employees.length}
                numSelected={selected.length}
                // onRequestSort={handleSort}
                // onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'department', label: 'Department' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <EmployeeTableRow
                      key={row._id}
                      id={row._id}
                      name={row.name}
                      lastName={row.lastName}
                      depId={row.departmentId}
                      selected={selected.indexOf(row.name) !== -1}
                      onDelete = {handleDeleteButton}
                      onUpdate = {handleUpdateButton}
                    // handleClick={(event) => handleClick(event, row.name)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, employees.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={employees.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        <PopupDialog open={dialogOpen} dialogParams={dialogParams}>
          {dialogParams.acction === 'delete' && <DeleteForm params={dialogParams} />}
          {dialogParams.acction === 'update' && <UpdateForm params={dialogParams} />}
          {dialogParams.acction === 'create' && <CreateForm params={dialogParams} />}
        </PopupDialog>
      </Card>
    </Container>
  );
}
