import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [search, setSearch] = useState("");
  const debouncedValue = useDebounce(search, 3000);
  const { data, isLoading, isError, error } = useCustomQuery(
    "/api/product",
    debouncedValue
  );

  useEffect(() => {
    console.log("search -> ", search);
  }, [search]);

  useEffect(() => {
    console.log("target search value ->", debouncedValue);
  }, [debouncedValue]);

  return (
    <>
      <h1>Hello Mahi</h1>
      <input
        type="text"
        name="name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {isLoading && <div>Loading ...</div>}
      {isError && <div>Error: {error}</div>}
      {!isLoading && !isError && <div>{data.length}</div>}
    </>
  );
}

export default App;

const useCustomQuery = (path, search) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        const result = await axios.get(`${path}?search=${search}`, {
          signal: controller.signal,
        });
        setData(result?.data);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request canceled", error.message);
          return;
        }
        setIsError(true);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }

      return () => {
        controller.abort();
        console.log("abort query", search);
      };
    })();
  }, [path, search]);

  return { data, isLoading, isError, error };
};

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timerId = useRef(null);

  useEffect(() => {
    if (timerId.current) {
      clearTimeout(timerId.current);
    }

    timerId.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      if (timerId.current) {
        clearTimeout(timerId.current);
      }
    };
  }, [delay, value]);

  return debouncedValue;
};
