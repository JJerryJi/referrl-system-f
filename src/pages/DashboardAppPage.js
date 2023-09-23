import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Container,
  Typography,
  Stack,
  Button,
  TablePagination,
  Table,
  TableContainer,
  InputAdornment,
  OutlinedInput,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import Cookies from 'universal-cookie';
import { filter } from 'lodash';
import Scrollbar from '../components/scrollbar';

import Iconify from '../components/iconify';

import { AppTrafficBySite } from '../sections/@dashboard/app'; // Import AppJobPosts instead of AppTrafficBySite
// ...

export default function DashboardAppPage() {
  const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
    width: 240,
    transition: theme.transitions.create(['box-shadow', 'width'], {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.shorter,
    }),
    '&.Mui-focused': {
      width: 320,
      boxShadow: theme.customShadows.z8,
    },
    '& fieldset': {
      borderWidth: `1px !important`,
      borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
    },
  }));

  const navigate = useNavigate();
  const cookies = new Cookies();
  const authToken = cookies.get('token');
  console.log(authToken);
  const [jobPosts, setJobPosts] = useState([]);
  const [allJobPosts, setAllJobPosts] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [filterName, setfilterName] = useState('');

  const handleSearchJob = (event) => {
    setfilterName(event.target.value);
    const searchedJobPosts = allJobPosts.filter((job) => {
      return event.target.value
        ? job.job_name.indexOf(event.target.value) > -1 || job.job_company.indexOf(event.target.value) > -1
        : true;
    });
    setJobPosts(searchedJobPosts);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handlePopularitySort = () => {
    // Create a new array with the sorted data
    const sortedJobPosts = [...jobPosts].sort((a, b) => b.num_of_applicants - a.num_of_applicants);
    console.log(
      'after sorted',
      sortedJobPosts.map((job) => job.num_of_applicants)
    );

    // Update the state with the new sorted array
    setJobPosts(sortedJobPosts);
  };

  const handleTimeSort = () => {
    // Create a new array with the sorted data
    const sortedJobPosts = [...jobPosts].sort((a, b) => {
      const timeA = new Date(a.job_created_time).getTime();
      const timeB = new Date(b.job_created_time).getTime();
      return timeB - timeA;
    });

    console.log(
      'after sorted',
      sortedJobPosts.map((job) => job.job_created_time)
    );

    // Update the state with the new sorted array
    setJobPosts(sortedJobPosts);
  };

  useEffect(() => {
    // Fetch job posts from the API endpoint
    fetch('http://127.0.0.1:8000/job/api/posts', {
      headers: {
        Authorization: authToken, // Include your authorization logic here
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // Filter job posts with job_review_status === "Pass"
        const filteredJobPosts = data.job_post.filter((jobPost) => jobPost.job_review_status === 'Pass');
        setJobPosts(filteredJobPosts); // Update the jobPosts state with the filtered data
        setAllJobPosts(filteredJobPosts);
      });
  }, []);

  return (
    <>
      <Helmet>
        <title>Job Posts | Referral Finder </title>
      </Helmet>

      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="h4">Here are all job posts</Typography>

          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => {
              navigate('/new-job-posts');
            }}
          >
            New Job Post
          </Button>
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="center" mb={3}>
          <Button onClick={handlePopularitySort} sx={{ marginRight: '10%' }}>
            {' '}
            Order by Popularity{' '}
          </Button>
          <Button onClick={handleTimeSort}> Order by Time </Button>
        </Stack>

        <Grid container spacing={3}>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <Scrollbar>
                <Grid item xs={32} md={16} lg={16}>
                  <AppTrafficBySite
                    title="Job Posts"
                    list={jobPosts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                    filterName={filterName}
                    onRequestSearch={handleSearchJob}
                  />
                </Grid>
              </Scrollbar>
              <TablePagination
                rowsPerPageOptions={[6, 12, 24]}
                component="div"
                count={jobPosts.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Table>
          </TableContainer>
        </Grid>
      </Container>
    </>
  );
}
