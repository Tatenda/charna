import { memo } from 'react';

// Higher-order component for memoizing expensive components
export function withMemo<T extends Record<string, any>>(Component: React.ComponentType<T>) {
  const MemoizedComponent = memo(Component);
  MemoizedComponent.displayName = `Memo(${Component.displayName || Component.name})`;
  return MemoizedComponent;
}