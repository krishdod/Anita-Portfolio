import React, { useState, useRef, useLayoutEffect, cloneElement } from 'react';

// --- Internal Types and Defaults ---

const DefaultHomeIcon = (props) => <svg
  {...props}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>;
const DefaultCompassIcon = (props) => <svg
  {...props}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" /></svg>;
const DefaultBellIcon = (props) => <svg
  {...props}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>;

const defaultNavItems = [
  { id: 'default-home', icon: <DefaultHomeIcon />, label: 'Home' },
  { id: 'default-explore', icon: <DefaultCompassIcon />, label: 'Explore' },
  { id: 'default-notifications', icon: <DefaultBellIcon />, label: 'Notifications' },
];

/**
 * An adaptive-width navigation bar with a "limelight" effect that highlights the active item.
 */
export const LimelightNav = ({
  items = defaultNavItems,
  defaultActiveIndex = 0,
  activeIndex: controlledActiveIndex,
  onTabChange,
  className,
  limelightClassName,
  iconContainerClassName,
  iconClassName
}) => {
  const [internalActiveIndex, setInternalActiveIndex] = useState(defaultActiveIndex);
  const activeIndex = controlledActiveIndex !== undefined ? controlledActiveIndex : internalActiveIndex;
  const [isReady, setIsReady] = useState(false);
  const navItemRefs = useRef([]);
  const limelightRef = useRef(null);

  useLayoutEffect(() => {
    if (items.length === 0) return;

    const limelight = limelightRef.current;
    const activeItem = navItemRefs.current[activeIndex];
    
    if (limelight && activeItem) {
      const newLeft = activeItem.offsetLeft;
      const newWidth = activeItem.offsetWidth;
      limelight.style.left = `${newLeft}px`;
      limelight.style.width = `${newWidth}px`;

      if (!isReady) {
        setTimeout(() => setIsReady(true), 50);
      }
    }
  }, [activeIndex, isReady, items]);

  if (items.length === 0) {
    return null; 
  }

  const handleItemClick = (index, itemOnClick) => {
    if (controlledActiveIndex === undefined) {
      setInternalActiveIndex(index);
    }
    onTabChange?.(index);
    itemOnClick?.();
  };

  return (
    <nav
      className={`relative inline-flex items-center h-10 rounded-full bg-card text-foreground border px-1.5 ${className}`}>
      {/* Background highlight for active item */}
      <div
        ref={limelightRef}
        className={`absolute z-0 h-8 rounded-full ${limelightClassName} ${
          isReady ? 'transition-[left,width] duration-400 ease-in-out' : ''
        }`}
        style={{ left: '-999px', width: 'auto', top: '50%', transform: 'translateY(-50%)' }}>
      </div>
      
      {items.map(({ id, icon, label, onClick }, index) => {
        const isTextLabel = typeof icon === 'object' && icon.type === 'span'
        const isActive = activeIndex === index
        return (
          <a
            key={id}
            ref={el => (navItemRefs.current[index] = el)}
            className={`relative z-20 flex h-full cursor-pointer items-center justify-center px-3 ${iconContainerClassName}`}
            onClick={() => handleItemClick(index, onClick)}
            aria-label={label}>
            {isTextLabel ? (
              <span className={`text-xs font-medium leading-tight transition-all duration-200 ease-in-out whitespace-nowrap inline-flex items-center justify-center ${
                isActive
                  ? 'opacity-100 text-white font-semibold' 
                  : 'opacity-60 text-muted-foreground'
              } ${iconClassName || ''}`}>
                {icon.props.children}
              </span>
            ) : (
              cloneElement(icon, {
                className: `w-4 h-4 transition-opacity duration-100 ease-in-out ${
                  isActive ? 'opacity-100' : 'opacity-40'
              } ${icon.props.className || ''} ${iconClassName || ''}`,
              })
            )}
            {/* Gradient underline for active item with spacing and shadow */}
            {isActive && (
              <div className={`absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-[calc(100%-12px)] h-[2.5px] rounded-full ${limelightClassName} shadow-[0_2px_12px_rgba(59,130,246,0.8),0_0_20px_rgba(147,51,234,0.4)]`} />
            )}
          </a>
        )
      })}
    </nav>
  );
};