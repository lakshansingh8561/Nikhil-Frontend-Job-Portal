import { FiBriefcase, FiGlobe, FiMail, FiPhone, FiCalendar, FiUsers, FiMapPin, FiFileText } from "react-icons/fi";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { CompanyFormData } from "../validation/company.schema";

interface CompanyInformationProps {
  register: UseFormRegister<CompanyFormData>;
  errors: FieldErrors<CompanyFormData>;
}

const industries = [
  "Software & IT",
  "Finance & Banking",
  "Recruiting & Staffing",
  "Healthcare & Pharma",
  "E-Commerce & Retail",
  "Marketing & Advertising",
  "Education & EdTech",
  "Construction & Real Estate",
];

const companySizes = [
  "1-10 Employees",
  "11-50 Employees",
  "50-100 Employees",
  "100-500 Employees",
  "500-1000 Employees",
  "1000+ Employees",
];

export const CompanyInformation = ({
  register,
  errors,
}: CompanyInformationProps) => {
  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="rounded-2xl border border-[#EAEFF7] bg-white p-6 shadow-sm">
        <h3 className="text-base font-bold text-[#05264E] mb-6 flex items-center gap-2 border-b border-[#F0F4FC] pb-3">
          <FiBriefcase className="text-[#3C65F5]" /> Basic Company Information
        </h3>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Company Name */}
          <div className="lg:col-span-2">
            <label className="block text-xs font-semibold text-[#05264E] mb-1.5">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register("companyName")}
              placeholder="e.g. TechNova Solutions Inc."
              className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] p-3 text-sm font-medium text-[#05264E] placeholder-gray-400 outline-none transition focus:border-[#3C65F5] focus:bg-white"
            />
            {errors.companyName && (
              <p className="mt-1 text-xs text-red-500">{errors.companyName.message}</p>
            )}
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-xs font-semibold text-[#05264E] mb-1.5">
              Company Tagline
            </label>
            <input
              {...register("tagline")}
              placeholder="e.g. Innovating Enterprise Software"
              className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] p-3 text-sm font-medium text-[#05264E] placeholder-gray-400 outline-none transition focus:border-[#3C65F5] focus:bg-white"
            />
          </div>

          {/* Industry */}
          <div>
            <label className="block text-xs font-semibold text-[#05264E] mb-1.5">
              Industry <span className="text-red-500">*</span>
            </label>
            <select
              {...register("industry")}
              className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] p-3 text-sm font-medium text-[#05264E] outline-none transition focus:border-[#3C65F5] focus:bg-white"
            >
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
            {errors.industry && (
              <p className="mt-1 text-xs text-red-500">{errors.industry.message}</p>
            )}
          </div>

          {/* Company Size */}
          <div>
            <label className="block text-xs font-semibold text-[#05264E] mb-1.5">
              Company Size <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center">
              <FiUsers className="absolute left-3.5 text-gray-400" />
              <select
                {...register("companySize")}
                className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] py-3 pl-10 pr-3 text-sm font-medium text-[#05264E] outline-none transition focus:border-[#3C65F5] focus:bg-white"
              >
                {companySizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            {errors.companySize && (
              <p className="mt-1 text-xs text-red-500">{errors.companySize.message}</p>
            )}
          </div>

          {/* Founded Year */}
          <div>
            <label className="block text-xs font-semibold text-[#05264E] mb-1.5">
              Founded Year
            </label>
            <div className="relative flex items-center">
              <FiCalendar className="absolute left-3.5 text-gray-400" />
              <input
                type="number"
                {...register("foundedYear", { valueAsNumber: true })}
                placeholder="2018"
                className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] py-3 pl-10 pr-3 text-sm font-medium text-[#05264E] outline-none transition focus:border-[#3C65F5] focus:bg-white"
              />
            </div>
          </div>

          {/* Website */}
          <div>
            <label className="block text-xs font-semibold text-[#05264E] mb-1.5">
              Official Website
            </label>
            <div className="relative flex items-center">
              <FiGlobe className="absolute left-3.5 text-gray-400" />
              <input
                {...register("website")}
                placeholder="https://technova.com"
                className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] py-3 pl-10 pr-3 text-sm font-medium text-[#05264E] outline-none transition focus:border-[#3C65F5] focus:bg-white"
              />
            </div>
          </div>

          {/* Official Email */}
          <div>
            <label className="block text-xs font-semibold text-[#05264E] mb-1.5">
              Official Email
            </label>
            <div className="relative flex items-center">
              <FiMail className="absolute left-3.5 text-gray-400" />
              <input
                type="email"
                {...register("email")}
                placeholder="contact@technova.com"
                className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] py-3 pl-10 pr-3 text-sm font-medium text-[#05264E] outline-none transition focus:border-[#3C65F5] focus:bg-white"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-semibold text-[#05264E] mb-1.5">
              Phone Number
            </label>
            <div className="relative flex items-center">
              <FiPhone className="absolute left-3.5 text-gray-400" />
              <input
                {...register("phone")}
                placeholder="+1 (555) 000-1234"
                className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] py-3 pl-10 pr-3 text-sm font-medium text-[#05264E] outline-none transition focus:border-[#3C65F5] focus:bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Location Details */}
      <div className="rounded-2xl border border-[#EAEFF7] bg-white p-6 shadow-sm">
        <h3 className="text-base font-bold text-[#05264E] mb-6 flex items-center gap-2 border-b border-[#F0F4FC] pb-3">
          <FiMapPin className="text-[#3C65F5]" /> Location & Address
        </h3>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Country */}
          <div>
            <label className="block text-xs font-semibold text-[#05264E] mb-1.5">
              Country
            </label>
            <input
              {...register("country")}
              placeholder="United States"
              className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] p-3 text-sm font-medium text-[#05264E] outline-none transition focus:border-[#3C65F5] focus:bg-white"
            />
          </div>

          {/* State */}
          <div>
            <label className="block text-xs font-semibold text-[#05264E] mb-1.5">
              State / Region
            </label>
            <input
              {...register("state")}
              placeholder="New York"
              className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] p-3 text-sm font-medium text-[#05264E] outline-none transition focus:border-[#3C65F5] focus:bg-white"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-xs font-semibold text-[#05264E] mb-1.5">
              City
            </label>
            <input
              {...register("city")}
              placeholder="New York City"
              className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] p-3 text-sm font-medium text-[#05264E] outline-none transition focus:border-[#3C65F5] focus:bg-[#FFFFFF]"
            />
          </div>

          {/* Headquarters */}
          <div>
            <label className="block text-xs font-semibold text-[#05264E] mb-1.5">
              Headquarters Location
            </label>
            <input
              {...register("headquarters")}
              placeholder="Manhattan, NY"
              className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] p-3 text-sm font-medium text-[#05264E] outline-none transition focus:border-[#3C65F5] focus:bg-white"
            />
          </div>

          {/* Complete Address */}
          <div className="lg:col-span-4">
            <label className="block text-xs font-semibold text-[#05264E] mb-1.5">
              Complete Street Address
            </label>
            <input
              {...register("address")}
              placeholder="Suite 400, 100 Broadway, NY 10005"
              className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] p-3 text-sm font-medium text-[#05264E] outline-none transition focus:border-[#3C65F5] focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* About Company, Mission, Vision */}
      <div className="rounded-2xl border border-[#EAEFF7] bg-white p-6 shadow-sm">
        <h3 className="text-base font-bold text-[#05264E] mb-6 flex items-center gap-2 border-b border-[#F0F4FC] pb-3">
          <FiFileText className="text-[#3C65F5]" /> About, Mission & Vision
        </h3>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-[#05264E] mb-1.5">
              Company Overview / About Us
            </label>
            <textarea
              {...register("description")}
              rows={4}
              placeholder="Detailed description of your company, culture, values, and offerings..."
              className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] p-3.5 text-sm font-medium text-[#05264E] outline-none transition focus:border-[#3C65F5] focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-[#05264E] mb-1.5">
                Mission Statement
              </label>
              <textarea
                {...register("mission")}
                rows={3}
                placeholder="Empower businesses with state-of-the-art tech..."
                className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] p-3 text-sm font-medium text-[#05264E] outline-none transition focus:border-[#3C65F5] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#05264E] mb-1.5">
                Vision Statement
              </label>
              <textarea
                {...register("vision")}
                rows={3}
                placeholder="Be the global leader in digital transformation..."
                className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] p-3 text-sm font-medium text-[#05264E] outline-none transition focus:border-[#3C65F5] focus:bg-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
