import React, { useState, useEffect } from 'react';
import { fetchCities } from '../../services/weatherApi';
import { useDebounce } from '../../hooks/useDebounce';
import styles from './SearchBar.module.scss'; 

const SearchBar: React.FC<{ onSelect: (city: any) => void }> = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      fetchCities(debouncedQuery).then(setSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery]);

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Поиск города..."
      />
      {suggestions.length > 0 && (
        <ul className={styles.suggestions}>
          {suggestions.map((city) => (
            <li key={city.id} onClick={() => { onSelect(city); setQuery(''); }}>
              {city.name}, {city.country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};


export default SearchBar;