"use client";

import { useEffect, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { signInAction } from "@/app/actions/auth";

const initialState = { error: undefined, success: undefined };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn blue" disabled={pending}>
      {pending ? "Logging in..." : "Log In"}
    </button>
  );
}

export default function LoginForm() {
  const router = useRouter();
  const [state, formAction] = useActionState(signInAction, initialState);

  useEffect(() => {
    router.prefetch("/"); // speed up post-login nav
  }, [router]);

  useEffect(() => {
    if (state?.success === "signed-in") {
      router.replace("/"); // navigate without leaving history
    }
  }, [state?.success, router]);

  return (
    <form className="form" action={formAction} noValidate>
      {state?.error && (
        <div role="alert" aria-live="polite" style={{ color: "#b00020", marginBottom: 8 }}>
          {state.error}
        </div>
      )}
      <div className="form-floating">
        <input type="email" id="email" name="email" placeholder="Email" required />
        <label htmlFor="email">Email</label>
      </div>
      <div className="form-floating">
        <input type="password" id="password" name="password" placeholder="Password" required />
        <label htmlFor="password">Password</label>
      </div>
      <SubmitButton />
    </form>
  );
}