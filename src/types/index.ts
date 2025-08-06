export interface JobDetailsObj {
    job_id: string,
    job_title: string,
    job_employment_type: string,
    employer_name: string,
    employer_logo: string|null,
    company: {
        name: string,
        address: string
    }
    job_description: string,
    job_publisher: string,
    job_apply_link: string,
    job_location: string,
    job_is_remote: boolean,
}
export interface JobCardObj {
    job_id: string,
    job_title: string,
    job_description: string,
    job_employment_type: string,
    employer_name: string,
    employer_logo: string|null,
    job_location: string,
    job_is_remote: boolean,
}