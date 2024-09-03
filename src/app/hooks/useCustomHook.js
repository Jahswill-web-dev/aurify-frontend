"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export function useFetchWithToken(url) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = sessionStorage.getItem("accessToken");
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    if(url){
        fetchData()
    }
  }, [url]);

  return { data, error, loading };
}
