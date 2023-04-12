import * as React from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Button, Typography } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type CreateItemButtonProps = {
  createItemAction: () => void;
};

const CreateItemButton: React.FC<CreateItemButtonProps> = ({ createItemAction }) => {
  return (
    <Button onClick={createItemAction} className="px-2">
      <div className="flex justify-between gap-3 items-center">
        <FontAwesomeIcon icon={faPlus} />
        <Typography.Text>Create item</Typography.Text>
      </div>
    </Button>
  );
};

export default CreateItemButton;
