import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import ProfileHeader from "../components/ProfileHeader";
import CompanyLogoUpload from "../components/CompanyLogoUpload";
import PersonalInformation from "../components/PersonalInformation";
import CompanyInformation from "../components/CompanyInformation";
import SocialLinks from "../components/SocialLinks";
import {
  useGetRecruiterProfileQuery,
  useCreateRecruiterProfileMutation,
  useUpdateRecruiterProfileMutation,
} from "../api/recruiterApi";
import { useAppSelector } from "../../../hooks/useAppSelector";
import type { CreateRecruiterProfileInput } from "../types/recruiter.types";

const schema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  designation: z.string().min(2, "Designation is required"),
  currentCompany: z.string().optional(),
  experience: z.number().min(0).optional(),
  currentLocation: z.string().optional(),
  headline: z.string().optional(),
  bio: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  portfolio: z.string().optional(),
  profilePicture: z.string().optional(),
});

const RecruiterProfile = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { data: profile, isLoading: isFetching } = useGetRecruiterProfileQuery();
  const [createProfile, { isLoading: isCreating }] = useCreateRecruiterProfileMutation();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateRecruiterProfileMutation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateRecruiterProfileInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      designation: "",
      currentCompany: "",
      experience: 0,
      currentLocation: "",
      headline: "",
      bio: "",
      linkedin: "",
      github: "",
      portfolio: "",
      profilePicture: "",
    },
  });

  const watchFirstName = watch("firstName");
  const watchLastName = watch("lastName");
  const watchDesignation = watch("designation");
  const watchCurrentCompany = watch("currentCompany");
  const watchProfilePicture = watch("profilePicture");

  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        phone: profile.phone || "",
        designation: profile.designation || "",
        currentCompany: profile.currentCompany || "",
        experience: profile.experience || 0,
        currentLocation: profile.currentLocation || "",
        headline: profile.headline || "",
        bio: profile.bio || "",
        linkedin: profile.linkedin || "",
        github: profile.github || "",
        portfolio: profile.portfolio || "",
        profilePicture: profile.profilePicture || "",
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: CreateRecruiterProfileInput) => {
    try {
      if (profile) {
        await updateProfile(data).unwrap();
        toast.success("Recruiter profile updated successfully!");
      } else {
        await createProfile(data).unwrap();
        toast.success("Recruiter profile created successfully!");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save recruiter profile.");
    }
  };

  const isSubmitting = isCreating || isUpdating;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <ProfileHeader
        firstName={watchFirstName || profile?.firstName}
        lastName={watchLastName || profile?.lastName}
        designation={watchDesignation || profile?.designation}
        currentCompany={watchCurrentCompany || profile?.currentCompany}
        profilePicture={watchProfilePicture || profile?.profilePicture}
      />

      {isFetching ? (
        <div className="flex h-64 items-center justify-center rounded-2xl bg-white border border-[#EAEFF7]">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#3C65F5] border-t-transparent" />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Profile Picture Upload Section */}
          <CompanyLogoUpload
            register={register}
            errors={errors}
            previewUrl={watchProfilePicture || profile?.profilePicture}
          />

          {/* Personal & Work Information */}
          <PersonalInformation
            register={register}
            errors={errors}
            userEmail={user?.email}
          />

          {/* Bio & Headline */}
          <CompanyInformation register={register} errors={errors} />

          {/* Social Links */}
          <SocialLinks register={register} errors={errors} />

          {/* Action Buttons: Save & Cancel */}
          <div className="flex items-center justify-end gap-4 rounded-2xl border border-[#EAEFF7] bg-white p-6 shadow-sm">
            <button
              type="button"
              onClick={() => profile && reset(profile as any)}
              className="rounded-xl border border-[#EAEFF7] bg-white px-6 py-3 text-sm font-semibold text-[#66789C] transition hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[#3C65F5] px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#254BD6] disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default RecruiterProfile;
