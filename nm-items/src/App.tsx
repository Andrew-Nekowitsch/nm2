import './App.css'
// import ItemsTable from './components/table/ItemsTable'
import { useEffect, useState } from 'react'
import type { Item } from './models/Item'
import all_items from './data/all_items.json';
import EnhancedTable from './components/table/table2';
import { castItemsToTableItems } from './utils/ItemUtils';

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [parsingError, setParsingError] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setParsingError(null);
      const data = all_items as unknown as Item[];
      setItems(data);
      debugger;
      console.log('Items:', data);
    } catch (err: any) {
      setParsingError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (parsingError) {
    return <div>Error: {parsingError}</div>;
  }

  return (
    <>
      {/* <ItemsTable items={items} /> */}
      <EnhancedTable items={castItemsToTableItems(items)} />
    </>
  )
}

export default App
