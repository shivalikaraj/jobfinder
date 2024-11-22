import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { postJob } from "@/api";
import { toast } from "react-toastify";

// eslint-disable-next-line react/prop-types
const PostJobDialog = ({ postJobOpen, setPostJobOpen, fetchJobs }) => {
    const [loading, setLoading] = useState(false);
    const [jobData, setJobData] = useState({
        jobTitle: "",
        jobType: "",
        location: "",
        salary: "",
        jobDescription: "",
        requirement: "",
    });

    //Handle input change for post job dialog
    const handleInputChange = (e) => {
        setJobData({ ...jobData, [e.target.name]: e.target.value });
    };

    //Handle submission for post job dialog
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const response = await postJob(jobData);
            if (response.data.success) {
                toast.success("Job posted successfully!");
                setPostJobOpen(false);
                setJobData({
                    jobTitle: "",
                    jobType: "",
                    location: "",
                    salary: "",
                    jobDescription: "",
                    requirement: "",
                });
                fetchJobs();
            } else {
                toast.error(response.message || "Failed to post a new job.")
            }
        } catch (error) {
            console.error(error);
            toast.error(error.data.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={postJobOpen} onOpenChange={setPostJobOpen}>
            <DialogContent onInteractOutside={() => setPostJobOpen(false)} tabIndex="-1">
                <DialogHeader>
                    <DialogTitle>Post a New Job</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="jobTitle" className="text-right me-3">Job Title</Label>
                            <Input
                                id="jobTitle"
                                name="jobTitle"
                                value={jobData.jobTitle}
                                onChange={handleInputChange}
                                className="col-span-3"
                                autoComplete="off"
                                placeholder="Enter the job title"

                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="jobType" className="text-right me-3">Job Type</Label>
                            <Input
                                id="jobType"
                                name="jobType"
                                value={jobData.jobType}
                                onChange={handleInputChange}
                                className="col-span-3"
                                autoComplete="off"
                                placeholder="Enter the job type (e.g., Full-time, Part-time)"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="location" className="text-right me-3">Work Location</Label>
                            <Input
                                id="location"
                                name="location"
                                value={jobData.location}
                                onChange={handleInputChange}
                                className="col-span-3"
                                autoComplete="off"
                                placeholder="Enter the work location (e.g., Remote, Hybrid, Onsite)"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="salary" className="text-right me-3">Salary</Label>
                            <Input
                                id="salary"
                                name="salary"
                                value={jobData.salary}
                                onChange={handleInputChange}
                                className="col-span-3"
                                autoComplete="off"
                                placeholder="Enter the salary range"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="jobDescription" className="text-right me-3">Description</Label>
                            <Textarea
                                id="jobDescription"
                                name="jobDescription"
                                value={jobData.jobDescription}
                                onChange={handleInputChange}
                                className="col-span-3"
                                placeholder="Describe the job responsibilities and tasks"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="requirement" className="text-right me-3">Requirement</Label>
                            <Textarea
                                id="requirement"
                                name="requirement"
                                value={jobData.requirement}
                                onChange={handleInputChange}
                                className="col-span-3"
                                placeholder="List the qualifications and skills required for the job"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        {loading ? (
                            <Button className="w-full my-4">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            </Button>
                        ) : (
                            <Button type="submit" className="w-full my-4">Save Changes</Button>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default PostJobDialog