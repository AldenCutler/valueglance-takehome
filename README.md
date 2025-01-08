# ValueGlance

This is a React application made as a take-home assignment from ValueGlance that fetches and displays financial data for a specified company. The data is fetched from the Financial Modeling Prep API and displayed in a table with filtering and sorting capabilities.

## Features

- Fetches financial data from the Financial Modeling Prep API
- Filters data by date, revenue, and net income
- Sorts data by date, revenue, and net income
- Displays data in a responsive table
- Loading spinner while data is being fetched
- Error handling for API fetch failures

## Deployment

The application is deployed on Render and can be accessed at [https://valueglance-takehome.onrender.com](https://valueglance-takehome.onrender.com). This is a free hosting service, so it may take a few seconds to load the application if it has been inactive for a while.

## To Run Locally

1. Clone the repository:
    ```sh
    git clone https://github.com/AldenCutler/valueglance-takehome.git
    cd valueglance-takehome
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a  file in the root directory with the following content:
    ```env
    API_URL='https://financialmodelingprep.com/api/v3/income-statement/AAPL?period=annual&apikey=<your_api_key>'
    ```

## Usage

1. Start the development server:
    ```sh
    npm run dev
    ```

2. Open your browser and navigate to `http://localhost:5173`.

## Build

To build the application for production, run:
```sh
npm run build
```

## Technologies Used

- React for frontend
- Vite for build tool
- Tailwind CSS for styling

## License

This project is licensed under the MIT License.