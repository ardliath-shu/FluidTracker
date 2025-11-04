"use client";

import { useEffect, useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { signUpAction } from "@/app/actions/auth";

const initialState = { error: undefined, success: undefined };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn blue" disabled={pending}>
      {pending ? "Registering..." : "Register"}
    </button>
  );
}

export default function RegisterForm() {
  const router = useRouter();
  const [state, formAction] = useActionState(signUpAction, initialState);

  // Local state for form fields
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    router.prefetch("/login"); // speed up post-register nav
  }, [router]);

  useEffect(() => {
    if (state?.success === "registered") {
      router.replace("/login"); // navigate without leaving history
    }
  }, [state?.success, router]);

  // Update local state on input change
  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  return (
    <form action={formAction} className="form" noValidate>
      {state?.error && (
        <div
          role="alert"
          aria-live="polite"
          style={{ color: "#b00020", marginBottom: 8 }}
        >
          {state.error}
        </div>
      )}
      <div className="form-floating">
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Full Name"
          required
          value={form.name}
          onChange={handleChange}
        />
        <label htmlFor="name">Full Name</label>
      </div>
      <div className=" form-floating">
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={handleChange}
        />
        <label htmlFor="email">Email</label>
      </div>
      <div className="form-floating">
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={handleChange}
        />
        <label htmlFor="password">Password</label>
      </div>
      <div className="form-floating">
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="Confirm Password"
          required
          value={form.confirmPassword}
          onChange={handleChange}
        />
        <label htmlFor="confirmPassword">Confirm Password</label>
      </div>
      <SubmitButton />
    </form>
  );
}
