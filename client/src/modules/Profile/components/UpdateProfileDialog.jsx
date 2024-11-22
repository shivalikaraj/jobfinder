/* eslint-disable react/prop-types */
import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "@/api";
import { toast } from "react-toastify";
import { setUser } from "@/features/authSlice";


const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector((state) => state.auth);

    const dispatch = useDispatch();

    const [input, setInput] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        phone: user?.phone || "",
        bio: user?.bio || "",
        skills: user?.skills?.join(",") || "",
        profile: null,
        resume: null,
    });

    //Handle input change for update profile dialog
    const handleInputChange = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    //Handle file change for update profile dialog
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files?.[0]) {
            setInput({ ...input, [name]: files[0] });

        }
    };

    //Handle update profile submission
    const submitHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("firstName", input.firstName);
        formData.append("lastName", input.lastName);
        formData.append("email", input.email);
        formData.append("phone", input.phone);
        formData.append("bio", input.bio);
        formData.append("skills", input.skills);
        if (input.profile) {
            formData.append("profile", input.profile);
        }
        if (input.resume) {
            formData.append("resume", input.resume);
        }

        try {
            setLoading(true);
            const response = await updateProfile(formData);
            if (response.data.success) {
                dispatch(setUser(response.data.user));
                console.log(user);
                toast.success("Profile updated successfully!");
                setOpen(false);
            } else {
                toast.error(response.message || "Failed to update profile.");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent onInteractOutside={() => setOpen(false)} tabIndex="-1">
                <DialogHeader>
                    <DialogTitle>Update Profile</DialogTitle>
                </DialogHeader>

                <form onSubmit={submitHandler}>
                    <div className="grid gap-4 py-4">
                        {/* First Name */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="firstName" className="text-right me-3">First Name</Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                value={input.firstName}
                                onChange={handleInputChange}
                                className="col-span-3"
                                autoComplete="off"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="lastName" className="text-right me-3">Last Name</Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                value={input.lastName}
                                onChange={handleInputChange}
                                className="col-span-3"
                                autoComplete="off"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right me-3">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                value={input.email}
                                onChange={handleInputChange}
                                className="col-span-3"
                                autoComplete="off"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right me-3">Phone</Label>
                            <Input
                                id="phone"
                                name="phone"
                                value={input.phone}
                                onChange={handleInputChange}
                                className="col-span-3"
                                autoComplete="off"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="bio" className="text-right me-3">Bio</Label>
                            <Textarea
                                id="bio"
                                name="bio"
                                value={input.bio}
                                onChange={handleInputChange}
                                className="col-span-3"
                                autoComplete="off"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="skills" className="text-right me-3">Skills</Label>
                            <Input
                                id="skills"
                                name="skills"
                                value={input.skills}
                                onChange={handleInputChange}
                                className="col-span-3"
                                placeholder="Enter skills, separated by commas"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="profile" className="text-right me-3">Profile</Label>
                            <Input
                                id="profile"
                                type="file"
                                name="profile"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="col-span-3"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="resume" className="text-right me-3">Resume</Label>
                            <Input
                                id="resume"
                                type="file"
                                name="resume"
                                accept="application/pdf"
                                onChange={handleFileChange}
                                className="col-span-3"
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

export default UpdateProfileDialog