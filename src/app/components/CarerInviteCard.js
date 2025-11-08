"use client";
import { useState, useEffect, useTransition } from "react";
import Card from "./Card";
import { generateCarerInviteAction } from "@/app/actions/patients";

export default function CarerInviteCard({ patient }) {
  const [inviteInfo, setInviteInfo] = useState(null);
  const [invitePending, startInviteTransition] = useTransition();
  const [secondsLeft, setSecondsLeft] = useState(null);
  const [copied, setCopied] = useState(false);

  async function handleGenerateInvite() {
    startInviteTransition(async () => {
      try {
        const info = await generateCarerInviteAction(patient.patientId);
        setInviteInfo(info);
        setCopied(false);
      } catch {
        alert("Failed to generate invite code.");
      }
    });
  }

  function handleCopy() {
    if (inviteInfo?.code) {
      navigator.clipboard.writeText(inviteInfo.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

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

  return (
    <Card
      title="Invite a Carer"
      icon="fa-user-plus"
      colour="purple"
      collapsible
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
                onClick={handleCopy}
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
        Share this code with a carer. It can be used once and will expire in 5
        minutes.
      </p>
    </Card>
  );
}
