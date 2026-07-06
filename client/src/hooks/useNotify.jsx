import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const useNotify = () => {
  const notifySuccess = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  };

  const notifyError = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  };

  const notify = (message, type = "success") => {
    toast[type](message, { 
      position: "top-right", 
      autoClose: 3000 
    });
  };
  return { notifySuccess, notifyError, notify };
};

export default useNotify;
