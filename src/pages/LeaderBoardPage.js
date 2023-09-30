import { useEffect, useState } from 'react';

import { Table, Grid, Container, Stack, Typography, TableContainer } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { AppNewsUpdate } from '../sections/@dashboard/app';

export default function LeaderBoardPage() {
  const [leadingPosts, setLeadingPosts] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/job/api/leaderboard')
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        return null;
      })
      .then((data) => {
        if (data) {
          // Extract job post objects from the numbered keys
          const jobPosts = Object.values(data);

          // Set the job posts in the state
          setLeadingPosts(jobPosts);
          console.log(jobPosts);
        } else {
          throw new Error('Invalid data');
        }
      })
      .catch((error) => {
        throw new Error(`Error Fetching the leaderboard information: ${error.message}`);
      });
  }, []);

  return (
    <>
      <Helmet>
        <title> LeaderBoard </title>
      </Helmet>

      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="h4" color="#2196f3">
            Top 5 LeaderBoard
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          <Grid item xs={30} md={16} lg={16}>
            <AppNewsUpdate list={leadingPosts} />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
