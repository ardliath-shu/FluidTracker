"use client";

import { useState } from "react";
import Card from "./Card";
import { addPatientByInviteCode } from "@/app/actions/patients";

export default function AddPatientCard({ onPatientChange }) {
  const [inviteCode, setInviteCode] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setPending(true);
    setError("");
    setSuccess("");

    try {
      const res = await addPatientByInviteCode(inviteCode);
      if (res.error) setError(res.error);
      else {
        setSuccess("Patient added successfully.");
        setInviteCode("");
        if (onPatientChange && res.patientId) onPatientChange(res.patientId);
      }
    } catch {
      setError("Failed to add patient.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Card
      title="Add a Patient"
      icon="fa-user-plus"
      colour="purple"
      collapsible
      defaultOpen={false}
    >
      <form className="center" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Invite Code"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          required
        />
        <button className="btn blue" type="submit" disabled={pending}>
          {pending ? "Adding..." : "Add Patient"}
        </button>
      </form>

      {error && <div className="alert center">{error}</div>}
      {success && <div className="alert info center">{success}</div>}
      <p className="center">
        Enter an invite code provided by a patient or their carer to link to
        their log.
      </p>
    </Card>
  );
}
