export function validateJobPostForm(formData) {
  const errors = {};

  // Validate job_name 
  const jobNameValidator = /^[a-zA-Z0-9\s-@_]{15,35}$/;
  if (!formData.job_name.trim()) {
    errors.job_name = 'Job Name is required';
  }else if(!jobNameValidator.test(formData.job_name)) {
    errors.job_name = 'Job Name should be 15-35 characters long and may only contain letters, numbers, spaces, and hyphens.';
  }

  // Validate job_company 
  const jobCompanyValidator = /^[a-zA-Z0-9\s\-()_[\]!@]{3,64}$/;
  if (!formData.job_company.trim()) {
    errors.job_company = 'Company Name is required';
  } else if (!jobCompanyValidator.test(formData.job_company)) {
    errors.job_company = 'Company Name should be 3-40 characters, including letters, numbers, spaces, and some special symbols';
  }
  
  if (!formData.job_requirement.trim()) {
    errors.job_requirement = 'Job Requirement is required';
  } else if (formData.job_requirement.trim().length < 10 || formData.job_requirement.trim().length > 1000) {
    errors.job_requirement = 'Job Requirement should be between 10 and 1000 characters.';
  }    

  // Validate question 
  if (!formData.job_question.trim()) {
    errors.job_question = 'Job Question is required';
  }

  if (!formData.job_description.trim()) {
    errors.job_description = 'Job Description is required';
  } else if (formData.job_description.trim().length < 10 || formData.job_description.trim().length > 1000) {
    errors.job_description = 'Job Description should be between 10 and 1000 characters.';
  }    
  // console.log(errors);
  return errors;
};