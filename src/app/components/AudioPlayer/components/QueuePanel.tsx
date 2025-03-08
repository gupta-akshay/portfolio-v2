import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faGripVertical,
  faMusic,
  faList,
} from '@fortawesome/free-solid-svg-icons';
import { Track } from '../types';

interface QueuePanelProps {
  isVisible: boolean;
  currentTrack: Track | null;
  queueTracks: Track[];
  onClose: () => void;
  onTrackSelect: (index: number) => void;
  onRemoveFromQueue: (index: number) => void;
  onReorderQueue: (fromIndex: number, toIndex: number) => void;
}

const QueuePanel: React.FC<QueuePanelProps> = ({
  isVisible,
  currentTrack,
  queueTracks,
  onClose,
  onTrackSelect,
  onRemoveFromQueue,
  onReorderQueue,
}) => {
  // Drag and drop functionality
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const draggedItem = document.querySelector(
      `[data-queue-index="${draggedIndex}"]`
    );
    const targetItem = document.querySelector(`[data-queue-index="${index}"]`);

    if (draggedItem && targetItem) {
      targetItem.classList.add('drag-over');
    }
  };

  const handleDragLeave = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    const targetItem = document.querySelector(`[data-queue-index="${index}"]`);
    if (targetItem) {
      targetItem.classList.remove('drag-over');
    }
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    onReorderQueue(draggedIndex, index);
    setDraggedIndex(null);

    // Remove drag-over class from all items
    document.querySelectorAll('.drag-over').forEach((item) => {
      item.classList.remove('drag-over');
    });
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    // Remove drag-over class from all items
    document.querySelectorAll('.drag-over').forEach((item) => {
      item.classList.remove('drag-over');
    });
  };

  return (
    <div className={`queuePanel ${isVisible ? 'visible' : ''}`}>
      <div className='queueHeader'>
        <h3>
          <FontAwesomeIcon icon={faList} className='queueIcon' />
          Now Playing Queue
        </h3>
        <button
          className='closeQueueButton'
          onClick={onClose}
          aria-label='Close queue panel'
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>

      <div className='queueContent'>
        {currentTrack && (
          <div className='nowPlayingInQueue'>
            <h4>Now Playing</h4>
            <div className='queueTrackItem nowPlayingItem'>
              <div className='queueTrackInfo'>
                <FontAwesomeIcon icon={faMusic} className='nowPlayingIcon' />
                <div className='queueTrackDetails'>
                  <span className='queueTrackTitle'>
                    {currentTrack.name || currentTrack.title}
                  </span>
                  <span className='queueTrackArtist'>
                    {currentTrack.artist}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className='upNextSection'>
          <h4>Up Next</h4>
          {queueTracks.length > 0 ? (
            <ul className='queueTrackList'>
              {queueTracks.map((track, index) => (
                <li
                  key={`queue-${track.id}-${index}`}
                  className='queueTrackItem'
                  data-queue-index={index}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={(e) => handleDragLeave(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                >
                  <div className='queueDragHandle'>
                    <FontAwesomeIcon icon={faGripVertical} />
                  </div>
                  <div
                    className='queueTrackInfo'
                    onClick={() => onTrackSelect(index)}
                  >
                    <div className='queueTrackDetails'>
                      <span className='queueTrackTitle'>
                        {track.name || track.title}
                      </span>
                      <span className='queueTrackArtist'>{track.artist}</span>
                    </div>
                  </div>
                  <button
                    className='removeFromQueueButton'
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFromQueue(index);
                    }}
                    aria-label={`Remove ${track.name || track.title} from queue`}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className='emptyQueue'>
              <p>No tracks in queue</p>
              <p className='emptyQueueSubtext'>
                Add tracks to your queue by clicking the &quot;Add to
                Queue&quot; button on any track.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QueuePanel;
