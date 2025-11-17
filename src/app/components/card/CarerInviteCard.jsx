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
        {!inviteInfo || secondsLeft < 1 ? (
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
        ) : (
          <div>
            <div>
              Invite Code Expires in:{" "}
              <span>
                {secondsLeft > 0
                  ? `${Math.floor(secondsLeft / 60)}:${(secondsLeft % 60)
                      .toString()
                      .padStart(2, "0")}`
                  : "Expired"}
              </span>
            </div>
            <pre>{inviteInfo.code}</pre>
            <button
              className="btn small"
              onClick={handleCopy}
              title="Copy to Clipboard"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
            <br />
          </div>
        )}
      </div>
      <br />
      <hr />
      <p>
        Share this code with a carer. It can be used once and will expire in 5
        minutes.
      </p>
    </Card>
  );
}
