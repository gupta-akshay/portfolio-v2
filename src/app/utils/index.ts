// Re-export all utilities from organized structure
export * from './data/skills';
export * from './helpers/format';
export * from './helpers/keyboard';
export * from './helpers/readingTime';

// Re-export AWS utilities
export * from './aws';

// Re-export API utilities
export * from './apiUtils/replaceMergeFields';

// Backward compatibility exports (deprecated - use specific imports)
export { formatDate } from './helpers/format';
export { handleKeyDown } from './helpers/keyboard';
export { getSkillsArray } from './data/skills';
