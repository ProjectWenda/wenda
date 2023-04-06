import * as React from "react";
import { createPortal } from "react-dom";
import { useRecoilValue } from "recoil";
import { themeState } from "../store";
import { motion } from "framer-motion";
import Button, { ButtonType } from "./Button";
import { useKeyPress } from "../hooks/useKeyPress";

type ModalProps = React.PropsWithChildren & {
  title: string;
  onClose: () => void;
  onClickPrimary?: () => void;
  onClickSecondary?: () => void;
  primaryClickDisabled?: boolean;
  secondaryClickDisabled?: boolean;
  primaryClickText?: string;
  secondaryClickText?: string;
  containerClassName?: string;
  headerClassName?: string;
  height?: string;
  width?: string;
};

const Modal: React.FC<ModalProps> = ({
  children,
  title,
  onClose,
  onClickPrimary,
  primaryClickDisabled,
  primaryClickText,
  onClickSecondary,
  secondaryClickDisabled,
  secondaryClickText,
  containerClassName,
  headerClassName,
  height,
  width,
}) => {
  const theme = useRecoilValue(themeState);
  const defaultFontColor = theme ? "text-white" : "text-black";
  const defaultHeaderBackgroundColor = theme ? "bg-zinc-700" : "bg-zinc-200";
  const defaultBodyBackgroundColor = theme ? "bg-zinc-800" : "bg-white";
  const defaultPageTheme = theme ? "dark" : "light";

  const modalPageClassName = `fixed flex items-center justify-center inset-0 overflow-hidden ${defaultPageTheme} ${
    theme ? "bg-zinc-800/70" : "bg-zinc-400/60"
  }`;

  const modalContainerClassName = `fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col shadow-lg`;

  const modalHeaderClassName = `text-lg font-semibold rounded-t-lg p-2
  ${defaultHeaderBackgroundColor} ${defaultFontColor} ${headerClassName}`;

  const modalBodyClassName = `p-4 ${defaultFontColor} ${height || "h-[30em]"} 
  ${width || "w-[25em]"} ${defaultBodyBackgroundColor} ${containerClassName}`;

  const modalFooterClassName = `rounded-b-lg p-2 min-h-[2.5em] flex gap-1 justify-end ${defaultBodyBackgroundColor} ${defaultFontColor}`;

  const enterAction = React.useMemo(() => {
    if (onClickPrimary != undefined && !primaryClickDisabled) {
      return onClickPrimary;
    }
    return () => null;
  }, [onClickPrimary, primaryClickDisabled]);

  useKeyPress(["Enter"], enterAction);
  useKeyPress(["Escape"], onClose);

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
        <div className={modalFooterClassName}>
          {onClickPrimary && (
            <Button onClick={onClickPrimary} disabled={primaryClickDisabled} size="sm">
              {primaryClickText || "Confirm"}
            </Button>
          )}
          <Button
            onClick={onClickSecondary || onClose}
            disabled={secondaryClickDisabled}
            type={ButtonType.Danger}
            size="sm"
          >
            {secondaryClickText || "Cancel"}
          </Button>
        </div>
      </motion.div>
    </div>
  );

  return createPortal(modalJSX, document.querySelector("#root") as HTMLElement);
};

export default Modal;
