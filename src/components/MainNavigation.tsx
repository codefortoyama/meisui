import React from 'react';
import styles from './MainNavigation.module.css';

interface NavItem {
  key: string;
  label: string;
  path: string;
}

export const MainNavigation = ({isActive, navItems, onSelect}: {
  isActive: (path: string) => boolean;
  navItems: NavItem[];
  onSelect: (path: string) => void;
}) => {
  return (
    <nav className={styles.navigation} aria-label="メインナビゲーション">
      <ul className={styles.navList}>
        {navItems.map((item) => (
          <li key={item.key} className={styles.navItem}>
            <button
              className={styles.navButton}
              onClick={() => onSelect(item.path)}
              aria-pressed={isActive(item.path)}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};
