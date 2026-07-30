import { FiCalendar, FiCheckCircle } from "react-icons/fi";
import type { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import type { JobFormData } from "../validation/job.schema";

interface PublishCardProps {
  register: UseFormRegister<JobFormData>;
  errors: FieldErrors<JobFormData>;
  setValue: UseFormSetValue<JobFormData>;
  watch: UseFormWatch<JobFormData>;
}

export const PublishCard = ({
  register,
  errors,
  setValue,
  watch,
}: PublishCardProps) => {
  const isActive = watch("isActive");

  return (
    <div className="rounded-2xl border border-[#EAEFF7] bg-white p-6 shadow-sm">
      <h3 className="text-base font-bold text-[#05264E] mb-6 flex items-center gap-2 border-b border-[#F0F4FC] pb-3">
        <FiCalendar className="text-[#3C65F5]" /> Application Deadline & Status
      </h3>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Deadline Picker */}
        <div>
          <label className="block text-xs font-semibold text-[#05264E] mb-1.5">
            Application Deadline <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            {...register("deadline")}
            className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] p-3 text-sm font-medium text-[#05264E] outline-none transition focus:border-[#3C65F5] focus:bg-white"
          />
          {errors.deadline && (
            <p className="mt-1 text-xs text-red-500">{errors.deadline.message}</p>
          )}
        </div>

        {/* Active Toggle */}
        <div>
          <label className="block text-xs font-semibold text-[#05264E] mb-1.5">
            Publication Status
          </label>
          <div className="flex items-center gap-3 mt-2">
            <button
              type="button"
              onClick={() => setValue("isActive", true)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition cursor-pointer border ${
                isActive
                  ? "bg-emerald-50 text-emerald-600 border-emerald-300"
                  : "bg-[#F8FAFC] text-gray-500 border-[#EAEFF7]"
              }`}
            >
              <FiCheckCircle /> Active (Public)
            </button>

            <button
              type="button"
              onClick={() => setValue("isActive", false)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition cursor-pointer border ${
                !isActive
                  ? "bg-amber-50 text-amber-600 border-amber-300"
                  : "bg-[#F8FAFC] text-gray-500 border-[#EAEFF7]"
              }`}
            >
              Draft / Closed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
