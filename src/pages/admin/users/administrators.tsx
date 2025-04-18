import { useEffect, useState } from 'react';
import { Payment, createColumns } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  await new Promise(resolve => setTimeout(resolve, 500));
  return [
    {
      ID: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      ID: "728ed54f",
      amount: 20,
      status: "pending",
      email: "mjaen@example.com",
    },
    {
      ID: "728ez52f",
      amount: 1004,
      status: "pending",
      email: "mail@example.com",
    },
  ]
}

const AdministratorsContent = () => {
  const [data, setData] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const columns = createColumns<Payment>('payment');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getData();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Administradores</h1>
      <p>Hola Mundo desde Administradores</p>
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
  </div>
);

const AdministratorsPage = () => {
  return <AdministratorsContent />;
};

export default AdministratorsPage;