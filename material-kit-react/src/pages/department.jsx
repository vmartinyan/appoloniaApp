import { Helmet } from 'react-helmet-async';

import { DepartmentView } from '../sections/department/view';

// ----------------------------------------------------------------------

export default function DepartmentPage() {
  return (
    <>
      <Helmet>
        <title> Departments </title>
      </Helmet>

      <DepartmentView />
    </>
  );
}
