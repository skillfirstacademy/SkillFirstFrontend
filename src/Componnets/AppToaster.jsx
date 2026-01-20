import { Toaster, toast } from "react-hot-toast";

export default function AppToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000, 
      }}
    />
  );
}


export const showSuccess = (message, options = {}) => {
  toast.success(message, { duration: 3000, ...options });
};

export const showError = (message, options = {}) => {
  toast.error(message, { duration: 4000, ...options });
};
