import Navbar from "@/components/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Briefcase, Building, Clock, Eye, IndianRupee, Mail, MapPin } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { applyJob, deleteJob, getJobById } from "@/api";
import { setSingleJob } from "@/features/jobSlice";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";
import Footer from "@/components/Footer";
import { BASE_URL } from "@/config";


const JobDescription = () => {
  const params = useParams();
  const jobId = params.id;

  const { singleJob } = useSelector((state) => state.job);
  const { user } = useSelector((state) => state.auth);
  const { company } = useSelector((state) => state.company);

  const isJobOwner = company?._id === singleJob?.companyId?._id;
  const isApplied = singleJob?.applications?.some((application) => application.userId === user?._id) || false;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  //Handle apply job button
  const handleApply = async () => {
    if (!user && !company) {
      toast.error("Please log in to apply for this job.");
      return;
    }

    if (company) {
      if (!isJobOwner) {
        toast.error("Companies cannot apply to jobs.");
      }
      else {
        //Handle delete job button if logged in user is job owner
        try {
          const response = await deleteJob(jobId);
          if (response.data.success) {
            dispatch(setSingleJob(null));
            navigate("/company-profile");
            toast.success(response.data.message)
          }
        } catch (error) {
          console.log(error.response.data.message);
          toast.error(error.response.data.message)
        }
      }
      return;
    }

    try {
      const response = await applyJob(jobId);
      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  //Fetching job by jobId for job description
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await getJobById(jobId);
        if (response.data.success) {
          dispatch(setSingleJob(response.data.job));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchJob();
  }, [jobId, dispatch]);

  return (
    <>
      <Navbar />
      <div className="flex w-screen px-20 min-h-screen">
        <div className="basic-3/5 max-w-7xl mx-auto my-10 px-20 border-r border-gray-200">
          <div className="flex justify-between my-5 sm:flex-col sm:gap-3">
            <div>
              <h1 className="font-semibold text-2xl">{singleJob?.jobTitle}</h1>
            </div>

            <div className=" flex items-center gap-4">
              {
                company && (
                  <Button onClick={() => navigate(`/job/${jobId}/applicants`)} className="bg-[#274B7A] hover:bg[#1B3658]">
                    <Eye className="w-[20px] me-2" />
                    <p>View applicants</p>
                  </Button>
                )

              }
              <Button
                disabled={isApplied}
                onClick={handleApply}
                className={`rounded-lg ${isJobOwner
                  ? "bg-red-600 hover:bg-red-700"
                  : isApplied || company
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-[#274B7A] hover:bg[#1B3658]"
                  }`}
              >
                {company
                  ? isJobOwner
                    ? "Delete Job"
                    : "Apply Now"
                  : isApplied
                    ? "Applied"
                    : "Apply Now"}
              </Button>
            </div>
          </div>

          <div className="flex justify-between">
            <div className="flex gap-5 my-3">
              <Badge
                variant="outline"
                className="flex gap-2 text-gray-700 text-md px-3 py-2 rounded-xl"
              >
                <MapPin />
                {singleJob?.location}
              </Badge>

              <Badge
                variant="outline"
                className="flex gap-2 text-gray-700 text-md px-3 py-2 rounded-xl"
              >
                <Briefcase />
                {singleJob?.jobType}
              </Badge>

              <Badge
                variant="outline"
                className="flex gap-2 text-gray-700 text-md px-3 py-2 rounded-xl"
              >
                <IndianRupee />
                {singleJob?.salary}
              </Badge>
            </div>

            <div className="flex items-center me-5">
              <Clock className="text-gray-500 mx-1" />
              <p className="text-md text-gray-500">
                {Math.ceil(
                  (Date.now() - new Date(singleJob?.createdAt).getTime()) /
                  (1000 * 60 * 60 * 24)
                )}{" "}
                days ago
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t pt-5 mt-6">
            <h1 className="font-bold ">Description: </h1>
            <p className="font-normal text-gray-600 text-justify">
              {singleJob?.jobDescription}
            </p>
            <h1 className="font-bold">Requirement: </h1>
            {singleJob?.requirement ? (
              <ul className="list-disc list-inside text-gray-600">
                {singleJob.requirement.split("\n").map((req, index) => (
                  <li key={index}>{req.trim()}</li>
                ))}
              </ul>
            ) : (
              <p className="font-normal text-gray-600">No specific requirements provided.</p>
            )}
          </div>
        </div>

        <div className='basis-2/5 mx-auto mt-6  p-8'>
          <div className='flex justify-between'>
            <div className='flex gap-5 items-center w-full'>
              <Avatar className="h-12 w-12">
                <AvatarImage src={`${BASE_URL + singleJob?.companyId?.logo}`} alt="profile" />
                <AvatarFallback className="font-bold text-2xl">
                  {singleJob?.companyId?.companyName?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div>
                <h1 className='font-bold text-lg'>{singleJob?.companyId?.companyName}</h1>
              </div>
            </div>
          </div>

          <div className='my-4 mx-2 flex flex-col gap-2  text-gray-700 text-md'>
            <div className='flex items-center gap-4'>
              <MapPin className="w-4" />
              <span>{singleJob?.companyId?.location}</span>
            </div>

            <div className='flex items-center gap-4 '>
              <Building className="w-4" />
              <span>{singleJob?.companyId?.industry}</span>
            </div>

            <div className='flex items-center gap-4'>
              <Mail className="w-4" />
              <span>{singleJob?.companyId?.email}</span>
            </div>
          </div>

          <div className='flex flex-col gap-2 '>
            <h1 className='font-bold text-md'>About</h1>
            <p className='font-medium text-sm text-justify  text-gray-600'>
              {singleJob?.companyId?.description || "No description provided."}
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default JobDescription