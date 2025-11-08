
import { useState, useEffect, useTransition } from "react";
import { useConfirm } from "@/app/hooks/useConfirm";
import { useToast } from "@/app/hooks/useToast";
import {
  generateCarerInviteAction,
  addPatientByInviteCode,
} from "@/app/actions/patients";


import AddDrinkForm from "./AddDrink";
import Card from "./Card";
import FinishedDrinksList from "./FinishedDrinksList";
import FluidTargetForm from "./FluidTargetForm";
import OpenDrinksList from "./OpenDrinksList";
import StatsTrends from "./StatsTrends";

export default function ExtraMenu({
  userId,
  patient,
  onPatientChange,
  isCarer,
}) {
  const [isPending, startTransition] = useTransition();
  const { confirm, ConfirmDialog } = useConfirm();
  const { showToast, ToastContainer } = useToast();

  // State for showing the generated invite code
  const [inviteInfo, setInviteInfo] = useState(null);
  const [invitePending, startInviteTransition] = useTransition();
  const [copied, setCopied] = useState(false);

  const handleFinishDrink = (drinkId) => {
    startTransition(async () => {
      const updatedPatient = await finishOpenDrinkAction(
        drinkId,
        patient.patientId,
      );
      // refresh the current patient data in the parent DashboardClient
      onPatientChange?.(updatedPatient.patientId);
    });
  };

  async function handleRemoveDrink(fluidEntryId) {
    if (!confirm("Are you sure you want to remove this drink?")) return;

    try {
      startTransition(async () => {
        const updatedPatient = await removeOpenDrinkAction(
          fluidEntryId,
          patient.patientId,
        );
        onPatientChange(updatedPatient.patientId);
      });
    } catch (err) {
      console.error(err);
      alert("Failed to remove drink.");
    }
  }

  async function handleGenerateInvite() {
    startInviteTransition(async () => {
      try {
        // Call the server action to generate the code
        const info = await generateCarerInviteAction(patient.patientId);
        setInviteInfo(info);
        setCopied(false);
      } catch (err) {
        alert("Failed to generate invite code.");
      }
    });
  }

  // Countdown timer for expiry
  const [secondsLeft, setSecondsLeft] = useState(null);
  useEffect(() => {
    if (!inviteInfo?.expiresAt) return;
    const interval = setInterval(() => {
      const diff = Math.floor(
        (new Date(inviteInfo.expiresAt).getTime() - Date.now()) / 1000,
      );
      setSecondsLeft(diff > 0 ? diff : 0);
    }, 1000);
    return () => clearInterval(interval);
  }, [inviteInfo]);

  function handdleCopy() {
    if (inviteInfo?.code) {
      navigator.clipboard.writeText(inviteInfo.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }


  // Add patient by invite code
  const [inviteCode, setInviteCode] = useState("");
  const [addPatientPending, setAddPatientPending] = useState(false);
  const [addPatientError, setAddPatientError] = useState("");
  const [addPatientSuccess, setAddPatientSuccess] = useState("");

  async function handleAddPatient(e) {
    e.preventDefault();
    setAddPatientPending(true);
    setAddPatientError("");
    setAddPatientSuccess("");
    try {
      const res = await addPatientByInviteCode(inviteCode);
      if (res.error) {
        setAddPatientError(res.error);
      } else {
        setAddPatientSuccess("Patient added successfully.");
        setInviteCode("");
        // Use the returned patient id to refresh the dashboard correctly
        if (onPatientChange && res?.patientId) {
          onPatientChange(res.patientId);
        }
      }
    } catch (err) {
      setAddPatientError("Failed to add patient.");
    } finally {
      setAddPatientPending(false);
    }
  }

  return (
    <>
      <aside className="extra">
        {/* Add Drink Form */}
        <AddDrinkForm
          isOpen={patient.openDrinks.length === 0} // Open if no drinks open
          patient={patient}
          userId={userId}
          onPatientUpdated={() => onPatientChange(patient.patientId)}
        />

        {/* Open Drinks List */}
        <OpenDrinksList
          patient={patient}
          onPatientChange={onPatientChange}
          confirm={confirm}
          showToast={showToast}
        />

        {/* Finished Drinks List */}
        <FinishedDrinksList patient={patient} />

        {/* Stats and Daily Trends */}
        <StatsTrends userId={userId} patient={patient} />

        {/* Fluid Target Form */}
        <FluidTargetForm
          currentTarget={patient.fluidTarget}
          patientId={patient.patientId}
          onUpdated={() => onPatientChange(patient.patientId)}
        />


      {/* Carer Invite Code Section */}
      {!isCarer ? (
        // Show Invite a Carer card if not a carer
        <Card
          title="Invite a Carer"
          icon="fa-user-plus"
          colour="purple"
          collapsible={true}
          defaultOpen={false}
        >
          <div className="center">
            <button
              className="btn blue"
              onClick={handleGenerateInvite}
              disabled={invitePending || (inviteInfo && secondsLeft > 0)}
            >
              {invitePending
                ? "Generating..."
                : inviteInfo && secondsLeft > 0
                  ? "Invite Code Active"
                  : "Create Carer Invite Code"}
            </button>
            {inviteInfo && (
              <div style={{ marginTop: "0.7em" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <code style={{ fontSize: "1.1em" }}>{inviteInfo.code}</code>
                  <button
                    className="btn"
                    style={{
                      fontSize: "0.9em",
                      padding: "0.2em 0.7em",
                      minWidth: 0,
                      height: "2em",
                      lineHeight: 1,
                    }}
                    onClick={handdleCopy}
                    title="Copy to Clipboard"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </span>
                <div style={{ marginTop: 8 }}>
                  Expires in:{" "}
                  <span>
                    {secondsLeft > 0
                      ? `${Math.floor(secondsLeft / 60)}:${(secondsLeft % 60)
                          .toString()
                          .padStart(2, "0")}`
                      : "Expired"}
                  </span>
                </div>
              </div>
            )}
          </div>
          <p>
            Share this code with a carer. It can be used once and will expire in
            5 minutes.
          </p>
        </Card>
      ) : (
        // Show Add Patient card if user is a carer
        <Card
          title="Add a Patient"
          icon="fa-user-plus"
          colour="purple"
          collapsible={true}
          defaultOpen={false}
        >
          <form className="center" onSubmit={handleAddPatient}>
            <input
              type="text"
              placeholder="Enter Invite Code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              style={{ marginRight: 8 }}
              required
            />
            <button
              className="btn blue"
              type="submit"
              disabled={addPatientPending}
            >
              {addPatientPending ? "Adding..." : "Add Patient"}
            </button>
          </form>
          {addPatientError && (
            <div style={{ color: "red", marginTop: 8 }}>{addPatientError}</div>
          )}
          {addPatientSuccess && (
            <div style={{ color: "green", marginTop: 8 }}>
              {addPatientSuccess}
            </div>
          )}
          <p style={{ marginTop: 8 }}>
            Enter an invite code provided by a patient or their carer to link to
            their log.
          </p>
        </Card>
      )}

      {/* <Card
        title={`About ${siteConfig.name}`}
        icon="fas fa-fw fa-droplet"
        colour="green"
      >
        <p>
          {siteConfig.name} is {siteConfig.description.toLowerCase()}.
        </p>
      </Card> */}
      </aside>
      <ConfirmDialog />
      <ToastContainer />
    </>
  );
}
