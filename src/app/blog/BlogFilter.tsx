'use client';

import { useState } from 'react';
import Icon from '@/app/components/Icon/Icon';

import styles from './BlogFilter.module.scss';

const COLLAPSED_COUNT = 10;

/**
 * Category chips over the post grid. Purely presentational — the selection
 * itself lives in the URL, owned by BlogList.
 */
export default function BlogFilter({
  counts,
  selected,
  onToggle,
  onClear,
}: {
  counts: [string, number][];
  selected: string[];
  onToggle: (tag: string) => void;
  onClear: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const visible = expanded ? counts : counts.slice(0, COLLAPSED_COUNT);
  const hidden = counts.length - visible.length;

  return (
    <div className={styles.bar} role='group' aria-label='Filter posts by topic'>
      <span className={styles.label}>Filter by topic</span>

      <div className={styles.chips}>
        {visible.map(([tag, count]) => (
          <button
            key={tag}
            type='button'
            className={styles.chip}
            aria-pressed={selected.includes(tag)}
            onClick={() => onToggle(tag)}
          >
            {tag}
            <span className={styles.count}>{count}</span>
          </button>
        ))}
      </div>

      <div className={styles.actions}>
        {(hidden > 0 || expanded) && (
          <button
            type='button'
            className={styles.action}
            aria-expanded={expanded}
            onClick={() => setExpanded((on) => !on)}
          >
            {expanded ? 'Show fewer' : `+${hidden} more`}
          </button>
        )}
        {selected.length > 0 && (
          <button type='button' className={styles.action} onClick={onClear}>
            <Icon name='times' />
            Clear {selected.length}
          </button>
        )}
      </div>
    </div>
  );
}
