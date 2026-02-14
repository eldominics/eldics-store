"use client";
import { useAppContext } from "@/context/AppContext";
import { login, verifyToken } from "@/utils/actions/userAuth.action";
import { emailValidationSchema } from "@/utils/zodvalidations/form-validations";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useState } from "react";
import toast from "react-hot-toast";

const LoginUser = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenPart, setTokenPart] = useState(false);
  const [token, setToken] = useState("");
  const { setSession } = useAppContext();
  const router = useRouter();

  const handleLogin = async () => {
    //Check the email and proceed with login or signup

    try {
      setLoading(true);
      const emailCheck = emailValidationSchema.safeParse({ email: email });
      if (!emailCheck.success) {
        toast.error("Please enter a valid email address");
        return;
      }

      toast.success("Please check email for OTP");
      const formData = new FormData();
      formData.append("email", email);

      const loginUser = await login(formData);

      if (loginUser?.error) {
        toast.error("something went wrong with signing in");
        return;
      }
      setTokenPart(true);
      toast.success("Check your email for the login link!");
      //direct the user to authenticate with the otp
    } catch (error) {
      console.error("Something went wrong. Please try again later.", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitToken = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("email", email);
      formData.append("token", token);
      const otpVerification = await verifyToken(formData);

      if (otpVerification?.error) {
        toast.error("Invalid token. Please try again.");
        return;
      }
      if (otpVerification?.session) {
        toast.success("You are now logged in!");
        setSession(otpVerification.session);
        router.push("/");
      }

      // You can redirect the user to the dashboard or home page after successful login
    } catch (error) {
      console.error("Error submitting token:", error);
    } finally {
      setLoading(false);
    }
  };

  return tokenPart ? (
    <div className="bg-black ">
      <section className="flex flex-col justify-center items-center h-screen gap-4  text-white pt-10 w-[80%] mx-auto ">
        <div className="self-center">
          <h1 className="text-4xl font-bold mb-4 max-md:text-xl">
            Token From Your Email
          </h1>
          <p className="text-lg md:text-2xl max-md:text-sm  text-center text-slate-500">
            Check the junk/spam mailbox too.
          </p>
        </div>

        <div className="  px-4 sm:px-0">
          <input
            aria-label="Token"
            placeholder="Enter Token"
            className="w-full px-4 py-3 bg-white  rounded-lg transition-all duration-200 placeholder-gray-400  text-black  shadow-sm"
            name="token"
            type="text"
            onChange={(e) => setToken(e.target.value)}
          />

          <button
            onClick={handleSubmitToken}
            className="px-3 py-2 mt-4 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300  bg-[#043033] rounded-lg  focus:outline-none "
            type="button"
          >
            {loading ? "submitting" : "Submit"}
          </button>
        </div>
      </section>
    </div>
  ) : (
    <div className="bg-black">
      <section className="flex flex-col justify-center h-screen items-center gap-6 text-white w-full px-4">
        {/* Logo */}
        <Link href={"/"}>
          <h1 className="text-4xl font-bold text-center">Eldics Store</h1>
        </Link>

        {/* Heading */}
        <h1 className="text-2xl md:text-2xl max-md:text-xl font-bold text-center">
          Please Provide Your Email
        </h1>

        {/* Input + Button */}
        <div className="w-full max-w-[600px] flex flex-col gap-4">
          <input
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email"
            name="email"
            type="email"
            id="Email"
            className="w-full px-4 py-3 bg-white rounded-lg transition-all duration-200 placeholder-gray-400 text-black shadow-sm"
          />
        </div>
        <button
          onClick={handleLogin}
          className="px-3 py-2 mt-4 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300  bg-[#043033] rounded-lg  focus:outline-none "
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
        <div className="flex flex-row justify-center align-center text-white">
          <p className="">We sign you up if you don&apos;t have an account? </p>
        </div>
      </section>
    </div>
  );
};
export default LoginUser;
