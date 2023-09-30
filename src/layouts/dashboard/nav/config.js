// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'Job Post Dashboard',
    path: '/job-posts',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Job Post LeaderBoard',
    path: '/leaderboard',
    icon: icon('ic_analytics'),
  },
  // {
  //   title: 'user',
  //   path: '/user',
  //   icon: icon('ic_user'),
  // },
  // {
  //   title: 'product',
  //   path: '/dashboard/products',
  //   icon: icon('ic_cart'),
  // },
  {
    title: 'My Job Posts',
    path: '/my-job-posts',
    icon: icon('ic_analytics'),
  },
  {
    title: 'application',
    path: '/application',
    icon: icon('ic_blog'),
  },
    {
    title: 'Saved Job Posts',
    path: '/favorite-job-posts',
    icon: icon('ic_cart'),
  },
  {
    title: 'profile',
    path: '/profile',
    icon: icon('ic_user'),
  },
  {
    title: 'login',
    path: '/login',
    icon: icon('ic_lock'),
  },
  {
    title: 'signup',
    path: '/signup',
    icon: icon('ic_lock'),
  },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // },
];

export default navConfig;
