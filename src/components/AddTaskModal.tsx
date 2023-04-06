import Modal from "./Modal";

type AddTaskModalProps = {
  onClose: () => void;
  onSubmit?: () => void;
};

const AddTaskModal: React.FC<AddTaskModalProps> = ({ onClose, onSubmit }) => {
  return (
    <Modal title="Add a task" onClose={onClose} onClickPrimary={onSubmit}>
      Adding a task!
    </Modal>
  );
};

export default AddTaskModal;
