import { Contact, Mail, Pen, Trash2 } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import UpdateProfileDialog from '../components/UpdateProfileDialog'
import { useDispatch, useSelector } from "react-redux";
import Footer from '@/components/Footer'
import { deleteJobSeeker } from '@/api'
import { setUser } from '@/features/authSlice'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { BASE_URL } from '@/config'
import AppliedJobTable from '@/modules/Application/components/AppliedJobTable'


const Profile = () => {
    const [open, setOpen] = useState(false);

    const { user } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    //Handle delete account button 
    const handleDelete = async () => {
        try {
            const response = await deleteJobSeeker();
            if (response.data.success) {
                dispatch(setUser(null));
                navigate("/login");
                toast.success(response.data.message || "Your account has been deleted successfully.");
            }
        } catch (error) {
            toast.error(error.response.data.message);
            console.log(error);
        }
    }


    return (
        <div>
            <Navbar />
            <div className='flex max-w-screen'>
                <div className='basis-1/5 mx-auto mt-6 border-r border-gray-200 py-8'>
                    <div className='flex justify-between'>
                        <div className='flex gap-5 items-center justify-evenly w-full'>
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={`${BASE_URL + user?.profile}`} alt="profile" />
                                <AvatarFallback className="font-bold text-xl">
                                    {user?.firstName?.charAt(0).toUpperCase()}{user?.lastName?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>

                            <div>
                                <h1 className='font-medium text-md'>{user?.firstName + " " + user?.lastName}</h1>
                            </div>
                            <div >
                                <Button className="text-right" variant="ghost" onClick={() => setOpen(true)}><Pen className='w-5' /></Button>
                            </div>
                        </div>

                    </div>
                    <div className='mt-7 mx-5 flex flex-col gap-2 text-sm'>
                        <div className='flex items-center gap-4 my-4'>
                            <Mail />
                            <span>{user?.email}</span>
                        </div>
                        <div className='flex items-center gap-4'>
                            <Contact />
                            <span>{user?.phone}</span>
                        </div>
                        <div className='my-5'>
                            <h1 className='font-medium py-2'>Skills</h1>
                            <div className='flex item-center gap-2 py-1'>
                                {
                                    user?.skills.length != 0 ? user?.skills.map((items, index) => <Badge key={index} variant="secondary">{items}</Badge>) : <span> NA</span>
                                }
                            </div>
                        </div>
                        <div className='grid w-full max-w-sm items-center gap-1.5'>
                            <h1 className='font-medium'>Resume</h1>
                            {
                                user?.resume && user.resume !== "" ? <a target="blank" href={`${BASE_URL + user?.resume}`} className='text-blue-500 w-full hover:underline cursor-pointer'>View Resume</a> : <span>NA</span>
                            }
                        </div>
                        <div className='mt-8'>
                            <Button className="bg-red-600 hover:bg-red-700" onClick={handleDelete}><Trash2 className='w-5 mr-2' /> Delete Account</Button>
                        </div>

                    </div>
                </div>
                <div className='basis-3/5 mx-auto mt-6 px-20'>
                    <h1 className='font-bold text-lg my-2 p-1'>Applied Jobs</h1>
                    <AppliedJobTable />
                </div>
            </div>
            <Footer />

            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    )
}

export default Profile