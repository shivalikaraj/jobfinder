import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setCompany } from "@/features/companySlice";
import { updateCompanyProfile } from "@/api";

// eslint-disable-next-line react/prop-types
const UpdateCompanyProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const { company } = useSelector((state) => state.company);

    const dispatch = useDispatch();

    const [input, setInput] = useState({
        companyName: company?.companyName || "",
        industry: company?.industry || "",
        location: company?.location || "",
        email: company?.email || "",
        phone: company?.phone || "",
        about: company?.description || "",
        logo: null,
    });

    //Handle input change for profile dialog
    const handleInputChange = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    //Handle file change for profile dialog
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
        formData.append("companyName", input.companyName);
        formData.append("industry", input.industry);
        formData.append("location", input.location);
        formData.append("email", input.email);
        formData.append("phone", input.phone);
        formData.append("description", input.about);
        if (input.logo) {
            formData.append("logo", input.logo);
        }

        try {
            setLoading(true);
            const response = await updateCompanyProfile(formData);
            if (response.data.success) {
                dispatch(setCompany(response.data.company));
                toast.success("Company profile updated successfully!");
                setOpen(false);
            } else {
                toast.error(response.message || "Failed to update company profile.");
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
                    <DialogTitle>Update Company Profile</DialogTitle>
                </DialogHeader>

                <form onSubmit={submitHandler}>
                    <div className="grid gap-4 py-4">
                        {/* Company Name */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="companyName" className="text-right me-3">Company Name</Label>
                            <Input
                                id="companyName"
                                name="companyName"
                                value={input.companyName}
                                onChange={handleInputChange}
                                className="col-span-3"
                                autoComplete="off"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="industry" className="text-right me-3">Industry</Label>
                            <Input
                                id="industry"
                                name="industry"
                                value={input.industry}
                                onChange={handleInputChange}
                                className="col-span-3"
                                autoComplete="off"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="location" className="text-right me-3">Location</Label>
                            <Input
                                id="location"
                                name="location"
                                value={input.location}
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
                            <Label htmlFor="about" className="text-right me-3">About</Label>
                            <Textarea
                                id="about"
                                name="about"
                                value={input.about}
                                onChange={handleInputChange}
                                className="col-span-3"
                                autoComplete="off"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="logo" className="text-right me-3">Logo</Label>
                            <Input
                                id="logo"
                                type="file"
                                name="logo"
                                accept="image/*"
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

export default UpdateCompanyProfileDialog