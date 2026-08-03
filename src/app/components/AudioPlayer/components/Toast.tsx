'use client';

import React from 'react';
import styles from '../AudioPlayer.module.scss';

interface ToastProps {
  message: string | null;
}

/** Transient confirmation pill for queue/share/download actions. */
const Toast: React.FC<ToastProps> = ({ message }) => (
  <div className={styles.toastRegion} role='status' aria-live='polite'>
    {message && <div className={styles.toast}>{message}</div>}
  </div>
);

export default Toast;
