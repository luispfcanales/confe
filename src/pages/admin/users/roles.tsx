import React, { useEffect, useState } from 'react';
import { Role, createColumns } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<Role[]> {
  try {
    const response = await fetch('http://localhost:3000/api/roles');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching roles:', error);
    // Return empty array or throw error based on your error handling strategy
    return [];
  }
}

const RolesContent = () => {
  const [data, setData] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const columns = createColumns<Role>('role');

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
      <h1 className="text-2xl font-bold mb-4">Roles</h1>
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

const RolesPage = () => {
  return <RolesContent />;
};

export default RolesPage;