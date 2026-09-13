import React from 'react';
import styles from './SearchBox.module.css';

interface SearchBoxProps {
  onSearchChange: (query: string) => void;
  placeholder?: string;
}

export const SearchBox = ({onSearchChange, placeholder}: SearchBoxProps) => {
  const placeHolder = placeholder || 'スポット名や住所を検索';
  return (
    <div className={styles.searchWrapper}>
      <label
        className={styles.searchLabel}
        htmlFor="searchInput"
      >
        検索:
      </label>
      <input
        id="searchInput"
        className={styles.searchInput}
        type="text"
        placeholder={placeHolder}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="スポット名や住所を検索"
      />
    </div>
  );
};