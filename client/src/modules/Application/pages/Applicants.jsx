import { getApplicantsByJob, updateApplicationStatus } from "@/api"
import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BASE_URL } from "@/config"
import { MoreHorizontal } from "lucide-react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"

const status = ["Accept", "Reject"]
const Applicants = () => {
    const params = useParams();
    const jobId = params.id;

    const [applicants, setApplicants] = useState([]);

    //Fetching appplicants who has applied for job
    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const response = await getApplicantsByJob(jobId);
                if (response.data.success) {
                    setApplicants(response.data.applications);
                }
            } catch (error) {
                toast.error(error.response.data.message)
            }
        }
        fetchApplicants();
    }, [jobId])

    //Handle application status update for the applicant
    const statusHandler = async (id, status) => {
        try {
            const response = await updateApplicationStatus(id, status);
            if (response.data.success) {
                toast.success(response.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    return (
        <>
            <Navbar />
            <div className="max-w-7xl mx-auto mt-10 min-h-screen" >
                <h1 className="mb-5 font-bold text-lg">Applicants({applicants.length})</h1>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>FullName</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Resume</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody className=" text-gray-600">
                        {
                            applicants.length <= 0 ? (
                                <TableRow>
                                    <TableCell colSpan="6" className="text-center">
                                        No applicants found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                applicants.map((applicant) => (
                                    <TableRow key={applicant._id}>
                                        <TableCell>{`${applicant.userId.firstName} ${applicant.userId.lastName}`}</TableCell>
                                        <TableCell>{applicant.userId.email}</TableCell>
                                        <TableCell>{applicant.userId.phone}</TableCell>
                                        <TableCell>
                                            {
                                                applicant.userId.resume ? (
                                                    <a target="blank" href={`${BASE_URL + applicant.userId.resume}`} className='text-blue-500 w-full hover:underline cursor-pointer'>View Resume</a>
                                                ) : (
                                                    <span>NA</span>
                                                )
                                            }

                                        </TableCell>
                                        <TableCell>
                                            {new Date(applicant.createdAt).toLocaleDateString()} {/* Format date */}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Popover>
                                                <PopoverTrigger>
                                                    <MoreHorizontal />
                                                </PopoverTrigger>
                                                <PopoverContent className="w-30 flex flex-col gap-2 items-start">
                                                    {status.map((status, index) => (
                                                        <div onClick={() => statusHandler(applicant._id, status)} key={index} className="px-3 cursor-pointer">
                                                            <span
                                                                className={
                                                                    status === "Accept"
                                                                        ? "text-green-500"
                                                                        : status === "Reject"
                                                                            ? "text-red-500"
                                                                            : ""
                                                                }
                                                            >
                                                                {status}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </PopoverContent>
                                            </Popover>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                    </TableBody>
                </Table>
            </div>
            <Footer />
        </>
    )
}

export default Applicants