import JobCard from "./JobCard";
import { useSelector } from "react-redux";

const LatestJobs = () => {
    const { allJobs } = useSelector((state) => state.job)

    return (
        <div className="my-10">
            <h1 className="text-3xl text-center font-bold lg:px-40 py-3 px-10"><span className="text-[#235191]">Latest & Top </span>Job Openings</h1>
            <div className="grid lg:grid-cols-3 lg:px-40 md:grid-cols-2 sm:grid-cols-1 justify-items-center gap-10 mx-auto mt-2">
                {
                    allJobs.length <= 0 ? <span className="text-gray-600">No jobs available.</span> : allJobs.slice(0, 6).map((job) =>
                        <JobCard key={job._id} job={job} />)
                }
            </div>

        </div>
    )
}

export default LatestJobs