import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface NewTaskPromptProps {
  setAddingNewTask: React.Dispatch<React.SetStateAction<boolean>>;
  className: string;
}

const NewTaskPrompt: React.FC<NewTaskPromptProps> = ({
  setAddingNewTask,
  className,
}) => {
  return (
    <div
      className={`rounded h-8 opacity-40 bg-slate-50 dark:bg-zinc-800 p-2 min-h-20 shadow flex cursor-pointer ${className}`}
      onClick={() => setAddingNewTask(true)}
    >
      <FontAwesomeIcon icon={faPlusCircle} className="dark:text-white text-black"/>
    </div>
  );
};

export default NewTaskPrompt;
