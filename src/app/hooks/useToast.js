import { useState } from "react";
import Toast from "@/app/components/Toast";

export function useToast() {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  const ToastContainer = () =>
    toast ? <Toast {...toast} onClose={() => setToast(null)} /> : null;

  return { showToast, ToastContainer };
}
