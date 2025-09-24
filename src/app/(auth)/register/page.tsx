"use client";

import AuthSubmitButton from "@/components/Button/AuthSubmitButton";
import AuthInput from "@/components/Input/AuthInput";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { toast } from "sonner";

interface IFormInput {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterSchema = z
  .object({
    username: z.string().min(1, "Username is required"),
    email: z.email(),
    password: z.string().min(1, "Password is required"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit: SubmitHandler<IFormInput> = async ({
    email,
    password,
    username,
  }) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      toast.error(error.message);
    } else {
      await supabase.auth.signInWithPassword({ email, password });
      const res = await supabase.from("profile").insert({ username, email });
      console.log(res);
      toast.success(
        "Registered successfully, please check your email to confirm your account"
      );
    }
  };

  return (
    <div className="mt-8 mx-4">
      <h1 className="font-semibold text-2xl ml-4">Register</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <AuthInput
          type="email"
          className="mt-5"
          placeholder="Enter Email"
          {...register("email", { required: true })}
        />
        {errors.email && <p className="text-red-600">{errors.email.message}</p>}
        <AuthInput
          className="mt-3"
          placeholder="Create Username"
          {...register("username", { required: true })}
        />
        {errors.username && (
          <p className="text-red-600">{errors.username.message}</p>
        )}
        <AuthInput
          type="password"
          className="mt-3"
          placeholder="Create Password"
          {...register("password", { required: true })}
        />
        {errors.password && (
          <p className="text-red-600">{errors.password.message}</p>
        )}
        <AuthInput
          type="password"
          className="mt-3"
          placeholder="Confirm Password"
          {...register("confirmPassword", { required: true })}
        />
        {errors.confirmPassword && (
          <p className="text-red-600">{errors.confirmPassword.message}</p>
        )}

        <AuthSubmitButton className="w-full mt-7">Register</AuthSubmitButton>
      </form>

      <p className="text-sm text-center mt-12">
        Have an account?{" "}
        <Link href="/login" className="text-[#DAC28F] underline">
          Login here
        </Link>
      </p>
    </div>
  );
};

export default Register;
