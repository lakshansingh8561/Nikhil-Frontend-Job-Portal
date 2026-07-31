/**
 * Formats salary ranges for display across the Job Browser module.
 */
export interface FormattedSalary {
  formattedText: string;
  period: string;
}

export const formatSalary = (
  salaryMin?: number,
  salaryMax?: number
): FormattedSalary => {
  if (!salaryMin && !salaryMax) {
    return { formattedText: "Negotiable", period: "" };
  }

  const min = salaryMin || 0;
  const max = salaryMax || 0;

  const isHourly = min < 1000;
  const period = isHourly ? "/Hour" : "/Year";

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `$${num.toLocaleString()}`;
    }
    return `$${num}`;
  };

  if (min > 0 && max > 0) {
    return {
      formattedText: `${formatNumber(min)} – ${formatNumber(max)}`,
      period,
    };
  }

  if (min > 0) {
    return {
      formattedText: `From ${formatNumber(min)}`,
      period,
    };
  }

  return {
    formattedText: `Up to ${formatNumber(max)}`,
    period,
  };
};

export const formatExperienceLevel = (level?: string): string => {
  switch (level) {
    case "FRESHER":
      return "Fresher / Entry Level";
    case "ONE_TO_TWO":
      return "1 - 2 Years";
    case "THREE_TO_FIVE":
      return "3 - 5 Years";
    case "FIVE_PLUS":
      return "5+ Years";
    default:
      return level ? level.replace(/_/g, " ") : "Any Experience";
  }
};

export const formatEmploymentType = (type?: string): string => {
  switch (type) {
    case "FULL_TIME":
      return "Full Time";
    case "PART_TIME":
      return "Part Time";
    case "CONTRACT":
      return "Contract";
    case "INTERNSHIP":
      return "Internship";
    case "REMOTE":
      return "Remote";
    default:
      return type ? type.replace(/_/g, " ") : "Full Time";
  }
};
