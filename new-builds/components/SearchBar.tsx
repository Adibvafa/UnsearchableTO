import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const SearchBar: React.FC<{ onSearch: (query: string) => void }> = ({
  onSearch,
}) => {
  const [query, setQuery] = React.useState('');

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSearch} className='flex items-center p-2'>
      <Input
        type='text'
        placeholder='Search...'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className='border border-gray-300 rounded-md p-2 w-full'
      />
      <Button
        type='submit'
        className='ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
      >
        Search
      </Button>
    </form>
  );
};

export default SearchBar;
