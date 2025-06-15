'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function CustomerSelector({ onSelect }: { onSelect: (customer: any) => void }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.length > 2) {
        axios.get(`/api/customers?search=${query}`).then(res => setSuggestions(res.data));
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search customer by name or mobile"
        className="w-full p-2 border rounded"
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border w-full mt-1 rounded shadow max-h-60 overflow-y-auto">
          {suggestions.map((cust) => (
            <li
              key={cust._id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onSelect(cust);
                setQuery(`${cust.name} (${cust.mobile})`);
                setSuggestions([]);
              }}
            >
              {cust.name} ({cust.mobile})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
