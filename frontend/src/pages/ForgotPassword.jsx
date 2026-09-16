import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  GraduationCap,
  Mail,
  CheckCircle2,
} from "lucide-react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) return;

    setSent(true);
  };

  return (
    <div className="min-h-screen bg-[#f7faff] flex items-center justify-center px-6">

      <div className="w-full max-w-md">

        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm text-[#647092] hover:text-[#1769e0] mb-8"
        >
          <ArrowLeft size={17} />
          Back to login
        </Link>


        <div className="bg-white border border-[#e8edf5] rounded-3xl p-8 sm:p-10 shadow-sm">

          <div className="w-12 h-12 rounded-xl bg-[#eaf3ff] flex items-center justify-center mb-6">

            <GraduationCap
              size={26}
              className="text-[#1769e0]"
            />

          </div>


          {!sent ? (
            <>
              <h1 className="text-3xl font-bold text-[#101b45]">
                Forgot password?
              </h1>

              <p className="text-[#687493] mt-2 leading-6">
                Enter your email address and we'll send you
                instructions to reset your password.
              </p>


              <form
                onSubmit={handleSubmit}
                className="mt-7"
              >

                <label className="block text-sm font-semibold text-[#26345f] mb-2">
                  Email address
                </label>

                <div className="relative">

                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b96ad]"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#dfe5ef] outline-none focus:border-[#1769e0] focus:ring-4 focus:ring-blue-100 transition"
                  />

                </div>


                <button
                  type="submit"
                  className="w-full mt-5 py-3.5 rounded-xl bg-[#1769e0] text-white font-semibold hover:bg-[#0f5dcc] transition"
                >
                  Send Reset Link
                </button>

              </form>
            </>
          ) : (
            <div className="text-center">

              <div className="w-16 h-16 mx-auto rounded-full bg-[#e9fbf4] flex items-center justify-center">

                <CheckCircle2
                  size={32}
                  className="text-[#20b982]"
                />

              </div>

              <h1 className="text-2xl font-bold text-[#101b45] mt-6">
                Check your inbox
              </h1>

              <p className="text-[#687493] mt-3 leading-6">
                We've sent password reset instructions to
                <strong> {email}</strong>.
              </p>

              <Link
                to="/login"
                className="inline-block mt-7 text-[#1769e0] font-semibold"
              >
                Return to login
              </Link>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default ForgotPassword;