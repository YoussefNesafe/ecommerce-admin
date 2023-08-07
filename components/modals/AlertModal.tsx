"use client"

import { FC } from "react"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button";

interface IProps {
  isOpen: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}
const AlertModal: FC<IProps> = ({ isOpen, onClose, onConfirm, loading }) => {

  return (
    <Modal title="Are you sure" description="This action cannot be undone." isOpen={isOpen} onClose={onClose}>
      <div className="flex items-center justify-end w-full pt-6 space-x-2">
        <Button disabled={loading} variant="outline" onClick={onClose} >Cancel</Button>
        <Button disabled={loading} variant="destructive" onClick={onConfirm} >Continue</Button>
      </div>
    </Modal>
  )
}

export default AlertModal