/* eslint-disable react/prop-types */
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Clock, IndianRupee } from 'lucide-react';
import { Badge } from './ui/badge';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BASE_URL } from '@/config';

const JobCard = ({ job }) => {
    const { company } = useSelector((state) => state.company)
    const isCompany = Boolean(company);
    const isJobOwner = isCompany && company?._id === job?.companyId?._id;

    return (
        <div className='p-8 rounded-md shadow-xl border-gray-100 max-w-[378px] max-h-[400px]' >
            <div className='flex items-center justify-between gap-2 my-2'>
                <Button className="p-6" variant="outline" size="icon">
                    <Avatar>
                        <AvatarImage src={`${BASE_URL + job?.companyId?.logo}`} />
                        <AvatarFallback className="font-bold text-2xl">
                            {job?.companyId?.companyName?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </Button>

                <div>
                    <h1 className='font-medium text-sm'>{job?.companyId?.companyName}</h1>
                    <p className='text-xs text-gray-500'>{job?.companyId?.location}</p>
                </div>

                <div className='flex items-center'>
                    <Clock className='text-gray-500 w-[15px] mx-1' />
                    <p className='text-xs text-gray-500'>{Math.ceil(
                        (Date.now() - new Date(job?.createdAt).getTime()) / (1000 * 60 * 60 * 24)
                    )} days ago</p>
                </div>
            </div>

            <div>
                <h1 className='font-bold text-xl pt-3'>{job.jobTitle}</h1>

                <div className='flex itms-justify gap-2 my-3'>
                    <Badge variant="secondary" className="px-3 py-2 text-gray-700 rounded-md">{job.jobType}</Badge>
                    <Badge variant="secondary" className="px-3 py-2 text-gray-700 rounded-md">{job.location}</Badge>
                </div>

                <p className='text-sm text-gray-600 text-justify my-4'>
                    {job.jobDescription?.length > 150
                        ? `${job.jobDescription.substring(0, 150)} ...`
                        : job.jobDescription}
                </p>
            </div>

            <div className='flex items-center mt-4 justify-between'>
                <p className='flex items-center text-sm font-semibold'><IndianRupee className='w-[16px]' />{job.salary}</p>
                <Link to={`/job/${job._id}`}><Button className="bg-[#274B7A] hover:bg[#1B3658]" >
                    {isCompany ? (isJobOwner ? "View Job" : "Apply Now") : "Apply Now"}
                </Button></Link>
            </div>
        </div>
    )
}

export default JobCard