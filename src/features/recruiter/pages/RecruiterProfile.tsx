import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FiZap } from "react-icons/fi";
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
import { useGetCurrentRecruiterPlanQuery } from "../../membership/api/membershipApi";
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
  const { data: recSub } = useGetCurrentRecruiterPlanQuery();

  const recSubscription = recSub?.subscription;
  const recHasActiveSub = Boolean(recSub?.hasActiveSubscription && recSubscription?.status === "ACTIVE");
  const recDaysRemaining = recSubscription?.endDate
    ? Math.max(0, Math.ceil((new Date(recSubscription.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

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

      {/* Recruiter Membership Status & Active Days Widget */}
      <div className="rounded-3xl border border-[#EAEFF7] bg-white p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 shrink-0 border border-amber-100 shadow-2xs">
            <FiZap className="text-2xl fill-yellow-400" />
          </div>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#66789C]">
              Recruiter Membership Status
            </span>
            <h3 className="text-xl font-black text-[#05264E] mt-0.5">
              {recSub?.subscription?.planName || recSub?.plan?.name || "Free Tier"}
            </h3>
            {recHasActiveSub ? (
              <p className="text-xs font-bold text-emerald-600 mt-0.5">
                {recDaysRemaining} Active Days Remaining ({recSub?.activeJobsCount || 0} / {recSub?.maxActiveJobs || 3} Jobs Posted)
              </p>
            ) : (
              <p className="text-xs font-medium text-gray-400 mt-0.5">
                Free Tier ({recSub?.activeJobsCount || 0} / 3 Jobs Posted)
              </p>
            )}
          </div>
        </div>

        <Link
          to="/recruiter/membership"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#1D4ED8] px-6 py-3 text-xs font-extrabold text-white hover:bg-[#1E40AF] transition shadow-md shrink-0 cursor-pointer"
        >
          {recHasActiveSub ? "Manage Plan" : "Upgrade Plan"}
        </Link>
      </div>

      {isFetching ? (
        <div className="flex h-64 items-center justify-center rounded-2xl bg-white border border-[#EAEFF7]">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#1D4ED8] border-t-transparent" />
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
              className="rounded-xl border border-[#EAEFF7] bg-white px-6 py-3 text-sm font-semibold text-[#66789C] transition hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[#1D4ED8] px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#1E40AF] disabled:opacity-50 cursor-pointer"
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
