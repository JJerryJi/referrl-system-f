export function validateJobPostForm(formData){
    const errors = {};

    // Validate job_name (example: should not be empty)
    if (!formData.job_name.trim()) {
      errors.job_name = 'Job Name is required';
    }

    // Validate job_company (example: should not be empty)
    if (!formData.job_company.trim()) {
      errors.job_company = 'Company Name is required';
    }

    // Validate job_requirement (example: should not be empty)
    if (!formData.job_requirement.trim()) {
      errors.job_requirement = 'Job Requirement is required';
    }

    // Validate question (example: should not be empty)
    if (!formData.job_question.trim()) {
      errors.job_question = 'Job Question is required';
    }

    // Validate job_description (example: should not be empty)
    if (!formData.job_description.trim()) {
      errors.job_description = 'Job Description is required';
    }

    return errors;
  };