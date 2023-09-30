import { useNavigate } from 'react-router-dom';

// @mui
import PropTypes from 'prop-types';
import { Box, Stack, Link, Card, Button, Divider, Typography, CardHeader } from '@mui/material';
// utils
import { fToNow } from '../../../utils/formatTime';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';

// ----------------------------------------------------------------------

AppNewsUpdate.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  list: PropTypes.array.isRequired,
};

export default function AppNewsUpdate({ title, subheader, list, ...other }) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
          {list.map((news, index) => (
            <NewsItem key={index} news={news} />
          ))}
        </Stack>
      </Scrollbar>

      <Divider />

      <Box sx={{ p: 2, textAlign: 'right' }}>
        <Button size="small" color="inherit" endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />}>
          View all
        </Button>
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------

NewsItem.propTypes = {
  news: PropTypes.shape({
    description: PropTypes.string,
    image: PropTypes.string,
    postedAt: PropTypes.instanceOf(Date),
    title: PropTypes.string,
  }),
};

/* eslint-disable */
function NewsItem({ news }) {
  const navigate = useNavigate();
  const { job_post_id, job_name, job_company, created_time, score } = news;

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box component="img" alt={''} src={'/assets/icons/number1.png'} sx={{ width: 48, height: 48, borderRadius: 1.5, flexShrink: 0 }} />

      <Box sx={{ minWidth: 240, flexGrow: 1 }}>
        <Link
          color="inherit"
          variant="subtitle2"
          underline="hover"
          noWrap
          onClick={() => navigate(`/job-posts/${job_post_id}`)}
        >
          {job_name}
        </Link>

        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
          {job_company}
        </Typography>
      </Box>

      <Box>
      <Typography variant="body2" sx={{ pr: 3, flexShrink: 0, color: 'text.secondary' }}>
        {score} points
      </Typography>  
      <Typography variant="caption" sx={{ pr: 3, flexShrink: 0, color: 'text.secondary' }}>
        {fToNow(created_time)}
      </Typography>
      </Box>
    </Stack>
  );
}
/* eslint-disable */
