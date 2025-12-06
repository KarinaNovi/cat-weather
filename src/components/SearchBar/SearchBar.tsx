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
    if (!debouncedQuery) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    const loadCities = async () => {
      try {
        const results = await fetchCities(debouncedQuery);
        if (!cancelled) {
          setSuggestions(results);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to fetch cities:", error);
          setSuggestions([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadCities();

    return () => {
      cancelled = true;
    };
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

      {isLoading && (
        <div className={styles.loader} aria-hidden="true">
          <div className={styles.spinner} />
        </div>
      )}

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