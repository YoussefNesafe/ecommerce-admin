import { FC } from "react";

interface IProps {
  title: string;
  description: string;
}

const Heading: FC<IProps> = ({
  title,
  description
}) => {
  return (
    <div>
      <h2 className="text-3xl tracking-tight fong-bold">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

export default Heading