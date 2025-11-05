import { useState } from "react";
import ConfirmDialog from "@/app/components/ConfirmDialog";

export function useConfirm() {
  const [state, setState] = useState({
    open: false,
    message: "",
    resolve: null,
  });

  const confirm = (message) =>
    new Promise((resolve) => {
      setState({ open: true, message, resolve });
    });

  const handleConfirm = () => {
    state.resolve(true);
    setState((s) => ({ ...s, open: false }));
  };

  const handleCancel = () => {
    state.resolve(false);
    setState((s) => ({ ...s, open: false }));
  };

  const ConfirmDialogWrapper = () => (
    <ConfirmDialog
      open={state.open}
      message={state.message}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );

  return { confirm, ConfirmDialog: ConfirmDialogWrapper };
}
