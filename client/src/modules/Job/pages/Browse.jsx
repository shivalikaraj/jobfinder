import Navbar from '@/components/Navbar';
import JobCard from '@/components/JobCard';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { useEffect } from 'react';
import { setAllJobs, setSearchedQuery } from '@/features/jobSlice';
import Footer from '@/components/Footer';

const Browse = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const keyword = searchParams.get("keyword");
    const dispatch = useDispatch();

    //Check for keyword
    useEffect(() => {
        if (keyword) {
            dispatch(setSearchedQuery(keyword));
        } else {
            dispatch(setSearchedQuery(''));
        }
    }, [keyword, dispatch]);

    useGetAllJobs(keyword);

    const { allJobs } = useSelector((state) => state.job);

    //Clean up after component change 
    useEffect(() => {
        return () => {
            dispatch(setAllJobs([]));
            dispatch(setSearchedQuery(''));
        };
    }, [dispatch]);

    return (
        <>
            <Navbar />
            <div className='max-w-7xl mx-auto my-10 min-h-screen'>
                <h1 className='font-bold text-xl my-10'>{keyword && keyword?.charAt(0)?.toUpperCase() + keyword?.slice(1) + " jobs (" + allJobs.length + ")"}  </h1>
                <div className='grid grid-cols-1 gap-4 lg:grid-cols-3 md:grid-cols-2 justify-items-center'>
                    {allJobs.length > 0 ? (
                        allJobs.map((job) => <JobCard key={job._id} job={job} />)
                    ) : (
                        <p className='text-gray-600'>No jobs found.</p>
                    )}
                </div>
            </div>
            <Footer />
        </>

    )
}

export default Browse