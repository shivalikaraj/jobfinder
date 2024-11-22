import Footer from '@/components/Footer'
import JobCard from '@/components/JobCard'
import JobFilters from '@/components/JobFilters'
import Navbar from '@/components/Navbar'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const Jobs = () => {
  useGetAllJobs();
  const { allJobs, searchedQuery } = useSelector((state) => state.job);
  const [jobs, setJobs] = useState(allJobs);

  //Display jobs as per filter
  useEffect(() => {
    if (searchedQuery) {
      const filteredJobs = allJobs.filter((job) => {
        return job.companyId.industry.toLowerCase().includes(searchedQuery.toLowerCase()) ||
          job.jobType.toLowerCase().includes(searchedQuery.toLowerCase()) ||
          job.location.toLowerCase().includes(searchedQuery.toLowerCase())
      })
      setJobs(filteredJobs);
    } else {
      setJobs(allJobs);
    }
  }, [allJobs, searchedQuery])

  return (
    <>
      <Navbar />
      <div className='mx-auto flex w-screen px-10'>
        <div className='basic-1/5'>
          <JobFilters />
        </div>

        <div className='grid lg:grid-cols-3 gap-10 my-10 px-5 grid-cols-1'>
          {
            jobs.length <= 0 ?
              <span className='text-gray-600'>No jobs available</span> :
              jobs.map((job) => <JobCard key={job._id} job={job} />)
          }
        </div>

      </div>
      <Footer />
    </>
  )
}

export default Jobs