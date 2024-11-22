import { getAllJobs } from "@/api"
import { setAllJobs } from "@/features/jobSlice";
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const { searchedQuery } = useSelector((state) => state.job);

    //Fetching all the jobs in the database or as per search query 
    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                const response = await getAllJobs(searchedQuery);
                if (response.data.success) {
                    if (searchedQuery && response.data.jobs.length === 0) {
                        dispatch(setAllJobs([]));
                    } else {
                        dispatch(setAllJobs(response.data.jobs));
                    }
                }
            } catch (error) {
                console.log(error)
                dispatch(setAllJobs([]));
            }
        }
        fetchAllJobs();
    }, [searchedQuery, dispatch])
}

export default useGetAllJobs