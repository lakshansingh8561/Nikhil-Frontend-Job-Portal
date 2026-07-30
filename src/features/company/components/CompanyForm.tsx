import type { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import type { CompanyFormData } from "../validation/company.schema";
import { CompanyLogoUpload } from "./CompanyLogoUpload";
import { CompanyInformation } from "./CompanyInformation";
import { CompanySocialLinks } from "./CompanySocialLinks";
import { CompanyGallery } from "./CompanyGallery";

interface CompanyFormProps {
  register: UseFormRegister<CompanyFormData>;
  errors: FieldErrors<CompanyFormData>;
  setValue: UseFormSetValue<CompanyFormData>;
  watch: UseFormWatch<CompanyFormData>;
  officeImages: string[];
  onAddOfficeImage: (url: string) => void;
  onRemoveOfficeImage: (index: number) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  onCancel?: () => void;
}

export const CompanyForm = ({
  register,
  errors,
  setValue,
  watch,
  officeImages,
  onAddOfficeImage,
  onRemoveOfficeImage,
  onSubmit,
  isSubmitting,
  onCancel,
}: CompanyFormProps) => {
  const watchLogo = watch("logo");
  const watchCover = watch("coverImage");

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Branding Assets (Logo & Cover) */}
      <CompanyLogoUpload
        register={register}
        errors={errors}
        setValue={setValue}
        logoUrl={watchLogo}
        coverUrl={watchCover}
      />

      {/* Information, Location, Bio */}
      <CompanyInformation register={register} errors={errors} />

      {/* Social Links */}
      <CompanySocialLinks register={register} errors={errors} />

      {/* Media Gallery */}
      <CompanyGallery
        officeImages={officeImages}
        onAddImage={onAddOfficeImage}
        onRemoveImage={onRemoveOfficeImage}
      />

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-4 rounded-2xl border border-[#EAEFF7] bg-white p-6 shadow-sm">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-[#EAEFF7] bg-white px-6 py-3 text-sm font-semibold text-[#66789C] transition hover:bg-gray-50 cursor-pointer"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-[#3C65F5] px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#254BD6] disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? "Saving Company..." : "Save Company Profile"}
        </button>
      </div>
    </form>
  );
};
