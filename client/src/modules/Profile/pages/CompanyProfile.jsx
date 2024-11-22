import { Building, Mail, MapPin, Pen, Plus, Trash2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import JobCard from '@/components/JobCard';
import UpdateCompanyProfileDialog from '../components/UpdateCompanyProfileDialog';
import PostJobDialog from '@/modules/Job/components/PostJobDialog';
import { deleteCompany, getJobByCompany } from '@/api';
import Footer from '@/components/Footer';
import { setCompany } from '@/features/companySlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '@/config';




const CompanyProfile = () => {
    const [open, setOpen] = useState(false);
    const [postJobOpen, setPostJobOpen] = useState(false);
    const [jobs, setJobs] = useState([]);
    
    const { company } = useSelector((state) => state.company);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    //Handle delete account for company
    const handleDelete = async () => {
        try {
            const response = await deleteCompany();
            if (response.data.success) {
                dispatch(setCompany(null));
                navigate("/login");
                toast.success(response.data.message || "Your account has been deleted successfully.");
            }
        } catch (error) {
            toast.error(error.response.data.message);
            console.log(error);
        }
    }

    //Fetching jobs posted by company
    const fetchJobs = async () => {
        try {
            const companyId = company._id;
            const response = await getJobByCompany(companyId);

            if (response.data.success) {
                setJobs(response.data.jobs);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    //Displaying fetched jobs
    useEffect(() => {
        fetchJobs();
    }, [company]);

    return (
        <>
            <Navbar />
            <div className='flex max-w-screen'>
                <div className='basis-1/5 mx-auto mt-6 border-r border-gray-200 p-6'>
                    <div className='flex justify-between'>
                        <div className='flex gap-5 items-center justify-evenly w-full'>
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={`${BASE_URL + company?.logo}`} alt="profile" />
                                <AvatarFallback className="font-bold text-2xl">
                                    {company?.companyName?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>

                            <div>
                                <h1 className='font-bold text-lg'>{company?.companyName}</h1>
                            </div>

                            <div>
                                <Button className="text-right" variant="ghost" onClick={() => setOpen(true)}><Pen className='w-5' /></Button>
                            </div>
                        </div>
                    </div>

                    <div className='mt-4 mx-5 flex flex-col text-sm'>
                        <div className='flex items-center gap-4 my-2'>
                            <MapPin />
                            <span>{company?.location}</span>
                        </div>

                        <div className='flex items-center gap-4 my-2'>
                            <Building />
                            <span>{company?.industry}</span>
                        </div>

                        <div className='flex items-center gap-4 my-2'>
                            <Mail />
                            <span>{company?.email}</span>
                        </div>
                    </div>

                    <div className='m-5 flex flex-col gap-2'>
                        <h1 className='font-bold text-xl'>About</h1>
                        <p className='font-medium text-sm text-justify text-gray-600'>
                            {company?.description || "No description provided."}
                        </p>
                    </div>

                    <div className='m-5'>
                        <Button className="bg-red-600 hover:bg-red-700" onClick={handleDelete}><Trash2 className='w-5 mr-2' /> Delete Account</Button>
                    </div>
                </div>

                <div className='basis-4/5 mx-auto mt-6 px-10'>
                    <div className='flex items-center justify-between mx-1 my-5'>
                        <h1 className='font-bold text-2xl my-2 p-1'>Jobs Posted</h1>
                        <Button className="text-sm me-5 bg-[#1f406a] hover:bg[#1B3658]" onClick={() => setPostJobOpen(true)}><Plus className='w-[15px] me-1.5' />Post job</Button>
                    </div>

                    <div className='grid lg:grid-cols-3 gap-10 grid-cols-1 justify-items-center'>
                        {
                            jobs.length > 0 ? (
                                jobs.slice(0, 6).map((job) =>
                                    <JobCard key={job._id} job={job} />)
                            ) : (
                                <p className="text-center text-gray-600">No jobs posted yet.</p>
                            )
                        }
                    </div>
                </div>
            </div>
            <Footer />

            <UpdateCompanyProfileDialog open={open} setOpen={setOpen} />
            <PostJobDialog postJobOpen={postJobOpen} setPostJobOpen={setPostJobOpen} fetchJobs={fetchJobs} />
        </>
    );
};

export default CompanyProfile