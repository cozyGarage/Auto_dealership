"use client";

import { useEffect, useState, useCallback } from 'react';

import { CarCard, CustomFilter, Hero, SearchBar, ShowMore } from '@/components'
import { fetchCars } from '@/utils';
import { fuels, yearsOfProduction } from '@/constants';
import Image from 'next/image';

export default function Home() {
  const [allCars, setAllCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // search states
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");

  // filter states
  const [fuel, setFuel] = useState("");
  const [year, setYear] = useState(2022);

  // pagination states
  const [limit, setLimit] = useState(10);

  const getCars = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchCars({
        manufacturer: manufacturer || '',
        year: year || 2022,
        fuel: fuel || '',
        limit: limit || 10,
        model: model || '',
      });
  
      setAllCars(result);
    } catch (err) {
      console.error('Error fetching cars:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch cars. Please try again later.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [manufacturer, year, fuel, limit, model]);

  useEffect(() => {
    getCars();
  }, [getCars])

  const isDataEmpty = !Array.isArray(allCars) || allCars.length < 1;
  
  return (
    <main className="overflow-hidden">
      <Hero />

      <div className="mt-12 padding-x padding-y max-width" id="discover">
        <div className="home__text-container">
          <h1 className="text-4xl font-extrabold">Car Catalogue</h1>
          <p>Explore the cars you might like</p>
        </div>

        <div className="home__filters">
          <SearchBar setManufacturer={setManufacturer} setModel={setModel} />

          <div className="home__filter-container">
            <CustomFilter title="fuel" options={fuels} setFilter={setFuel} />
            <CustomFilter title="year" options={yearsOfProduction} setFilter={setYear} />
          </div>
        </div>

        {error ? (
          <div className="home__error-container">
            <h2 className="text-black text-xl font-bold">Oops, something went wrong</h2>
            <p>{error}</p>
          </div>
        ) : !isDataEmpty ? (
          <section>
            <div className="home__cars-wrapper">
            {allCars.map((car, index: number) => (
                <CarCard key={index} car={car} />
            ))}
            </div>

            {loading && (
              <div className="mt-16 w-full flex-center">
                <Image 
                  src="/loader.svg"
                  alt="loader"
                  width={50}
                  height={50}
                  className="object-contain"
                />
              </div>
            )}

            <ShowMore 
              pageNumber={limit / 10}
              isNext={limit > allCars.length}
              setLimit={setLimit}
            />
          </section>
        ): (
          <div className="home__error-container">
              <h2 className="text-black text-xl font-bold">Oops, no results</h2>
              <p>No cars found.</p>
          </div>
        )}

      </div>
    </main>
  )
}
