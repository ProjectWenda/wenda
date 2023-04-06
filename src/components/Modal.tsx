import * as React from "react";
import { createPortal } from "react-dom";
import { useRecoilValue } from "recoil";
import { themeState } from "../store";
import { motion } from "framer-motion";

type ModalProps = React.PropsWithChildren & {
  title: string;
  onClose?: () => void;
  containerClassName?: string;
  headerClassName?: string;
  height?: string;
  width?: string;
};

const Modal: React.FC<ModalProps> = ({
  children,
  title,
  containerClassName,
  headerClassName,
  height,
  width,
}) => {
  const theme = useRecoilValue(themeState);
  const defaultFontColor = theme ? "text-white" : "text-black";
  const defaultModalHeaderBackgroundColor = theme ? "bg-zinc-700" : "bg-zinc-200";
  const defaultBodyBackgroundColor = theme ? "bg-zinc-800" : "bg-white";

  const modalPageClassName = `fixed flex items-center justify-center inset-0 overflow-hidden ${
    theme ? "bg-zinc-800/60" : "bg-zinc-400/60"
  }`;

  const modalContainerClassName = `fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col shadow-lg`;

  const modalHeaderClassName = `text-lg font-semibold rounded-t-lg p-2
  ${defaultModalHeaderBackgroundColor} ${defaultFontColor} ${headerClassName}`;

  const modalBodyClassName = `p-2 ${defaultFontColor} ${height || "h-[30em]"} 
  ${width || "w-[25em]"} ${defaultBodyBackgroundColor} ${containerClassName}`;

  const modalFooterClassName = `rounded-b-lg p-2 ${defaultModalHeaderBackgroundColor} ${defaultFontColor} min-h-[3em]`

  const modalJSX = (
    <div className={modalPageClassName}>
      {/* modal container */}
      <motion.div
        className={modalContainerClassName}
        animate={{ opacity: [0, 1] }}
        transition={{ duration: 0.25 }}
      >
        {/* modal header */}
        <div className={modalHeaderClassName}>{title}</div>
        {/* modal body */}
        <div className={modalBodyClassName}>{children}</div>
        {/* modal footer */}
        <div className={modalFooterClassName}></div>
      </motion.div>
    </div>
  );

  return createPortal(modalJSX, document.querySelector("#root") as HTMLElement);
};

export default Modal;
