"use server";

import { auth } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import connection from "@/app/lib/connection";

export type ActionState = {
  error?: string;
  success?: string;
};

function toMessage(e: unknown, fallback: string) {
  const anyErr = e as any;
  return (
    anyErr?.body?.message ||
    anyErr?.message ||
    anyErr?.cause?.message ||
    fallback
  );
}

export async function signUpAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState | void> {
  const email = (formData.get("email") as string)?.trim();
  const password = (formData.get("password") as string) || "";
  const confirmPassword = (formData.get("confirmPassword") as string) || "";
  const name = (formData.get("name") as string)?.trim();
  const inviteCode = (formData.get("inviteCode") as string)?.trim();

  if (!email) {
    return { error: "Email is required." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  try {
    const { user } = await auth.api.signUpEmail({
      body: { email, password, name },
    });

    if (inviteCode) {
      // Look up the code
      const [rowsRaw] = await connection.execute(
        `
          SELECT *
          FROM carerInvites
          WHERE code = ?
            AND used = 0
            AND expiresAt > NOW()
          LIMIT 1
        `,
        [inviteCode],
      );
      const rows = rowsRaw as any[];

      if (rows.length === 0) {
        return { error: "Invalid or expired invite code." };
      }

      const invite = rows[0];

      // Link the new user as a carer for the patient
      await connection.execute(
        `
          INSERT INTO relationships (userId, patientId, notes)
          VALUES (?, ?, ?)
        `,
        [user.id, invite.patientId, "Invited as carer"],
      );

      // Mark the invite as used
      await connection.execute(
        `
          UPDATE carerInvites
          SET used = TRUE
          WHERE code = ?
        `,
        [inviteCode],
      );
    }
    // Return success so the client can navigate (avoids NEXT_REDIRECT in dev)
    return { success: "registered" };
  } catch (e) {
    return { error: toMessage(e, "Failed to register. Please try again.") };
  }
}

export async function signInAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState | void> {
  const email = (formData.get("email") as string)?.trim();
  const password = (formData.get("password") as string) || "";

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
    await auth.api.signInEmail({
      body: { email, password },
    });
    // Return success so the client can navigate (avoids NEXT_REDIRECT in dev)
    return { success: "signed-in" };
  } catch (e) {
    return { error: toMessage(e, "Invalid email or password.") };
  }
}

export async function signOutAction() {
  await auth.api.signOut({
    headers: await headers(),
  });
  redirect("/login");
}
