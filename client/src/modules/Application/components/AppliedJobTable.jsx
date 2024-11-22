import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useSelector } from 'react-redux';
import { getAppliedJobs } from '@/api';

const AppliedJobTable = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const user = useSelector((state) => state.auth);

  //Fetching all the jobs applied by user 
  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const response = await getAppliedJobs();
        if (response.data.success) {
          setAppliedJobs(response.data.applications);
        }

      } catch (error) {
        console.error("Error fetching applied jobs:", error);
      }
    };
    if (user) fetchAppliedJobs();
  }, [user]);


  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead className="text-center">Job Role</TableHead>
            <TableHead className="text-center">Company</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        
        <TableBody className="text-gray-600">
          {appliedJobs.length <= 0 ? (
            <TableRow className="flex items-center justify-center">
              <TableCell colSpan={4} className="text-center text-gray-600">
                No jobs applied yet.
              </TableCell>
            </TableRow>
          ) : (
            appliedJobs.map((application) => (
              <TableRow key={application._id}>
                <TableCell>{new Date(application.dateSubmitted).toLocaleDateString('en-US').replace(/\//g, '-')}</TableCell>
                <TableCell className="text-center">
                  {application.jobId.jobTitle}
                </TableCell>
                <TableCell className="text-center">
                  {application.jobId.companyId.companyName}
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline" className={
                    application.status === "Pending"
                      ? "text-blue-500"
                      : application.status === "Accepted"
                        ? "text-green-500"
                        : application.status === "Rejected"
                          ? "text-red-500"
                          : ""
                  }>{application.status}</Badge>
                </TableCell>
              </TableRow>
            ))
          )}

        </TableBody>
      </Table>
    </div>
  )
}

export default AppliedJobTable