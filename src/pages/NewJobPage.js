import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import Cookies from 'universal-cookie';

import {
  CardHeader,
  CardContent,
  Grid,
  Card,
  Container,
  Typography,
  FormControl,
  InputLabel,
  Input,
  Alert,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { validateJobPostForm } from '../utils/validateForms';
import Scrollbar from '../components/scrollbar';

export default function NewJobPage() {
  const navigate = useNavigate();
  const authToken = new Cookies().get('token');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Initialize formData state to store form data
  const [formData, setFormData] = useState({
    job_name: '',
    job_company: '',
    job_requirement: '',
    job_question: '',
    job_description: '',
  });

  // validate the form
  // const validateForm = (formData) => {
  //   const errors = {};

  //   // Validate job_name 
  //   const jobNameValidator = /^[a-zA-Z0-9\s-@_]{15,35}$/;
  //   if (!formData.job_name.trim()) {
  //     errors.job_name = 'Job Name is required';
  //   }else if(!jobNameValidator.test(formData.job_name)) {
  //     errors.job_name = 'Job Name should be 15-35 characters long and may only contain letters, numbers, spaces, and hyphens.';
  //   }

  //   // Validate job_company 
  //   const jobCompanyValidator = /^[a-zA-Z0-9\s\-()_[\]!@]{3,64}$/;
  //   if (!formData.job_company.trim()) {
  //     errors.job_company = 'Company Name is required';
  //   } else if (!jobCompanyValidator.test(formData.job_company)) {
  //     errors.job_company = 'Company Name should be 3-40 characters, including letters, numbers, spaces, and some special symbols';
  //   }
    
  //   if (!formData.job_requirement.trim()) {
  //     errors.job_requirement = 'Job Requirement is required';
  //   } else if (formData.job_requirement.trim().length < 10 || formData.job_requirement.trim().length > 1000) {
  //     errors.job_requirement = 'Job Requirement should be between 10 and 1000 characters.';
  //   }    

  //   // Validate question 
  //   if (!formData.job_question.trim()) {
  //     errors.job_question = 'Job Question is required';
  //   }

  //   if (!formData.job_description.trim()) {
  //     errors.job_description = 'Job Description is required';
  //   } else if (formData.job_description.trim().length < 10 || formData.job_description.trim().length > 1000) {
  //     errors.job_description = 'Job Description should be between 10 and 1000 characters.';
  //   }    
  //   // console.log(errors);
  //   return errors;
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form fields
    const errors = validateJobPostForm(formData);

    if (Object.keys(errors).length === 0) {
      // No validation errors, proceed with form submission
      try {
        const response = await fetch('http://127.0.0.1:8000/job/api/posts', {
          method: 'POST',
          headers: {
            Authorization: authToken,
            'Content-Type': 'application/json', 
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (data.success) {
          // console.log('Referral Job Post submitted successfully');
          setSuccessMessage('Referral Job Post Successfully Submitted');
          setErrorMessage('');
          // navigate(`/dashboard/job-posts/${jobId}`);
        } else {
          setErrorMessage(data.error);
        }
      } catch (error) {
        // console.log(formData);
        console.error('Error:', error);
        throw new Error(error);
      }
    } else {
      // Validation errors found, display them
      setSuccessMessage('');
      setErrorMessage('Please correct the following form errors.\n'.concat(Object.values(errors).join('\n')));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Use spread operator to update the specific field in formData
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <>
      <Helmet>
        <title>Dashboard | Minimal UI</title>
      </Helmet>
      <Container style={{ maxWidth: '90%' }}>
        <Typography variant="h4" sx={{ mb: 5 }}>
          New Job Post
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={32} md={16} lg={16}>
            <Card>
              <CardHeader title="Content" />
              <CardContent>
                <Scrollbar>
                  <form onSubmit={handleSubmit} noValidate>
                    <FormControl fullWidth sx={{ mt: 0.75, mb: 3 }}>
                      <InputLabel> Job Post Name</InputLabel>
                      <Input
                        multiline
                        rows={1}
                        name="job_name"
                        value={formData.job_name}
                        onChange={handleChange}
                        required
                      />
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 3 }}>
                      <InputLabel>Company</InputLabel>
                      <Input
                        multiline
                        rows={1}
                        name="job_company"
                        value={formData.job_company}
                        onChange={handleChange}
                        required
                      />
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 3 }}>
                      <InputLabel>Requirement</InputLabel>
                      <Input
                        multiline
                        rows={2}
                        name="job_requirement"
                        value={formData.job_requirement}
                        onChange={handleChange}
                        required
                      />
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 3 }}>
                      <InputLabel>Description</InputLabel>
                      <Input
                        multiline
                        rows={2}
                        name="job_description"
                        value={formData.job_description}
                        onChange={handleChange}
                        required
                      />
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 3 }}>
                      <InputLabel>Job Questions</InputLabel>
                      <Input
                        multiline
                        rows={2}
                        name="job_question"
                        value={formData.job_question}
                        onChange={handleChange}
                        required
                      />
                    </FormControl>

                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                      <LoadingButton
                        type="submit"
                        size="large"
                        variant="contained"
                        // You can apply error style here based on your requirements
                      >
                        Create A New Job Post
                      </LoadingButton>
                    </div>
                  </form>

                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                    <LoadingButton
                      size="large"
                      variant="contained"
                      onClick={() => {
                        navigate(`/job-posts`);
                      }}
                    >
                      Back to All Job Posts
                    </LoadingButton>
                  </div>
                  {errorMessage && (
                    <Alert
                      sx={{ justifyContent: 'center', marginTop: '10px', whiteSpace: 'pre-wrap' }}
                      severity="error"
                    >
                      {' '}
                      {errorMessage}
                    </Alert>
                  )}
                  {successMessage && (
                    <Alert sx={{ justifyContent: 'center', marginTop: '10px' }}> {successMessage}</Alert>
                  )}
                </Scrollbar>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
