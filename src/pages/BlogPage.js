import { Helmet } from 'react-helmet-async';
import { sentenceCase } from 'change-case';
import Cookies from 'universal-cookie';
import { useEffect, useState } from 'react';

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
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead } from '../sections/@dashboard/user';
import { fDateTime } from '../utils/formatTime';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'application_id', label: 'Application ID', alignRight: false },
  { id: 'Job ID', label: 'Job ID', alignRight: false },
  { id: 'date', label: 'Applied Date', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'button', label: 'Button', alignRight: false}
];

// ----------------------------------------------------------------------

export default function UserPage() {
  const cookies = new Cookies();
  const token = cookies.get('token');
  console.log(token);
  const [applications, setApplications] = useState([]);

  const ApplicationEndpoint = `http://127.0.0.1:8000/application/api/application`;

  useEffect(() => {
    // Fetch applications with authorization header
    async function fetchApplications() {
      try {
        const response = await fetch(ApplicationEndpoint, {
          headers: {
            Authorization: token,
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setApplications(data.application);
        console.log(data.application);
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    }
    fetchApplications();
  }, [token]);

  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            My Applications
          </Typography>
        </Stack>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead headLabel={TABLE_HEAD} />
                <TableBody>
                  {applications.map((application) => {
                    /* eslint-disable camelcase */
                    const { id, job_id, application_date, status } = application;
                    /* eslint-disable camelcase */

                    return (
                      <TableRow hover key={id} tabIndex={-1}>
                        <TableCell component="th" scope="row" padding="none" >
                          <Stack direction="row" alignItems="center" spacing={2} sx={{ml:'25%'}}>
                            <Typography variant="subtitle2" noWrap >
                              {id}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{job_id}</TableCell>

                        <TableCell align="left">
                          {fDateTime(application_date)} {/* Make sure to format the date as needed */}
                        </TableCell>

                        <TableCell align="left">
                          <Label color={(status === 'In Progress' && 'info') || (status === 'Not-moving-forward' && 'error') || 'success'}>
                            {sentenceCase(status)}
                          </Label>
                        </TableCell>

                        <TableCell align="left">
                          {(status === "In Progress") && <Button size='small' color='info' variant='contained'> 
                            Modify Application
                          </Button>}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
      </Container>
    </>
  );
}
