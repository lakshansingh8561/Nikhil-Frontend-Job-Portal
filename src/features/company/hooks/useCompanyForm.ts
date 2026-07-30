import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { companySchema, type CompanyFormData } from "../validation/company.schema";
import {
  useGetMyCompanyQuery,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
} from "../api/companyApi";

export const useCompanyForm = () => {
  const { data: company, isLoading: isFetching } = useGetMyCompanyQuery();
  const [createCompany, { isLoading: isCreating }] = useCreateCompanyMutation();
  const [updateCompany, { isLoading: isUpdating }] = useUpdateCompanyMutation();

  const [officeImages, setOfficeImages] = useState<string[]>([]);

  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      companyName: "",
      tagline: "",
      description: "",
      mission: "",
      vision: "",
      industry: "Software & IT",
      companySize: "50-100",
      website: "",
      email: "",
      phone: "",
      logo: "",
      coverImage: "",
      foundedYear: new Date().getFullYear(),
      headquarters: "",
      address: "",
      city: "",
      state: "",
      country: "",
      linkedin: "",
      facebook: "",
      twitter: "",
      instagram: "",
      github: "",
      youtube: "",
      officeImages: [],
    },
  });

  const { reset, setValue } = form;

  useEffect(() => {
    if (company) {
      reset({
        companyName: company.companyName || "",
        tagline: company.tagline || "",
        description: company.description || "",
        mission: company.mission || "",
        vision: company.vision || "",
        industry: company.industry || "Software & IT",
        companySize: company.companySize || "50-100",
        website: company.website || "",
        email: company.email || "",
        phone: company.phone || "",
        logo: company.logo || "",
        coverImage: company.coverImage || "",
        foundedYear: company.foundedYear || new Date().getFullYear(),
        headquarters: company.headquarters || "",
        address: company.address || "",
        city: company.city || "",
        state: company.state || "",
        country: company.country || "",
        linkedin: company.linkedin || "",
        facebook: company.facebook || "",
        twitter: company.twitter || "",
        instagram: company.instagram || "",
        github: company.github || "",
        youtube: company.youtube || "",
        officeImages: company.officeImages || [],
      });
      setOfficeImages(company.officeImages || []);
    }
  }, [company, reset]);

  const handleAddOfficeImage = (url: string) => {
    if (!url.trim()) return;
    const updated = [...officeImages, url.trim()];
    setOfficeImages(updated);
    setValue("officeImages", updated);
  };

  const handleRemoveOfficeImage = (index: number) => {
    const updated = officeImages.filter((_, i) => i !== index);
    setOfficeImages(updated);
    setValue("officeImages", updated);
  };

  const onSubmit = async (data: CompanyFormData) => {
    try {
      const payload = { ...data, officeImages };
      if (company) {
        await updateCompany(payload).unwrap();
        toast.success("Company profile updated successfully!");
      } else {
        await createCompany(payload).unwrap();
        toast.success("Company profile created successfully!");
      }
    } catch (err: unknown) {
      const errorMsg =
        typeof err === "object" && err !== null && "data" in err
          ? (err as { data?: { message?: string } }).data?.message
          : "Failed to save company profile.";
      toast.error(errorMsg || "Failed to save company profile.");
    }
  };

  return {
    form,
    company,
    isFetching,
    isSubmitting: isCreating || isUpdating,
    officeImages,
    handleAddOfficeImage,
    handleRemoveOfficeImage,
    onSubmit,
  };
};
