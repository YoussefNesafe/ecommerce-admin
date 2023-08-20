import toast from "react-hot-toast";

type IProps =  {text:string; toastMsg?: string}

export const copyToClipboard = ({text, toastMsg='Coppied Successfully'} :IProps) => {
  navigator.clipboard.writeText(text);
  toast.success(toastMsg)
}