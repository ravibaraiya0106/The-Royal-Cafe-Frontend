import { toast } from "sonner";

export const toastSuccess = (msg: string) => {
  toast.success(msg);
};

export const toastError = (msg: string) => {
  toast.error(msg);
};

export const toastInfo = (msg: string) => {
  toast.info(msg);
};

export const toastLoading = (msg: string) => {
  return toast.loading(msg);
};

export const toastPromise = (promise: Promise<unknown>) => {
  return toast.promise(promise, {
    loading: "Processing...",
    success: "Success 🎉",
    error: "Something went wrong ",
  });
};
