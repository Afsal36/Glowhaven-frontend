import { toast } from "react-toastify";

export const notify = {
  success: (msg) => toast.success(msg || "Success! "),
  error:   (msg) => toast.error(msg || "Something went wrong "),
  warning: (msg) => toast.warning(msg || "Please check "),
  info:    (msg) => toast.info(msg || "Info "),
};
