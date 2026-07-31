import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { FiX, FiPlus, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import type { JobSeekerProfile, CreateJobSeekerProfileInput } from "../types/jobSeeker.types";
import { useCreateProfileMutation, useUpdateProfileMutation } from "../api/jobSeekerApi";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingProfile?: JobSeekerProfile | null;
}

const EditProfileModal = ({ isOpen, onClose, existingProfile }: EditProfileModalProps) => {
  const [createProfile, { isLoading: isCreating }] = useCreateProfileMutation();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const [skillInput, setSkillInput] = useState("");

  const { register, handleSubmit, control, setValue, watch, reset } =
    useForm<CreateJobSeekerProfileInput>({
      defaultValues: {
        firstName: "",
        lastName: "",
        phone: "",
        headline: "",
        bio: "",
        currentLocation: "",
        yearsOfExperience: 0,
        expectedSalary: 0,
        skills: [],
        education: [],
        experience: [],
      },
    });

  const {
    fields: eduFields,
    append: appendEdu,
    remove: removeEdu,
  } = useFieldArray({
    control,
    name: "education",
  });

  const {
    fields: expFields,
    append: appendExp,
    remove: removeExp,
  } = useFieldArray({
    control,
    name: "experience",
  });

  const currentSkills = watch("skills") || [];

  useEffect(() => {
    if (existingProfile) {
      reset({
        firstName: existingProfile.firstName || "",
        lastName: existingProfile.lastName || "",
        phone: existingProfile.phone || "",
        headline: existingProfile.headline || "",
        bio: existingProfile.bio || "",
        currentLocation: existingProfile.currentLocation || "",
        yearsOfExperience: existingProfile.yearsOfExperience || 0,
        expectedSalary: existingProfile.expectedSalary || 0,
        skills: existingProfile.skills || [],
        education: existingProfile.education || [],
        experience: existingProfile.experience || [],
      });
    }
  }, [existingProfile, reset]);

  if (!isOpen) return null;

  const handleAddSkill = () => {
    if (skillInput.trim() && !currentSkills.includes(skillInput.trim())) {
      setValue("skills", [...currentSkills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setValue(
      "skills",
      currentSkills.filter((s) => s !== skillToRemove)
    );
  };

  const onSubmit = async (rawParams: CreateJobSeekerProfileInput) => {
    try {
      const data = { ...rawParams };

      if (Array.isArray(data.education)) {
        data.education = data.education
          .filter((edu) => edu.institution?.trim() || edu.degree?.trim())
          .map((edu) => ({
            ...edu,
            startDate: edu.startDate || undefined,
            endDate: edu.endDate || undefined,
          }));
      }

      if (Array.isArray(data.experience)) {
        data.experience = data.experience
          .filter((exp) => exp.company?.trim() || exp.designation?.trim())
          .map((exp) => ({
            ...exp,
            startDate: exp.startDate || undefined,
            endDate: exp.endDate || undefined,
          }));
      }

      if (existingProfile) {
        await updateProfile(data).unwrap();
        toast.success("Profile updated successfully!");
      } else {
        await createProfile(data).unwrap();
        toast.success("Profile created successfully!");
      }
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save profile.");
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 md:p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
          <h2 className="text-2xl font-bold text-[#05264E]">
            {existingProfile ? "Edit Job Seeker Profile" : "Create Job Seeker Profile"}
          </h2>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-[#05264E] mb-1">
                First Name
              </label>
              <input
                {...register("firstName", { required: true })}
                placeholder="Rahul"
                className="w-full rounded-xl border border-gray-200 p-3.5 text-sm outline-none focus:border-[#3C65F5]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#05264E] mb-1">
                Last Name
              </label>
              <input
                {...register("lastName", { required: true })}
                placeholder="Singhe"
                className="w-full rounded-xl border border-gray-200 p-3.5 text-sm outline-none focus:border-[#3C65F5]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-[#05264E] mb-1">
                Phone Number
              </label>
              <input
                {...register("phone")}
                placeholder="9876543240"
                className="w-full rounded-xl border border-gray-200 p-3.5 text-sm outline-none focus:border-[#3C65F5]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#05264E] mb-1">
                Current Location
              </label>
              <input
                {...register("currentLocation")}
                placeholder="Mohali"
                className="w-full rounded-xl border border-gray-200 p-3.5 text-sm outline-none focus:border-[#3C65F5]"
              />
            </div>
          </div>

          {/* Headline & Bio */}
          <div>
            <label className="block text-sm font-semibold text-[#05264E] mb-1">
              Headline
            </label>
            <input
              {...register("headline", { required: true })}
              placeholder="Full Stack PYTHON Developer"
              className="w-full rounded-xl border border-gray-200 p-3.5 text-sm outline-none focus:border-[#3C65F5]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#05264E] mb-1">
              Bio / About Me
            </label>
            <textarea
              {...register("bio")}
              rows={3}
              placeholder="Passionate backend developer with 2 years of experience..."
              className="w-full rounded-xl border border-gray-200 p-3.5 text-sm outline-none focus:border-[#3C65F5]"
            />
          </div>

          {/* Experience Years & Expected Salary */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-[#05264E] mb-1">
                Years of Experience
              </label>
              <input
                type="number"
                {...register("yearsOfExperience", { valueAsNumber: true })}
                placeholder="2"
                className="w-full rounded-xl border border-gray-200 p-3.5 text-sm outline-none focus:border-[#3C65F5]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#05264E] mb-1">
                Expected Salary (Annual)
              </label>
              <input
                type="number"
                {...register("expectedSalary", { valueAsNumber: true })}
                placeholder="800000"
                className="w-full rounded-xl border border-gray-200 p-3.5 text-sm outline-none focus:border-[#3C65F5]"
              />
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-semibold text-[#05264E] mb-2">
              Skills
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="Add skill (e.g. React, Node.js)"
                className="flex-1 rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-[#3C65F5]"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="rounded-xl bg-[#3C65F5] px-5 py-3 text-sm font-semibold text-white hover:bg-[#254BD6]"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {currentSkills.map((skill) => (
                <span
                  key={skill}
                  className="flex items-center gap-1.5 rounded-lg bg-[#EBF2FF] px-3 py-1.5 text-xs font-semibold text-[#3C65F5]"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-red-500"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Education Array */}
          <div className="border-t border-gray-100 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#05264E]">Education</h3>
              <button
                type="button"
                onClick={() =>
                  appendEdu({
                    institution: "",
                    degree: "",
                    fieldOfStudy: "",
                    startDate: "",
                    endDate: "",
                    currentlyStudying: false,
                  })
                }
                className="flex items-center gap-1 text-xs font-semibold text-[#3C65F5] hover:underline"
              >
                <FiPlus /> Add Education
              </button>
            </div>

            {eduFields.map((field, idx) => (
              <div
                key={field.id}
                className="relative rounded-2xl border border-gray-200 bg-[#F8FAFC] p-4 mb-3 space-y-3"
              >
                <button
                  type="button"
                  onClick={() => removeEdu(idx)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
                >
                  <FiTrash2 />
                </button>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <input
                    {...register(`education.${idx}.institution` as const)}
                    placeholder="Institution (e.g. ABC University)"
                    className="rounded-xl border border-gray-200 p-2.5 text-sm bg-white outline-none"
                  />
                  <input
                    {...register(`education.${idx}.degree` as const)}
                    placeholder="Degree (e.g. B.Tech)"
                    className="rounded-xl border border-gray-200 p-2.5 text-sm bg-white outline-none"
                  />
                  <input
                    {...register(`education.${idx}.fieldOfStudy` as const)}
                    placeholder="Field of Study (e.g. CS)"
                    className="rounded-xl border border-gray-200 p-2.5 text-sm bg-white outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Start Date</label>
                    <input
                      type="date"
                      {...register(`education.${idx}.startDate` as const)}
                      className="w-full rounded-xl border border-gray-200 p-2.5 text-sm bg-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">End Date</label>
                    <input
                      type="date"
                      {...register(`education.${idx}.endDate` as const)}
                      className="w-full rounded-xl border border-gray-200 p-2.5 text-sm bg-white outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Experience Array */}
          <div className="border-t border-gray-100 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#05264E]">Experience</h3>
              <button
                type="button"
                onClick={() =>
                  appendExp({
                    company: "",
                    designation: "",
                    employmentType: "FULL_TIME",
                    startDate: "",
                    endDate: "",
                    currentlyWorking: false,
                    description: "",
                  })
                }
                className="flex items-center gap-1 text-xs font-semibold text-[#3C65F5] hover:underline"
              >
                <FiPlus /> Add Experience
              </button>
            </div>

            {expFields.map((field, idx) => (
              <div
                key={field.id}
                className="relative rounded-2xl border border-gray-200 bg-[#F8FAFC] p-4 mb-3 space-y-3"
              >
                <button
                  type="button"
                  onClick={() => removeExp(idx)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
                >
                  <FiTrash2 />
                </button>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <input
                    {...register(`experience.${idx}.company` as const)}
                    placeholder="Company (e.g. XYZ Pvt Ltd)"
                    className="rounded-xl border border-gray-200 p-2.5 text-sm bg-white outline-none"
                  />
                  <input
                    {...register(`experience.${idx}.designation` as const)}
                    placeholder="Designation (e.g. Software Engineer)"
                    className="rounded-xl border border-gray-200 p-2.5 text-sm bg-white outline-none"
                  />
                  <input
                    {...register(`experience.${idx}.description` as const)}
                    placeholder="Description snippet..."
                    className="rounded-xl border border-gray-200 p-2.5 text-sm bg-white outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Start Date</label>
                    <input
                      type="date"
                      {...register(`experience.${idx}.startDate` as const)}
                      className="w-full rounded-xl border border-gray-200 p-2.5 text-sm bg-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">End Date</label>
                    <input
                      type="date"
                      {...register(`experience.${idx}.endDate` as const)}
                      className="w-full rounded-xl border border-gray-200 p-2.5 text-sm bg-white outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="border-t border-gray-100 pt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-xl bg-[#3C65F5] px-8 py-3 text-sm font-semibold text-white hover:bg-[#254BD6] disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
