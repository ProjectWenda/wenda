import * as React from "react";
import { createPortal } from "react-dom";
import { useRecoilValue } from "recoil";
import { themeState } from "../store";
import { motion } from "framer-motion";

type ModalProps = React.PropsWithChildren & {
  onClose?: () => void;
  containerClassName?: string;
  height?: string;
  width?: string;
};

const Modal: React.FC<ModalProps> = ({ children, containerClassName, height, width }) => {
  const theme = useRecoilValue(themeState);

  const modalPageClassName = `fixed flex items-center justify-center inset-0 overflow-hidden ${
    theme ? "bg-zinc-800/60" : "bg-zinc-400/60"
  }`;

  const defaultContainerBackgroundColor = theme ? "bg-zinc-800" : "bg-white";
  const defaultContainerFontColor = theme ? "text-white" : "text-black";

  const modalContainerClassName = `fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow p-4
    ${defaultContainerFontColor}
    ${containerClassName || defaultContainerBackgroundColor} 
    ${height || "h-96"} ${width || "w-96"}`;

  const modalJSX = (
    <div className={modalPageClassName}>
      <motion.div animate={{ opacity: [0, 1] }} transition={{ duration: 0.25 }} className={modalContainerClassName}>
        {children}
      </motion.div>
    </div>
  );

  return createPortal(modalJSX, document.querySelector("#root") as HTMLElement);
};

export default Modal;
