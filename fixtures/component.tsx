import { useEffect, useState } from 'react';

export const List = ({ id, items }: { id: string; items: string[] }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(id.length);
  }, []);

  if (count > 2) {
    const [extra] = useState('x');
    return <p>{extra}</p>;
  }

  const Row = ({ label }: { label: string }) => <li>{label}</li>;

  return (
    <ul>
      {items.map((item, index) => (
        <Row key={index} label={item} />
      ))}
    </ul>
  );
};
