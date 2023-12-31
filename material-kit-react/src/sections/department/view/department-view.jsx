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
import Scrollbar from '../../../components/scrollbar';
import DepartmentTableRow from '../department-table-row';
import DepartmentTableHead from '../department-table-head';
import DepartmentTableToolbar from '../department-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function DepartmentPage() {
  const [page, setPage] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogParams, setDialogParams] = useState({});
  const [reRenders, setReRenders] = useState(false);

  const [order] = useState('asc');

  const [selected] = useState([]);

  const [departments, setDepartments] = useState([]);

  const [orderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const getData = async () => {
    await axios.get(`departments`).then((res) => {
      setDepartments(res.data.deps);
    }).catch(error => { })
      // .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    getData();
  }, [reRenders]);


  const handleAddButton = () => {
    const params = {
      title: 'Add department',
      text: 'Create a new department',
      acction: 'create',
      onClose: () => setDialogOpen(false),
      onRefresh: () => {
        setReRenders(!reRenders);
      },
    };
    setDialogParams(params);
    setDialogOpen(true);
  };

  const handleDeleteButton = (id, name) => {
    const params = {
      id,
      title: 'Delete department',
      text: `Do you want to delete the department of "${name}"?`,
      acction: 'delete',
      onClose: () => setDialogOpen(false),
      onRefresh: () => {
        setReRenders(!reRenders);
      },
    };
    setDialogParams(params);
    setDialogOpen(true);
  };

  const handleUpdateButton = (id, name) => {
    const params = {
      id,
      name,
      title: 'Update department',
      text: `Do you want to update the department of "${name}"?`,
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
    inputData: departments,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Departments</Typography>

        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => handleAddButton()}>
          New Department
        </Button>
      </Stack>

      <Card>
        <DepartmentTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <DepartmentTableHead
                order={order}
                orderBy={orderBy}
                rowCount={departments.length}
                numSelected={selected.length}
                // onRequestSort={handleSort}
                // onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <DepartmentTableRow
                      key={row._id}
                      id={row._id}
                      name={row.name}
                      selected={selected.indexOf(row.name) !== -1}
                      onDelete = {handleDeleteButton}
                      onUpdate = {handleUpdateButton}
                      // handleClick={(event) => handleClick(event, row.name)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, departments.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={departments.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

          <PopupDialog open={dialogOpen} dialogParams={dialogParams}>
            {dialogParams.acction === 'delete' && <DeleteForm params={dialogParams}/>}
            {dialogParams.acction === 'update' && <UpdateForm params={dialogParams}/>}
            {dialogParams.acction === 'create' && <CreateForm params={dialogParams}/>}
          </PopupDialog>
      </Card>
    </Container>
  );
}
