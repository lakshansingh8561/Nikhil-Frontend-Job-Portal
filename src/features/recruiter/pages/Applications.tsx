import { PageHeader } from "../components/PageHeader";
import { RecentApplications } from "../dashboard/RecentApplications";

export const Applications = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Candidate Applications"
        description="Filter, review candidate profiles, and shortlist applicants for interviews."
      />

      <RecentApplications />
    </div>
  );
};

export default Applications;
