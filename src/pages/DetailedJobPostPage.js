import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { sentenceCase } from 'change-case';
import Cookies from 'universal-cookie';

import {
  CardHeader,
  CardContent,
  Grid,
  Card,
  Table,
  Stack,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

import Scrollbar from '../components/scrollbar';

export default function DetailedJobPostPage() {
  const navigate = useNavigate();
  const authToken = new Cookies().get('token');
  const [jobPost, setJobPost] = useState({});
  const [errMsg, setErrMsg] = useState();
  const [applied, setApplied] = useState('');
  const jobId = useParams().jobId;
  console.log(authToken);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/job/api/posts/${jobId}`, {
      headers: {
        Authorization: authToken,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setApplied(data.has_student_applied_before);
        console.log(applied)
        setJobPost(data.job_post);
      })
      .catch((error) => {
        setErrMsg(error);
        console.log(error);
      });
  }, [authToken, jobId]);

  const jobPostArray = Object.entries(jobPost);

  return (
    <>
      <Helmet>
        <title>Dashboard | Minimal UI</title>
      </Helmet>
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Here is the view of Job Post with ID: {jobId}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={32} md={16} lg={16}>
            <Card>
              <CardHeader title="Job Post Details" />
              <CardContent>
                <Scrollbar>
                  <TableContainer sx={{ minWidth: 800 }}>
                    <Table>
                      <TableBody>
                        {jobPostArray.map(([key, value]) => {
                          // Exclude specific keys
                          if (key === 'alumni_id' || key === 'job_review_status' || key === 'job_id') {
                            return null; // Skip rendering this row
                          }
                          const formattedKey = key
                            .split('_')
                            .map((word) => sentenceCase(word))
                            .join(' ');
                          return (
                            <TableRow hover key={key} tabIndex={-1}>
                              <TableCell component="th" scope="row" padding="none">
                                <Stack direction="row" alignItems="center" spacing={2}>
                                  <Typography variant="subtitle2" noWrap>
                                    {formattedKey}
                                  </Typography>
                                </Stack>
                              </TableCell>
                              <TableCell align="left" sx={{ whiteSpace: 'pre-wrap' }}>
                                {value}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Scrollbar>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                   <LoadingButton
                    size="large"
                    variant="contained"
                    disabled={applied}
                    onClick={() => {
                      navigate(`/dashboard/application/${jobId}`);
                    }}
                  >
                    Apply for this Job
                  </LoadingButton>
                </div>

                { applied && <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                   <LoadingButton
                    size="large"
                    variant="contained"
                    onClick={() => {
                      navigate(`/dashboard/application`);
                    }}
                  >
                    Go to Applications
                  </LoadingButton>
                </div>}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
