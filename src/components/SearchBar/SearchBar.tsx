import React, { useState, useEffect } from 'react';
import { fetchCities } from '../../services/weatherApi';
import { useDebounce } from '../../hooks/useDebounce';
import styles from './SearchBar.module.scss'; 

const SearchBar: React.FC<{ onSelect: (city: any) => void }> = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const debouncedQuery = useDebounce(query, 300);
  const [isLoading, setIsLoading] = useState(false);

useEffect(() => {
  if (debouncedQuery) {
      const loadCities = async () => {
        try {
          const results = await fetchCities(debouncedQuery);
          setSuggestions(results);
        } catch (error) {
          console.error("Failed to fetch cities:", error);
          setSuggestions([]);
        }
      };
      
      loadCities();
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery]);

      // TODO: Добавить норм лоадер
      //{isLoading && <div className={styles.loader}>Загрузка...</div>}
  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Поиск города..."
      />

{suggestions.length > 0 && !isLoading && (
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