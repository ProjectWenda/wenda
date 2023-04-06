import * as React from 'react';
import Button from '../Button';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

type CreateItemButtonProps = {
  createItemAction: () => void;
}

const CreateItemButton: React.FC<CreateItemButtonProps> = ({ createItemAction }) => {
  return (
    <Button
      icon={faPlus}
      onClick={createItemAction}
    >
      Create item
    </Button>
  )
}

export default CreateItemButton;