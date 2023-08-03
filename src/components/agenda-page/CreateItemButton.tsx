import * as React from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Button, Typography, Card } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type CreateItemButtonProps = {
  createItemAction: () => void;
};

const CreateItemButton: React.FC<CreateItemButtonProps> = ({ createItemAction }) => {
  return (
    <Button onClick={createItemAction} className="px-2 flex justify-between gap-2 items-center">
        <FontAwesomeIcon icon={faPlus} />
        <Typography.Text>Create item</Typography.Text>
    </Button>
  );
};

export default CreateItemButton;
