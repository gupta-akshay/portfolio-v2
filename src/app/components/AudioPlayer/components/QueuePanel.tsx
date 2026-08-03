'use client';

import React, { useState } from 'react';
import Icon from '@/app/components/Icon/Icon';
import { Track } from '../types';
import { formatTime } from '../utils';
import styles from '../AudioPlayer.module.scss';

interface QueuePanelProps {
  isVisible: boolean;
  queueTracks: Track[];
  onClose: () => void;
  onTrackSelect: (index: number) => void;
  onRemoveFromQueue: (index: number) => void;
  onReorderQueue: (fromIndex: number, toIndex: number) => void;
}

const QueuePanel: React.FC<QueuePanelProps> = ({
  isVisible,
  queueTracks,
  onClose,
  onTrackSelect,
  onRemoveFromQueue,
  onReorderQueue,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      onReorderQueue(draggedIndex, index);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <aside
      className={styles.queuePanel}
      data-visible={isVisible || undefined}
      aria-label='Playback queue'
      inert={!isVisible}
    >
      <div className={styles.queueHeader}>
        <h2 className={styles.queueTitle}>Up next</h2>
        <button
          type='button'
          className={styles.queueClose}
          onClick={onClose}
          aria-label='Close queue'
        >
          <Icon name='times' />
        </button>
      </div>

      <div className={styles.queueBody}>
        {queueTracks.length > 0 ? (
          queueTracks.map((track, index) => {
            const label = track.name || track.title;
            const duration = track.duration;

            return (
              <div
                key={`queue-${track.id}-${index}`}
                className={styles.queueRow}
                data-dragover={dragOverIndex === index || undefined}
                draggable
                onDragStart={() => setDraggedIndex(index)}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverIndex(index);
                }}
                onDragLeave={() => setDragOverIndex(null)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={() => {
                  setDraggedIndex(null);
                  setDragOverIndex(null);
                }}
              >
                <button
                  type='button'
                  className={styles.queueRowButton}
                  onClick={() => onTrackSelect(index)}
                  title='Drag to reorder'
                >
                  <span className={styles.queueIndex}>{index + 1}</span>
                  <span className={styles.queueRowInfo}>
                    <span className={styles.queueRowTitle}>{label}</span>
                    <span className={styles.queueRowMeta}>
                      {track.artist}
                      {duration ? ` · ${formatTime(duration)}` : ''}
                    </span>
                  </span>
                </button>
                <button
                  type='button'
                  className={styles.queueRemove}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFromQueue(index);
                  }}
                  aria-label={`Remove ${label} from queue`}
                >
                  <Icon name='times' />
                </button>
              </div>
            );
          })
        ) : (
          <p className={styles.queueEmpty}>
            Queue is empty — tracks play in list order.
          </p>
        )}
      </div>
    </aside>
  );
};

export default QueuePanel;
