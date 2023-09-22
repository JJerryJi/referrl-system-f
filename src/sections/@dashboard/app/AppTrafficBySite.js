// @mui
import PropTypes from 'prop-types';
import { Box, Card, Paper, Typography, CardHeader, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Label from '../../../components/label/Label';
// utils

// import Button from 'src/theme/overrides/Button';

// ----------------------------------------------------------------------

AppTrafficBySite.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  list: PropTypes.array.isRequired,
};

export default function AppTrafficBySite({ title, subheader, list, ...other }) {
  const navigate = useNavigate()
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <CardContent>
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          {list.map((job) => (
            <Paper key={job.job_id} variant="outlined" sx={{ py: 2.5, textAlign: 'center' }}>
              <Typography variant="h6">Job {job.job_id } {job.job_company}</Typography>

              <Typography variant="body3" sx={{ color: 'text.secondary' }}>
                {' '}
                {job.job_name}{' '}
              </Typography>
              <Box>
                {' '}
                <Button sx={{ color: '#1565c0' }} onClick={()=>{navigate(`/job-posts/${job.job_id}`)}}>Learn more about this Job</Button>
              </Box>
            </Paper>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
