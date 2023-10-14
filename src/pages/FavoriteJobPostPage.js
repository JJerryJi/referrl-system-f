import { Helmet } from 'react-helmet-async';
import { sentenceCase } from 'change-case';
import { filter } from 'lodash';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'job_id', label: 'Favorite Job Link', alignRight: false },
  { id: 'application_link', label: 'Application Link', alignRight: false },
  { id: 'application_status', label: 'Status', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function FavoriteJobPostPage({ authToken }) {
  // const cookies = new Cookies();
  // const token = cookies.get('token');
  const token = authToken;
  console.log(token);
  const navigate = useNavigate();

  const [open, setOpen] = useState(null);
  const [selectedFavoriteJobId, setSelectedFavoriteJobId] = useState(null);

  // multiple page design
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [appliedInfo, setAppliedInfo] = useState([]);
  const [appliedJobStatus, setAppliedJobStatus] = useState([]);
  const [favoriteJobs, setFavoriteJobs] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('job_id');
  const [filterName, setFilterName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleOpenMenu = (event, favoriteJobId) => {
    setOpen(event.currentTarget);
    setSelectedFavoriteJobId(favoriteJobId);
    console.log(favoriteJobId);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    if (query) {
      return filter(array, (_user) => _user.id.toString().toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  let filteredUsers = applySortFilter(favoriteJobs, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - favoriteJobs.length) : 0;
  const favoriteJobsEndpoint = `http://127.0.0.1:8000/job/api/favorite_jobs`;

  const handleDeleteFavJob = () => {
    console.log('success');
    fetch(favoriteJobsEndpoint.concat('/').concat(selectedFavoriteJobId), {
      method: 'DELETE',
      headers: {
        Authorization: token,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          setSuccessMessage(data.message);
          setOpen(null);
        }
        console.log(data);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    // Fetch favorite jobs with authorization header
    async function fetchFavoriteJobs() {
      try {
        const response = await fetch(favoriteJobsEndpoint, {
          headers: {
            Authorization: token,
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setFavoriteJobs(data.favorite_jobs);
        console.log(data.favorite_jobs);

        const applicationInfoResponse = await fetch(`http://127.0.0.1:8000/application/api/application`, {
          headers: { Authorization: token },
        });
        if (!applicationInfoResponse.ok) {
          throw new Error('An error occurred when fetching application info');
        }
        const applicationInfoData = await applicationInfoResponse.json();
        const applications = applicationInfoData.application;

        // Create an array to store whether each favorite job has been applied
        const ifApplied = data.favorite_jobs.map((favoriteJob) => {
          // Check if the job is in the applications data
          return applications.some((application) => application.job_id === favoriteJob.job_id);
        });

        // Create an array to store the status of each favorite job
        const appliedJobStatus = data.favorite_jobs.map((favoriteJob) => {
          const matchingApplication = applications.find((application) => application.job_id === favoriteJob.job_id);
          return matchingApplication ? [matchingApplication.status, matchingApplication.id] : '';
        });
        console.log('job status', appliedJobStatus);
        console.log('if applied before:', ifApplied);
        setAppliedInfo(ifApplied); // Store the applied info in state
        setAppliedJobStatus(appliedJobStatus); // Store the job status in state
      } catch (error) {
        console.error('Error fetching favorite jobs:', error);
      }
    }
    fetchFavoriteJobs();
    filteredUsers = applySortFilter(favoriteJobs, getComparator(order, orderBy), '');
  }, [successMessage]);

  return (
    <>
      <Helmet>
        <title> User | Referral_Finder </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Favorite Jobs
          </Typography>
        </Stack>

        <Card>
          <UserListToolbar filterName={filterName} onFilterName={handleFilterByName} />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={favoriteJobs?.length}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((application, index) => {
                      /* eslint-disable  */
                      // id: favorite job id
                      // job_id: current job id
                      let { id, job_id, job_open_status } = application;
                      let isJobApplied = appliedInfo[index];
                      let currentJobStatus='';
                      if(appliedJobStatus[index]){
                        console.log('applied job status:', appliedJobStatus[index][0]);
                        currentJobStatus = appliedJobStatus[index][0];
                      }
                      // let currentJobStatus = appliedJobStatus[index][0];
                      /* eslint-disable  */
                      return (
                        <TableRow hover key={job_id} tabIndex={-1}>
                          <TableCell align="left">
                            <Button
                              onClick={() => {
                                navigate(`/job-posts/${job_id}`);
                              }}
                            >
                              Job {job_id}
                            </Button>
                          </TableCell>

                          <TableCell align="left">
                            <Button
                              variant="contained"
                              size="small"
                              color="info"
                              disabled={!job_open_status || (isJobApplied && currentJobStatus !== 'In Progress')}
                              onClick={() => {
                                if (currentJobStatus === 'In Progress') navigate(`/edit-application/${appliedJobStatus[index][1]}`);
                                else navigate(`/application/${job_id}`);
                              }}
                            >
                              Application Link
                            </Button>
                          </TableCell>

                          <TableCell align="left">
                            <Label
                              color={
                                (currentJobStatus === 'In Progress' && 'info') ||
                                (currentJobStatus === 'Selected' && 'success') ||
                                (currentJobStatus === 'Not-moving-forward' && 'error') ||
                                'default'
                              }
                            >
                              {currentJobStatus ||
                                (job_open_status ? 'Waiting for your Application' : 'The Job is Closed')}
                            </Label>
                          </TableCell>

                          <TableCell align="right">
                            <IconButton
                              size="large"
                              color="inherit"
                              onClick={(clickEvent) => handleOpenMenu(clickEvent, id)}
                            >
                              <Iconify icon={'eva:more-vertical-fill'} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={favoriteJobs?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />

          <Popover
            open={Boolean(open)}
            anchorEl={open}
            onClose={handleCloseMenu}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem sx={{ color: 'error.main' }} onClick={handleDeleteFavJob}>
              <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
              Delete
            </MenuItem>
          </Popover>
        </Card>
      </Container>
    </>
  );
}
