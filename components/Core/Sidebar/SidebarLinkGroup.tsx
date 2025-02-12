import { ReactNode, useState } from "react";

interface SidebarLinkGroupProps {
  children: (handleClick: () => void, open: boolean) => ReactNode;
  activeCondition: boolean;
  isExpanded?: boolean;
}

const SidebarLinkGroup = ({
  children,
  activeCondition,
  isExpanded = false,
}: SidebarLinkGroupProps) => {
  const [open, setOpen] = useState<boolean>(activeCondition);

  const handleClick = () => {
    setOpen(!open);
  };

  return <li>{children(handleClick, open && isExpanded)}</li>;
};

export default SidebarLinkGroup;
