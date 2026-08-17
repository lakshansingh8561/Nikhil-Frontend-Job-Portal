import React, { useState } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiZap,
  FiSearch,
  FiX,
} from "react-icons/fi";
import {
  useGetAllAdminMembershipsQuery,
  useCreateMembershipPlanMutation,
  useUpdateMembershipPlanMutation,
  useToggleMembershipStatusMutation,
  useDeleteMembershipPlanMutation,
} from "../api/adminApi";
import type { IMembership } from "../../membership/types/membership.types";

export const AdminMembershipsPage: React.FC = () => {
  const { data: plans = [], isLoading, refetch } = useGetAllAdminMembershipsQuery();
  const [createPlan, { isLoading: isCreating }] = useCreateMembershipPlanMutation();
  const [updatePlan, { isLoading: isUpdating }] = useUpdateMembershipPlanMutation();
  const [toggleStatus] = useToggleMembershipStatusMutation();
  const [deletePlan] = useDeleteMembershipPlanMutation();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<IMembership | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    role: "JOB_SEEKER",
    selectedCurrency: "USD" as "USD" | "INR",
    price: 0,
    inrPrice: 0,
    planId: "",
    durationInDays: 30,
    description: "",
    isPopular: false,
    isRecommended: false,
    isActive: true,
    features: [{ title: "Access basic features", enabled: true }],
  });

  const openCreateModal = () => {
    setEditingPlan(null);
    setFormData({
      name: "",
      role: "JOB_SEEKER",
      selectedCurrency: "USD",
      price: 10,
      inrPrice: 478,
      planId: "",
      durationInDays: 30,
      description: "",
      isPopular: false,
      isRecommended: false,
      isActive: true,
      features: [{ title: "Full platform access", enabled: true }],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (plan: IMembership) => {
    setEditingPlan(plan);
    const curr = (plan.currency as "USD" | "INR") || "USD";
    setFormData({
      name: plan.name || "",
      role: plan.role || "JOB_SEEKER",
      selectedCurrency: curr,
      price: curr === "USD" ? plan.price : 10,
      inrPrice: curr === "INR" ? plan.price : 478,
      planId: plan.planId || "",
      durationInDays: plan.durationInDays || 30,
      description: plan.description || "",
      isPopular: !!plan.isPopular,
      isRecommended: !!plan.isRecommended,
      isActive: plan.isActive !== false,
      features:
        plan.features && plan.features.length > 0
          ? plan.features.map((f) => ({ title: f.title, enabled: f.enabled !== false }))
          : [{ title: "Basic access", enabled: true }],
    });
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleStatus(id).unwrap();
      refetch();
    } catch (err: any) {
      alert(err?.data?.message || "Failed to toggle status");
    }
  };

  const handleDeletePlan = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the plan "${name}"?`)) return;
    try {
      await deletePlan(id).unwrap();
      refetch();
    } catch (err: any) {
      alert(err?.data?.message || "Failed to delete plan");
    }
  };

  const handleAddFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, { title: "", enabled: true }],
    });
  };

  const handleRemoveFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const handleFeatureChange = (index: number, value: string) => {
    const updated = [...formData.features];
    updated[index].title = value;
    setFormData({ ...formData, features: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isINR = formData.selectedCurrency === "INR";
      const finalPrice = isINR ? Number(formData.inrPrice) : Number(formData.price);

      const payload = {
        name: formData.name,
        role: formData.role,
        price: finalPrice,
        currency: formData.selectedCurrency,
        planId: formData.planId.trim(),
        durationInDays: Number(formData.durationInDays),
        description: formData.description,
        isPopular: formData.isPopular,
        isRecommended: formData.isRecommended,
        isActive: formData.isActive,
        features: formData.features.filter((f) => f.title.trim() !== ""),
      };

      if (editingPlan) {
        await updatePlan({ id: editingPlan._id, ...payload }).unwrap();
      } else {
        await createPlan(payload).unwrap();
      }

      setIsModalOpen(false);
      refetch();
    } catch (err: any) {
      alert(err?.data?.message || "Operation failed.");
    }
  };

  const filteredPlans = plans.filter((plan) => {
    const matchesSearch =
      plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (plan.planId || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === "ALL" || plan.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const candidatePlans = plans.filter((p) => p.role === "JOB_SEEKER");
  const recruiterPlans = plans.filter((p) => p.role === "RECRUITER");

  return (
    <div className="space-y-6">
      {/* Top Header Banner Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FiZap className="w-6 h-6 text-[#3C65F5]" />
            Membership Plans Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Create, update, toggle active status, and configure Razorpay plan IDs for candidates and recruiters.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 bg-[#3C65F5] hover:bg-[#254BD6] active:scale-[0.98] text-white px-5 py-2.5 rounded-xl font-bold shadow-md transition-all duration-150 shrink-0 cursor-pointer"
        >
          <FiPlus className="w-5 h-5" />
          Create New Plan
        </button>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Active Plans</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{plans.filter((p) => p.isActive).length}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#3C65F5] flex items-center justify-center font-semibold">
            {plans.length}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Candidate Plans</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{candidatePlans.length}</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
            JOB_SEEKER
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Recruiter Plans</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{recruiterPlans.length}</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700">
            RECRUITER
          </span>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by plan name or planId..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3C65F5]/20 focus:border-[#3C65F5] transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-medium text-slate-500">Filter Role:</span>
          <div className="inline-flex bg-slate-100 p-1 rounded-lg">
            {["ALL", "JOB_SEEKER", "RECRUITER"].map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  selectedRole === role
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {role === "ALL" ? "All" : role === "JOB_SEEKER" ? "Candidate" : "Recruiter"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Plans Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500">Loading membership plans...</div>
        ) : filteredPlans.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No membership plans found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Plan Name</th>
                  <th className="py-3.5 px-4">Target Role</th>
                  <th className="py-3.5 px-4">Currency Gateway</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Razorpay Plan ID (`planId`)</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filteredPlans.map((plan) => {
                  const isINR = plan.currency === "INR" || plan.currency === "₹";
                  return (
                    <tr key={plan._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 font-semibold text-slate-900">
                        <div className="flex items-center gap-2">
                          {plan.name}
                          {plan.isPopular && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                              Popular
                            </span>
                          )}
                          {plan.isRecommended && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-800">
                              Recommended
                            </span>
                          )}
                        </div>
                        {plan.description && (
                          <p className="text-xs text-slate-400 font-normal line-clamp-1 mt-0.5">
                            {plan.description}
                          </p>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            plan.role === "JOB_SEEKER"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                              : "bg-purple-50 text-purple-700 border border-purple-200/60"
                          }`}
                        >
                          {plan.role}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            isINR
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {isINR ? "₹ INR (Razorpay)" : "$ USD (Polar)"}
                        </span>
                      </td>

                      <td className="py-4 px-4 font-bold text-slate-900">
                        {isINR ? `₹${plan.price}` : `$${plan.price}`}{" "}
                        <span className="text-xs text-slate-400 font-normal">/ {plan.durationInDays}d</span>
                      </td>

                      <td className="py-4 px-4">
                        {plan.planId ? (
                          <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded text-slate-700 border border-slate-200">
                            {plan.planId}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Not set</span>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(plan._id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                            plan.isActive
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                              : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                          }`}
                        >
                          {plan.isActive ? <FiCheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <FiXCircle className="w-3.5 h-3.5 text-slate-400" />}
                          {plan.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>

                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(plan)}
                          className="p-2 text-slate-600 hover:text-[#3C65F5] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Plan"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePlan(plan._id, plan.name)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Plan"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Plan Modal (Fixed top-start positioning below nav bar) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-start justify-center p-4 pt-16 sm:pt-20 pb-12">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-auto relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FiZap className="w-5 h-5 text-[#3C65F5]" />
                {editingPlan ? `Edit Membership Plan: ${editingPlan.name}` : "Create New Membership Plan"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              {/* Currency Selector */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">Payment Currency Gateway</p>
                  <p className="text-[11px] text-slate-500">Select whether this plan uses Polar (USD) or Razorpay (INR)</p>
                </div>
                <div className="inline-flex bg-white p-1 rounded-lg border border-slate-200 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, selectedCurrency: "USD" })}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                      formData.selectedCurrency === "USD"
                        ? "bg-[#3C65F5] text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    $ USD (Polar)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, selectedCurrency: "INR" })}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                      formData.selectedCurrency === "INR"
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    ₹ INR (Razorpay)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Plan Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pro, Premium, Enterprise"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#3C65F5]/20 focus:border-[#3C65F5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Target Role *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#3C65F5]/20 focus:border-[#3C65F5]"
                  >
                    <option value="JOB_SEEKER">Candidate (JOB_SEEKER)</option>
                    <option value="RECRUITER">Recruiter (RECRUITER)</option>
                  </select>
                </div>

                {/* DYNAMIC PRICE FIELD BASED ON SELECTED CURRENCY */}
                {formData.selectedCurrency === "USD" ? (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Price (USD $) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      placeholder="e.g. 10"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#3C65F5]/20 focus:border-[#3C65F5]"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Price (INR ₹) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      required
                      placeholder="e.g. 478"
                      value={formData.inrPrice}
                      onChange={(e) => setFormData({ ...formData, inrPrice: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>
                )}

                {/* PLAN ID FIELD (FOR BOTH POLAR USD AND RAZORPAY INR) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    {formData.selectedCurrency === "USD" ? "Polar Product / Plan ID (`planId`)" : "Razorpay Plan ID (`planId`) *"}
                  </label>
                  <input
                    type="text"
                    required={formData.selectedCurrency === "INR"}
                    placeholder={
                      formData.selectedCurrency === "USD"
                        ? "e.g. f0455f28-0640-4e2b-9a49-e855581e0ff1"
                        : "e.g. plan_TQj9ISYw6HzIIy"
                    }
                    value={formData.planId}
                    onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
                    className={`w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:ring-2 ${
                      formData.selectedCurrency === "USD"
                        ? "focus:ring-[#3C65F5]/20 focus:border-[#3C65F5]"
                        : "focus:ring-emerald-500/20 focus:border-emerald-500"
                    }`}
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    {formData.selectedCurrency === "USD"
                      ? "Exact Polar Product ID matching your Polar sandbox dashboard."
                      : "Exact Razorpay Plan ID matching your Razorpay test dashboard."}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Duration (Days) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.durationInDays}
                    onChange={(e) => setFormData({ ...formData, durationInDays: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#3C65F5]/20 focus:border-[#3C65F5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Short description of what this plan includes..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#3C65F5]/20 focus:border-[#3C65F5]"
                />
              </div>

              {/* Toggles & Options */}
              <div className="flex flex-wrap gap-6 py-2 border-y border-slate-100">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-[#3C65F5] rounded focus:ring-[#3C65F5]"
                  />
                  <span className="text-sm font-medium text-slate-700">Active (Visible to users)</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPopular}
                    onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                    className="w-4 h-4 text-[#3C65F5] rounded focus:ring-[#3C65F5]"
                  />
                  <span className="text-sm font-medium text-slate-700">Mark as Popular</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isRecommended}
                    onChange={(e) => setFormData({ ...formData, isRecommended: e.target.checked })}
                    className="w-4 h-4 text-[#3C65F5] rounded focus:ring-[#3C65F5]"
                  />
                  <span className="text-sm font-medium text-slate-700">Mark as Recommended</span>
                </label>
              </div>

              {/* Features List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Features Included
                  </label>
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="text-xs font-medium text-[#3C65F5] hover:text-[#254BD6] flex items-center gap-1 cursor-pointer"
                  >
                    <FiPlus className="w-3.5 h-3.5" /> Add Feature
                  </button>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {formData.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Feature title..."
                        value={feature.title}
                        onChange={(e) => handleFeatureChange(idx, e.target.value)}
                        className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#3C65F5]/20 focus:border-[#3C65F5]"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="px-5 py-2 text-sm font-bold text-white bg-[#3C65F5] hover:bg-[#254BD6] rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {isCreating || isUpdating ? "Saving..." : editingPlan ? "Update Plan" : "Create Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMembershipsPage;
