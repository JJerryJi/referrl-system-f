import { Helmet } from 'react-helmet-async';
import { sentenceCase } from 'change-case';
import Cookies from 'universal-cookie';
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
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead } from '../sections/@dashboard/user';
import { fDateTime } from '../utils/formatTime';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'user_info', label: 'User Information', alignRight: false },
  { id: 'data', label: 'data', alignRight: false },
];

// ----------------------------------------------------------------------

export default function ProfilePage() {
  const cookies = new Cookies();
  const token = cookies.get('token');
  const tokenNumber = token?.split(' ')[1];
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [error, setErrorMsg] = useState('');

  //   async function fetchProfileInformation() {
  //     let endpoint = null;
  //     if(studentID){
  //       endpoint = `http://127.0.0.1:8000/user/api/student/${studentID}`
  //     }
  //     else if(alumniID){
  //       endpoint = `http://127.0.0.1:8000/user/api/alumni/${alumniID}`
  //     }
  //     console.log(endpoint);
  //     try {
  //       const response = await fetch(endpoint, {
  //           method:"GET",
  //           headers: { Authorization: token}
  //       });

  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }

  //       const data = await response.json();
  //       console.log(data);
  //       setProfileData(data);

  //     } catch (error) {
  //       console.error('Error fetching Profile Information');
  //     }
  //   }

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/token?token=${tokenNumber}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data);
        let studentResponse = null;
        let alumniResponse = null;
        if (data.alumni_id) {
            alumniResponse = await fetch(`http://127.0.0.1:8000/user/api/alumni/${data.alumni_id}`, {
            method: 'GET',
            headers: { Authorization: token },
          });
        } else if (data.student_id) {
          studentResponse = await fetch(`http://127.0.0.1:8000/user/api/student/${data.student_id}`, {
            method: 'GET',
            headers: { Authorization: token },
          });
        } else {
          setErrorMsg('No Student or Alumni ID is found');
        }

        if (alumniResponse) {
          const userData = await alumniResponse.json();
          console.log(userData);
          setProfileData(userData.student);
        } else if (studentResponse) {
          const userData = await studentResponse.json();
          console.log(userData.student);
          setProfileData(userData.student);
        }

      } catch (error) {
        setErrorMsg('Error fetching profile ID');
        console.error('Error fetching profile ID:', error);
      }
    }
    fetchProfile();
  }, [tokenNumber]);

  return (
    <>
      <Helmet>
        <title> User | Referral_Finder </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            My Profile
          </Typography>
        </Stack>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead headLabel={TABLE_HEAD}/> 
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
      </Container>
    </>
  );
}
