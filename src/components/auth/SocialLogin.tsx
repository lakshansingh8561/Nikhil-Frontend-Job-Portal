import {
  FcGoogle,
} from "react-icons/fc";

import {
  FaGithub,
  FaLinkedinIn,
} from "react-icons/fa";

const SocialLogin = () => {
  return (
    <div className="grid grid-cols-3 gap-4">

      <button
        type="button"
        className="flex h-12 items-center justify-center rounded-xl border border-[#D5DEEF] transition hover:border-[#3C65F5]"
      >
        <FcGoogle size={24} />
      </button>

      <button
        type="button"
        className="flex h-12 items-center justify-center rounded-xl border border-[#D5DEEF] transition hover:border-[#3C65F5]"
      >
        <FaGithub
          size={20}
          className="text-[#05264E]"
        />
      </button>

      <button
        type="button"
        className="flex h-12 items-center justify-center rounded-xl border border-[#D5DEEF] transition hover:border-[#3C65F5]"
      >
        <FaLinkedinIn
          size={20}
          className="text-[#0A66C2]"
        />
      </button>

    </div>
  );
};

export default SocialLogin;