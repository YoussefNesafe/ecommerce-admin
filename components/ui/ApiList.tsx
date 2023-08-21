"use client"
import useOrigin from "@/hooks/useOrigin";
import { useParams } from "next/navigation";
import { FC } from "react"
import ApiAlert, { IApiAlertProps } from "./ApiAlert";
type IProps = {
  data: IApiAlertProps[]
}
const ApiList: FC<IProps> = ({ data }) => {
  if (!data) return null;
  return (
    <>
      {
        data.map((el, i) => <ApiAlert key={`api-${i}`} {...el as IApiAlertProps} />)
      }
    </>
  )
}

export default ApiList