import { useConfirm } from "@/app/hooks/useConfirm";
import { useToast } from "@/app/hooks/useToast";

import AddDrinkForm from "./card/AddDrinkCard";
import AddPatientCard from "./card/AddPatientCard";
import CarerInviteCard from "./card/CarerInviteCard";
import FinishedDrinksList from "./card/FinishedDrinksCard";
import FluidTargetForm from "./card/FluidTargetCard";
import OpenDrinksList from "./card/OpenDrinksCard";
import StatsTrends from "./card/StatsTrendsCard";

export default function ExtraMenu({
  userId,
  patient,
  onPatientChange,
  isCarer,
}) {
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
        <FinishedDrinksList
          patient={patient}
          onPatientChange={onPatientChange}
          confirm={confirm}
          showToast={showToast}
        />

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
          <CarerInviteCard patient={patient} />
        ) : (
          <AddPatientCard onPatientChange={onPatientChange} />
        )}
      </aside>
      <ConfirmDialog />
      <ToastContainer />
    </>
  );
}
