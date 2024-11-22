import axios from "axios";
import { BASE_URL } from "../config";

const API = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

//USER API CALLS
export const signupJobSeeker = (authData) => API.post('/api/user/register', authData,);
export const loginJobSeeker = (authData) => API.post('/api/user/login', authData);
export const logoutJobSeeker = () => API.get('/api/user/logout');
export const updateProfile = (profileData) => API.put('/api/user/profile/update', profileData, {
    headers: {
        "Content-Type": "multipart/form-data",
    },
    withCredentials: true
});
export const deleteJobSeeker = () => API.delete('/api/user/delete');


//COMPANY API CALLS
export const signupCompany = (authData) => API.post('/api/company/register', authData);
export const loginCompany = (authData) => API.post('/api/company/login', authData);
export const logoutCompany = () => API.get('/api/company/logout');
export const updateCompanyProfile = (profileData) => API.put('/api/company/profile/update', profileData, {
    headers: {
        "Content-Type": "multipart/form-data",
    },
    withCredentials: true
});
export const getJobByCompany = (companyId) => API.get(`/api/company/${companyId}`);
export const deleteCompany = () => API.delete('/api/company/delete');


//JOB API CALLS
export const postJob = (jobData) => API.post('/api/job/post', jobData);
export const getAllJobs = (keyword = "") =>
    API.get(`/api/job${keyword ? `?keyword=${keyword}` : ""}`);
export const getJobById = (id) => API.get(`/api/job/${id}`);
export const applyJob = (jobId) => API.post(`/api/job/${jobId}/apply`)
export const deleteJob = (jobId) => API.delete(`/api/job/${jobId}/delete`);


//APPLICATION API CALLS
export const getAppliedJobs = () => API.get('/api/application/applied-jobs');
export const getApplicantsByJob = (jobId) => API.get(`/api/application/${jobId}/applicants`);
export const updateApplicationStatus = (id, status) => API.put(`/api/application/status/${id}/update`, { status });






