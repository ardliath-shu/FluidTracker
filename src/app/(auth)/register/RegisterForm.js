"use client";

import { useEffect, useActionState } from "react";
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

  useEffect(() => {
    router.prefetch("/login"); // speed up post-register nav
  }, [router]);

  useEffect(() => {
    if (state?.success === "registered") {
      router.replace("/login"); // navigate without leaving history
    }
  }, [state?.success, router]);

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
        />
        <label htmlFor="name">Full Name</label>
      </div>
      <div className="form-floating">
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          required
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
        />
        <label htmlFor="confirmPassword">Confirm Password</label>
      </div>
      <SubmitButton />
    </form>
  );
}
