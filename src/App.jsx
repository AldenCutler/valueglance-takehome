import './App.css';
import { useState, useEffect } from 'react';

// get API_URL from .env file
const env = process.env;

// for currency formatting
// in the future, this could be calculated based on either the user's locale or the "reportedCurrency" field in the data that the API returns
const USDollar = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0
});

/*
TODO:
✔ add input validation for the filters
✔ add more styling to the table and to the filters
✔ error handling for the API fetch, both in the App component and in the backend
- refactor into smaller components and multiple files
✔ add a loading spinner while the data is being fetched
✔ add automatic number formatting for the filter input fields
*/

function App() {
  const [data, setData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    minRevenue: '',
    maxRevenue: '',
    minNetIncome: '',
    maxNetIncome: ''
  });
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'descending' });

  // console.log(env.API_URL);

  // fetch data from the API
  useEffect(() => {
    fetch(env.API_URL)
      .then(response => response.json())
      .then(json => {
        setData(json);
        setFilteredData(json);
      })
      .catch(error => {
        console.error('Error fetching data:', error); // Error handling
        alert('Error fetching data. Please try again later. Error code: ' + error);
      });
  }, []);

  // filter and sort the data every time the filters or sortConfig change
  useEffect(() => {
    if (data) {
      let filtered = data.filter(row => {
        const date = new Date(row.date).getFullYear();    // get the year from the date since we are only filtering by year
        const revenue = parseFloat(row.revenue);
        const netIncome = parseFloat(row.netIncome);

        // return true if the row passes all the filters
        return (!filters.startDate || date >= filters.startDate) &&
          (!filters.endDate || date <= filters.endDate) &&
          (!filters.minRevenue || revenue >= filters.minRevenue) &&
          (!filters.maxRevenue || revenue <= filters.maxRevenue) &&
          (!filters.minNetIncome || netIncome >= filters.minNetIncome) &&
          (!filters.maxNetIncome || netIncome <= filters.maxNetIncome);
      });

      // sort the filtered data and set the state
      if (sortConfig.key) {
        filtered = filtered.sort((a, b) => {
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
          }
          return 0;
        });
      }

      setFilteredData(filtered);
    }
  }, [filters, data, sortConfig]);


  // handlers for filter changes and sorting
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/[^0-9]/g, ''); // Remove non-numeric values
    setFilters({
      ...filters,
      [name]: numericValue
    });
  };
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="App xl:flex xl:flex-row h-full w-full">
      <div className='mx-4'>
        {/* Filters */}
        <h1 className='text-left my-4 text-2xl'>Filters:</h1>
        <div className="filters grid grid-cols-2 gap-2 sm:max-w-sm">
          <label className='my-2 text-left'>Start Year: </label><input className='w-40 duration-100 border rounded-xl p-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' type="number" name="startDate" placeholder='YYYY' value={filters.startDate} onChange={handleFilterChange} />
          <label className='my-2 text-left'>End Year: </label><input className='w-40 duration-100 border rounded-xl p-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' type="number" name="endDate" placeholder='YYYY' value={filters.endDate} onChange={handleFilterChange} />
          <label className='my-2 text-left'>Min Revenue: </label><input className='w-40 duration-100 border rounded-xl p-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' type="number" name="minRevenue" placeholder='$' value={filters.minRevenue} onChange={handleFilterChange} />
          <label className='my-2 text-left'>Max Revenue: </label><input className='w-40 duration-100 border rounded-xl p-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' type="number" name="maxRevenue" placeholder='$' value={filters.maxRevenue} onChange={handleFilterChange} />
          <label className='my-2 text-left'>Min Net Income: </label><input className='w-40 duration-100 border rounded-xl p-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' type="number" name="minNetIncome" placeholder='$' value={filters.minNetIncome} onChange={handleFilterChange} />
          <label className='my-2 text-left'>Max Net Income: </label><input className='w-40 duration-100 border rounded-xl p-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' type="number" name="maxNetIncome" placeholder='$' value={filters.maxNetIncome} onChange={handleFilterChange} />
        </div>
      </div>

      {/* Table Display */}
      {/* shows a loading spinner until data is available, then renders the table */}
      {filteredData ? (
        <>
          <hr className='sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-2xl mx-4 my-4' />
          <table className="md:min-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl mt-6 mx-4 xl:mt-16 h-max border">
            {/* Table header */}
            <thead>
              <tr className='border-collapse border'>
                <th className='border rounded-md cursor-pointer p-2' onClick={() => handleSort('date')}>Date {sortConfig.key === 'date' && sortConfig.direction === 'ascending' ? '△' : ' '} {sortConfig.key === 'date' && sortConfig.direction === 'descending' ? '▽' : ' '}</th>
                <th className='border rounded-md cursor-pointer p-2' onClick={() => handleSort('revenue')}>Revenue {sortConfig.key === 'revenue' && sortConfig.direction === 'ascending' ? '△' : ''} {sortConfig.key === 'revenue' && sortConfig.direction === 'descending' ? '▽' : ''}</th>
                <th className='border rounded-md cursor-pointer p-2' onClick={() => handleSort('netIncome')}>Net Income {sortConfig.key === 'netIncome' && sortConfig.direction === 'ascending' ? '△' : ''} {sortConfig.key === 'netIncome' && sortConfig.direction === 'descending' ? '▽' : ''}</th>
                <th className='border rounded-md p-2'>Gross Profit</th>
                <th className='border rounded-md p-2'>EPS</th>
                <th className='border rounded-md p-2'>Operating Income</th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className='border-collapse border'>
              {filteredData.map((row, i) => (
                <tr key={i} className={i % 2 == 0 ? 'p-2 hover:bg-gray-300 bg-gray-100 duration-100' : 'p-2 hover:bg-gray-300'}>
                  <td className='p-2'>{row.date}</td>
                  <td className='p-2'>{USDollar.format(row.revenue)}</td>
                  <td className='p-2'>{USDollar.format(row.netIncome)}</td>
                  <td className='p-2'>{USDollar.format(row.grossProfit)}</td>
                  <td className='p-2'>{USDollar.format(row.eps)}</td>
                  <td className='p-2'>{USDollar.format(row.operatingIncome)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        // https://flowbite.com/docs/components/spinner/
        <div role="status" className='flex justify-center items-center mx-auto h-96'>
          <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      )}
    </div>
  );
}

export default App;
