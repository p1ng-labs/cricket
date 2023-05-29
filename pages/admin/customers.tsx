import { NextPage } from 'next/types';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  flexRender,
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import Layout from '@/components/admin/layout/Layout';
import Loader from '@/components/Loader';
import PageTitle from '@/components/admin/PageTitle';
import RowImageAdmin from '@/components/admin/row/RowImageAdmin';
import RowActions from '@/components/admin/row/RowActions';
import TablePagination from '@/components/admin/TablePagination';
import ICustomer from '@/types/schemas/customer.schema';
import { sidebarItems } from '@/components/admin/layout/MainLinks';

const columnHelper = createColumnHelper<ICustomer>();
const columns = [
  columnHelper.accessor('id', {
    header: '#',
  }),
  columnHelper.accessor('username', {
    header: 'username',
  }),
  columnHelper.accessor('email', {
    header: 'email',
  }),
  columnHelper.accessor('phone', {
    header: 'phone',
  }),
  columnHelper.accessor('avatar', {
    header: 'avatar',
    cell: (info) => <RowImageAdmin imgSrc={info.getValue()} />,
  }),
  columnHelper.display({
    header: 'actions',
    cell: () => <RowActions />,
  }),
];

const CustomerPage: NextPage = () => {
  const [data, setData] = useState<ICustomer[]>([]);
  const [isLoading, setLoading] = useState(true);
  const router = useRouter();
  const pageTitle = sidebarItems.find((item) => item.url === router.pathname)?.label;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: false,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('http://localhost:3001/v1/users');
        const customers = await res.json();
        setData(customers);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    if (isLoading) fetchUsers();
  }, []);

  return (
    <>
      <Layout>
        <PageTitle title={pageTitle} />

        <div className="flex gap-4 bg-white px-4 py-4 my-6 rounded-md custom-box-shadow">
          <input
            type="search"
            id="search"
            name="search"
            className="input input-bordered w-5/6 bg-gray-100 focus:outline-none bg-gray"
            placeholder="Search by username or email"
          />
          <button type="button" className="btn w-1/6 text-lg uppercase">
            Thêm
          </button>
        </div>

        {isLoading ? (
          <Loader />
        ) : (
          <>
            <div className="w-full overflow-x-auto overflow-y-hidden custom-box-shadow">
              <table className="min-w-full divide-y">
                <thead className="text-gray-500">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 text-sm">
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="py-2 px-4 whitespace-nowrap">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <TablePagination table={table} />
          </>
        )}
      </Layout>
    </>
  );
};

export default CustomerPage;
