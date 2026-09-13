import styles from './MunicipalityFilter.module.css';

interface MunicipalityFilterProps {
  municipalities: string[];
  selectedMunicipality: string;
  onSelectChange: (municipality: string) => void;
}

export const MunicipalityFilter = ({municipalities, selectedMunicipality, onSelectChange}: MunicipalityFilterProps) => {
  return (
    <div className={styles.filterWrapper}>
      <label className={styles.filterLabel} htmlFor="municipalitySelect">
        市町村:
      </label>
      <select
        id="municipalitySelect"
        className={styles.selectElement}
        onChange={(e) => onSelectChange(e.target.value)}
        defaultValue=""
      >
        <option value="">すべて</option>
        {municipalities.map((municipality) => (
          <option key={municipality} value={municipality}>
            {municipality}
          </option>
        ))}
      </select>
    </div>
  );
};