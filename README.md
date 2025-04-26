# Currency Converter App

App created as a take-home assignment for Creative Factory. It is a currency converter built with Nextjs, Tailwind CSS, and OpenExchangeRates API.

## Setup
1. Clone the repo
2. Run `npm install`
3. Add a `.env.local` file with OpenExchangeRates keys:
   ```
   NEXT_PUBLIC_OPENEXCHANGE_API_KEY={API_KEY}
   NEXT_PUBLIC_BASE_URL=https://openexchangerates.org/api
   ```
4. Run `npm run dev` to start the development server

## Docker Usage
1. Build the Docker image:
   ```sh
   docker build --build-arg NEXT_PUBLIC_OPENEXCHANGE_API_KEY=your_api_key_here --build-arg NEXT_PUBLIC_BASE_URL=https://openexchangerates.org/api -t currency-converter .
   ```
2. Run the container:
   ```sh
   docker run -p 3000:3000 currency-converter
   ```
3. Visit [http://localhost:3000](http://localhost:3000)


