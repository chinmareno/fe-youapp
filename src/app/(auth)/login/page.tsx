"use client";

import AuthSubmitButton from "@/components/Button/AuthSubmitButton";
import AuthInput from "@/components/Input/AuthInput";
import { createSupabaseClient } from "@/lib/supabase";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

interface IFormInput {
  user: string;
  password: string;
}

const Login = () => {
  const router = useRouter();
  const supabase = createSupabaseClient();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsSubmitting(true);

    const { data: user } = await supabase
      .from("profile")
      .select("email")
      .or(`username.eq.${data.user},email.eq.${data.user}`)
      .single();
    if (!user) {
      setIsSubmitting(false);
      toast.error("User not found");
    } else {
      const res = await supabase.auth.signInWithPassword({
        email: user.email,
        password: data.password,
      });
      if (res.error) {
        setIsSubmitting(false);
        toast.error(res.error.message);
      } else {
        toast.success("Logged in successfully");
        setIsSubmitting(false);
        router.push("/");
      }
    }
  };

  return (
    <div className="mt-8 mx-4">
      <h1 className="font-semibold text-2xl ml-4">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <AuthInput
          className="mt-5"
          placeholder="Enter Username/Email"
          {...register("user", { required: true })}
        />
        {errors.user?.type === "required" && (
          <p className="text-red-600">Username/Email is required</p>
        )}
        <AuthInput
          type="password"
          className="mt-3"
          placeholder="Enter Password"
          {...register("password", { required: true })}
        />
        {errors.password?.type === "required" && (
          <p className="text-red-600">Password is required</p>
        )}
        <AuthSubmitButton
          disabled={isSubmitting}
          type="submit"
          className="w-full mt-7"
        >
          Login
        </AuthSubmitButton>
      </form>
      <p className="text-sm text-center mt-12">
        No account?{" "}
        <Link
          href="/register"
          className="text-transparent bg-[linear-gradient(to_right,#F3EDA6,#F8FAE5,#FFE2BE,#D5BE88,#F8FAE5,#D5BE88)] bg-clip-text border-b"
        >
          Register here
        </Link>
      </p>
    </div>
  );
};
export default Login;
