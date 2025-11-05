import { useState, useEffect, useTransition } from "react";
import { formatMinutesSinceMidnight } from "@/app/lib/utils";
import {
  finishOpenDrinkAction,
  removeOpenDrinkAction,
  generateCarerInviteAction,
  addPatientByInviteCode,
} from "@/app/actions/patients";

import AddDrinkForm from "./AddDrink";
import Card from "./Card";
import FluidTargetForm from "./FluidTargetForm";

export default function ExtraMenu({
  userId,
  patient,
  onPatientChange,
  isCarer,
}) {
  const [isPending, startTransition] = useTransition();

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

  // Get a count of finished drinks today
  const finishedDrinksCount = patient.drinksToday.filter(
    (drink) => drink.timeEnded !== null,
  ).length;

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
        // Trigger a full refresh in the dashboard
        if (onPatientChange) {
          onPatientChange("refresh");
        }
      }
    } catch (err) {
      setAddPatientError("Failed to add patient.");
    } finally {
      setAddPatientPending(false);
    }
  }

  return (
    <aside className="extra">
      {/* Add Drink Form */}
      <AddDrinkForm
        isOpen={patient.openDrinks.length === 0} // Open if no drinks open
        patient={patient}
        userId={userId}
        onPatientUpdated={() => onPatientChange(patient.patientId)}
      />

      {/* Open Drinks List */}
      <Card
        title={
          patient.openDrinks.length > 0
            ? "" +
              patient.openDrinks.length +
              " Open Drink" +
              (patient.openDrinks.length > 1 ? "s" : "")
            : "No Open Drinks"
        }
        icon="fa-glass-water"
        colour="blue"
        collapsible={true}
        defaultOpen={patient.openDrinks.length > 0}
      >
        <ul className="open-drinks">
          {patient.openDrinks.length === 0 && (
            <li className="open-drink-item center">No open drinks</li>
          )}
          {patient.openDrinks.map((drink) => (
            <li key={drink.fluidEntryId} className="open-drink-item">
              <button
                className="finish-btn btn green"
                onClick={() => handleFinishDrink(drink.fluidEntryId)}
                disabled={isPending}
                title="Mark Drink as Finished"
              >
                {isPending ? "..." : <i className="fa-solid fa-check"></i>}
              </button>
              <div>
                {drink.note} ({drink.millilitres}ml)
                <br />
                <span>
                  Started at {formatMinutesSinceMidnight(drink.timeStarted)}
                </span>
                <span
                  className="remove-link"
                  onClick={() => handleRemoveDrink(drink.fluidEntryId)}
                  title="Remove Drink"
                >
                  Remove Drink
                </span>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      {/* Finished Drinks List */}
      <Card
        title={
          finishedDrinksCount > 0
            ? "" +
              finishedDrinksCount +
              " Finished Drink" +
              (finishedDrinksCount > 1 ? "s" : "")
            : "No Finished Drinks"
        }
        icon="fa-check"
        colour="green"
        collapsible={true}
        defaultOpen={finishedDrinksCount > 0}
      >
        <ul className="finished-drinks">
          {patient.drinksToday
            .filter((drink) => drink.timeEnded !== null) // only finished drinks
            .map((drink) => (
              <li key={drink.fluidEntryId}>
                {drink.note} ({drink.millilitres}ml)
                <br />
                <span>
                  Finished at {formatMinutesSinceMidnight(drink.timeEnded)}
                </span>
              </li>
            ))}
          {/* if no finished drinks */}
          {patient.drinksToday.filter((drink) => drink.timeEnded !== null)
            .length === 0 && <li className="center">No finished drinks</li>}
        </ul>
      </Card>

      {/* Stats and Daily Trends */}
      <Card
        title="Stats and Daily Trend"
        icon="fa-percent"
        colour="orange"
        collapsible={true}
        defaultOpen={false}
      >
        <p>
          {Number(patient.userId) === Number(userId)
            ? "You have"
            : patient.firstName + " has"}{" "}
          consumed {Math.round(patient.totalToday)}ml so far today of the{" "}
          {patient.fluidTarget}ml target. By this time of day{" "}
          {Number(patient.userId) === Number(userId)
            ? "you have"
            : patient.firstName + " has"}{" "}
          typically consumed {Math.round(patient.typicalProgress[0].average)}ml
          however {Number(patient.userId) === Number(userId) ? "you" : "they"}{" "}
          may have consumed as little as{" "}
          {Math.round(patient.typicalProgress[0].min)}ml or as much as{" "}
          {Math.round(patient.typicalProgress[0].max)}ml.
        </p>
      </Card>

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
  );
}
