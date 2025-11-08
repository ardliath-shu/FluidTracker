import { useTransition } from "react";
import { useConfirm } from "@/app/hooks/useConfirm";
import { useToast } from "@/app/hooks/useToast";

import AddDrinkForm from "./AddDrink";
import Card from "./Card";
import FinishedDrinksList from "./FinishedDrinksList";
import FluidTargetForm from "./FluidTargetForm";
import OpenDrinksList from "./OpenDrinksList";
import StatsTrends from "./StatsTrends";

export default function ExtraMenu({ userId, patient, onPatientChange }) {
  const [isPending, startTransition] = useTransition();
  const { confirm, ConfirmDialog } = useConfirm();
  const { showToast, ToastContainer } = useToast();

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
