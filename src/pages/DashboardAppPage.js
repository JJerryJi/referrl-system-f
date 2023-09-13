import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { Grid, Container, Typography } from '@mui/material';
import Cookies from 'universal-cookie';

import { AppTrafficBySite } from '../sections/@dashboard/app'; // Import AppJobPosts instead of AppTrafficBySite
// ...

export default function DashboardAppPage() {
  const cookies = new Cookies();
  const authToken = cookies.get('token');
  console.log(authToken);
  const [jobPosts, setJobPosts] = useState([]);

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
      });
  }, []); 

  return (
    <>
      <Helmet>
        <title>Dashboard | Minimal UI</title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Here are all job posts
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={32} md={16} lg={16}>
            <AppTrafficBySite title="Job Posts" list={jobPosts}/>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
