import styles from './LoadingIndicator.module.scss';

export default function LoadingIndicator() {
  return (
    <div className={styles.globalLoadingContainer}>
      <div className={styles.globalLoadingSpinner}>
        <div className={styles.spinnerCircle}></div>
        <div className={styles.spinnerCircleInner}></div>
      </div>
    </div>
  );
}
