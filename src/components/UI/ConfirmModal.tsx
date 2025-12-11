import React from "react";
import styles from "./ConfirmModal.module.scss";

interface Props {
  title?: string;
  text?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  title = "Подтверждение",
  text = "Вы уверены?",
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>{title}</h3>
        <p>{text}</p>

        <div className={styles.buttons}>
          <button className={styles.cancel} onClick={onCancel}>
            Отмена
          </button>

          <button className={styles.confirm} onClick={onConfirm}>
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
}
