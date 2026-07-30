import { FiGlobe, FiMapPin, FiUsers, FiLinkedin, FiFacebook, FiTwitter, FiInstagram, FiGithub, FiYoutube } from "react-icons/fi";
import type { Company } from "../types/company.types";

interface CompanyPreviewProps {
  company?: Company;
}

export const CompanyPreview = ({ company }: CompanyPreviewProps) => {
  if (!company) {
    return (
      <div className="rounded-3xl bg-white p-12 text-center border border-[#EAEFF7] shadow-sm">
        <h3 className="text-lg font-bold text-[#05264E]">No Company Profile Found</h3>
        <p className="text-xs text-[#66789C] mt-1">
          Fill out the form below to create your official company profile.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Banner Card */}
      <div className="relative overflow-hidden rounded-3xl bg-white shadow-sm border border-[#EAEFF7]">
        <div className="h-40 w-full bg-gradient-to-r from-[#3C65F5] via-[#254BD6] to-[#05264E] overflow-hidden">
          {company.coverImage && (
            <img
              src={company.coverImage}
              alt="Cover"
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <div className="p-6 pt-0 -mt-12 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="flex items-end gap-5">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-white p-2 shadow-xl ring-4 ring-white border border-[#EAEFF7] overflow-hidden">
              {company.logo ? (
                <img
                  src={company.logo}
                  alt={company.companyName}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-xl bg-[#3C65F5] font-extrabold text-white text-3xl">
                  {company.companyName.charAt(0)}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-[#05264E]">
                {company.companyName}
              </h2>
              <p className="text-xs font-semibold text-[#3C65F5] mt-0.5">
                {company.tagline || company.industry}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-[#66789C]">
            <span className="flex items-center gap-1.5 rounded-lg bg-[#F8FAFC] px-3 py-1.5 border border-[#EAEFF7]">
              <FiUsers className="text-[#3C65F5]" />
              {company.companySize}
            </span>
            <span className="flex items-center gap-1.5 rounded-lg bg-[#F8FAFC] px-3 py-1.5 border border-[#EAEFF7]">
              <FiMapPin className="text-[#3C65F5]" />
              {company.city || company.country || "Headquarters"}
            </span>
          </div>
        </div>
      </div>

      {/* Description & Social Links */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* About Company */}
          <div className="rounded-2xl border border-[#EAEFF7] bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-[#05264E] mb-3">About {company.companyName}</h3>
            <p className="text-sm leading-relaxed text-[#66789C] whitespace-pre-line">
              {company.description || "No company description provided."}
            </p>

            {(company.mission || company.vision) && (
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 border-t border-[#F0F4FC] pt-4">
                {company.mission && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#3C65F5] mb-1">
                      Our Mission
                    </h4>
                    <p className="text-xs text-[#66789C] leading-relaxed">{company.mission}</p>
                  </div>
                )}
                {company.vision && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#3C65F5] mb-1">
                      Our Vision
                    </h4>
                    <p className="text-xs text-[#66789C] leading-relaxed">{company.vision}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Office Gallery Grid */}
          {company.officeImages && company.officeImages.length > 0 && (
            <div className="rounded-2xl border border-[#EAEFF7] bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-[#05264E] mb-4">Office & Workplace Photos</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {company.officeImages.map((imgUrl, i) => (
                  <img
                    key={i}
                    src={imgUrl}
                    alt={`Workspace ${i + 1}`}
                    className="h-32 w-full rounded-xl object-cover border border-[#EAEFF7]"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Social Links & Web */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#EAEFF7] bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-[#05264E] mb-4">Social Media & Links</h3>
            <div className="flex flex-wrap gap-2">
              {company.website && (
                <a
                  href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-xl bg-[#EBF2FF] px-3 py-2 text-xs font-semibold text-[#3C65F5]"
                >
                  <FiGlobe /> Website
                </a>
              )}
              {company.linkedin && (
                <a
                  href={company.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600"
                >
                  <FiLinkedin /> LinkedIn
                </a>
              )}
              {company.facebook && (
                <a
                  href={company.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700"
                >
                  <FiFacebook /> Facebook
                </a>
              )}
              {company.twitter && (
                <a
                  href={company.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-xl bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-500"
                >
                  <FiTwitter /> Twitter
                </a>
              )}
              {company.instagram && (
                <a
                  href={company.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-xl bg-pink-50 px-3 py-2 text-xs font-semibold text-pink-600"
                >
                  <FiInstagram /> Instagram
                </a>
              )}
              {company.github && (
                <a
                  href={company.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-xl bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-800"
                >
                  <FiGithub /> GitHub
                </a>
              )}
              {company.youtube && (
                <a
                  href={company.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600"
                >
                  <FiYoutube /> YouTube
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
