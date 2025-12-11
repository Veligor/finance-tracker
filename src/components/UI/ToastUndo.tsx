import React, { useEffect } from "react";
import styles from "./ToastUndo.module.scss";

interface Props {
  message: string;
  onUndo: () => void;
  onClose: () => void;
}

export default function ToastUndo({ message, onUndo, onClose }: Props) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.toast}>
      <span>{message}</span>
      <button onClick={onUndo}>Отменить</button>
    </div>
  );
}
