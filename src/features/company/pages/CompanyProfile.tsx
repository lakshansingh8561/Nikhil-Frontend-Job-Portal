import { useState } from "react";
import { CompanyHeader } from "../components/CompanyHeader";
import { CompanyOverviewCard } from "../components/CompanyOverviewCard";
import { CompanyForm } from "../components/CompanyForm";
import { CompanyPreview } from "../components/CompanyPreview";
import { useCompanyForm } from "../hooks/useCompanyForm";

export const CompanyProfile = () => {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const {
    form,
    company,
    isFetching,
    isSubmitting,
    officeImages,
    handleAddOfficeImage,
    handleRemoveOfficeImage,
    onSubmit,
  } = useCompanyForm();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const watchCompanyName = watch("companyName");
  const watchTagline = watch("tagline");
  const watchIndustry = watch("industry");
  const watchCity = watch("city");
  const watchCountry = watch("country");
  const watchCompanySize = watch("companySize");
  const watchLogo = watch("logo");
  const watchCover = watch("coverImage");
  const watchWebsite = watch("website");

  const displayLocation =
    watchCity || watchCountry
      ? `${watchCity || ""}${watchCity && watchCountry ? ", " : ""}${watchCountry || ""}`
      : company?.city || company?.country
      ? `${company.city || ""}, ${company.country || ""}`
      : "New York, US";

  return (
    <div className="space-y-6 w-full">
      {/* Header Banner */}
      <CompanyHeader
        companyName={watchCompanyName || company?.companyName || company?.name}
        tagline={watchTagline || company?.tagline}
        industry={watchIndustry || company?.industry}
        location={displayLocation}
        companySize={watchCompanySize || company?.companySize}
        logo={watchLogo || company?.logo}
        coverImage={watchCover || company?.coverImage}
        website={watchWebsite || company?.website}
        isVerified={company?.isVerified}
      />

      {/* Main Content Grid: Overview Sidebar on Left, Form / Preview on Right */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Company Overview Summary Card */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-6">
          <CompanyOverviewCard company={company} />
        </div>

        {/* Form or Live Preview */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          {/* Tab Navigation */}
          <div className="flex items-center gap-3 border-b border-[#EAEFF7] pb-3">
            <button
              type="button"
              onClick={() => setActiveTab("edit")}
              className={`rounded-xl px-5 py-2.5 text-xs font-bold transition cursor-pointer ${
                activeTab === "edit"
                  ? "bg-[#3C65F5] text-white shadow-md"
                  : "bg-white text-[#66789C] hover:bg-gray-100 border border-[#EAEFF7]"
              }`}
            >
              Edit Company Profile
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`rounded-xl px-5 py-2.5 text-xs font-bold transition cursor-pointer ${
                activeTab === "preview"
                  ? "bg-[#3C65F5] text-white shadow-md"
                  : "bg-white text-[#66789C] hover:bg-gray-100 border border-[#EAEFF7]"
              }`}
            >
              Live Public Preview
            </button>
          </div>

          {/* Fetching Loading State */}
          {isFetching ? (
            <div className="flex h-64 items-center justify-center rounded-2xl bg-white border border-[#EAEFF7]">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#3C65F5] border-t-transparent" />
            </div>
          ) : activeTab === "edit" ? (
            <CompanyForm
              register={register}
              errors={errors}
              setValue={setValue}
              watch={watch}
              officeImages={officeImages}
              onAddOfficeImage={handleAddOfficeImage}
              onRemoveOfficeImage={handleRemoveOfficeImage}
              onSubmit={handleSubmit(onSubmit)}
              isSubmitting={isSubmitting}
            />
          ) : (
            <CompanyPreview company={company} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
