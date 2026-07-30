import { FiUser, FiMail, FiPhone, FiBriefcase, FiMapPin } from "react-icons/fi";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { CreateRecruiterProfileInput } from "../types/recruiter.types";

interface PersonalInformationProps {
  register: UseFormRegister<CreateRecruiterProfileInput>;
  errors: FieldErrors<CreateRecruiterProfileInput>;
  userEmail?: string;
}

const PersonalInformation = ({
  register,
  errors,
  userEmail,
}: PersonalInformationProps) => {
  return (
    <div className="rounded-2xl border border-[#EAEFF7] bg-white p-6 shadow-sm">
      <h3 className="text-base font-bold text-[#05264E] mb-6 flex items-center gap-2 border-b border-[#F0F4FC] pb-3">
        <FiUser className="text-[#3C65F5]" /> Personal & Work Information
      </h3>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* First Name */}
        <div>
          <label className="block text-xs font-semibold text-[#05264E] mb-1.5">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register("firstName")}
            placeholder="John"
            className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] p-3 text-sm font-medium text-[#05264E] placeholder-gray-400 outline-none transition focus:border-[#3C65F5] focus:bg-white"
          />
          {errors.firstName && (
            <p className="mt-1 text-xs text-red-500">
              {errors.firstName.message}
            </p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-xs font-semibold text-[#05264E] mb-1.5">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register("lastName")}
            placeholder="Doe"
            className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] p-3 text-sm font-medium text-[#05264E] placeholder-gray-400 outline-none transition focus:border-[#3C65F5] focus:bg-white"
          />
          {errors.lastName && (
            <p className="mt-1 text-xs text-red-500">
              {errors.lastName.message}
            </p>
          )}
        </div>

        {/* Email (Read Only) */}
        <div>
          <label className="block text-xs font-semibold text-[#05264E] mb-1.5">
            Email Address (Read Only)
          </label>
          <div className="relative flex items-center">
            <FiMail className="absolute left-3.5 text-gray-400" />
            <input
              type="email"
              readOnly
              value={userEmail || "recruiter@company.com"}
              className="w-full rounded-xl border border-[#EAEFF7] bg-gray-100 py-3 pl-10 pr-3 text-sm font-medium text-gray-500 cursor-not-allowed outline-none"
            />
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-xs font-semibold text-[#05264E] mb-1.5">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative flex items-center">
            <FiPhone className="absolute left-3.5 text-gray-400" />
            <input
              {...register("phone")}
              placeholder="9876543210"
              className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] py-3 pl-10 pr-3 text-sm font-medium text-[#05264E] placeholder-gray-400 outline-none transition focus:border-[#3C65F5] focus:bg-white"
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-xs text-red-500">
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* Designation */}
        <div>
          <label className="block text-xs font-semibold text-[#05264E] mb-1.5">
            Designation / Title <span className="text-red-500">*</span>
          </label>
          <div className="relative flex items-center">
            <FiBriefcase className="absolute left-3.5 text-gray-400" />
            <input
              {...register("designation")}
              placeholder="Senior Talent Acquisition Manager"
              className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] py-3 pl-10 pr-3 text-sm font-medium text-[#05264E] placeholder-gray-400 outline-none transition focus:border-[#3C65F5] focus:bg-white"
            />
          </div>
          {errors.designation && (
            <p className="mt-1 text-xs text-red-500">
              {errors.designation.message}
            </p>
          )}
        </div>

        {/* Current Company */}
        <div>
          <label className="block text-xs font-semibold text-[#05264E] mb-1.5">
            Current Company
          </label>
          <input
            {...register("currentCompany")}
            placeholder="TechNova Solutions"
            className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] p-3 text-sm font-medium text-[#05264E] placeholder-gray-400 outline-none transition focus:border-[#3C65F5] focus:bg-white"
          />
        </div>

        {/* Experience */}
        <div>
          <label className="block text-xs font-semibold text-[#05264E] mb-1.5">
            Experience (Years)
          </label>
          <input
            type="number"
            {...register("experience", { valueAsNumber: true })}
            placeholder="5"
            className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] p-3 text-sm font-medium text-[#05264E] placeholder-gray-400 outline-none transition focus:border-[#3C65F5] focus:bg-white"
          />
        </div>

        {/* Current Location */}
        <div>
          <label className="block text-xs font-semibold text-[#05264E] mb-1.5">
            Current Location
          </label>
          <div className="relative flex items-center">
            <FiMapPin className="absolute left-3.5 text-gray-400" />
            <input
              {...register("currentLocation")}
              placeholder="Noida, India"
              className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] py-3 pl-10 pr-3 text-sm font-medium text-[#05264E] placeholder-gray-400 outline-none transition focus:border-[#3C65F5] focus:bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;
