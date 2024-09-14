"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export function useFetchWithToken(url) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("accessToken");
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(response);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (url) {
      fetchData();
    }
  }, [url, fetchData]);

  return { data, error, loading, refetch: fetchData };
}
export function usePostWithToken(url, data) {
  const [dataRes, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      try {
        const response = axios.post(url, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    if (url) {
      getData();
    }
  }, [url]);
  return { dataRes, error, loading };
}

export function useDeleteWithToken(pdfId) {
  // const deletePdf = () => {
  const token = sessionStorage.getItem("accessToken");
  axios
    .delete(`${process.env.NEXT_PUBLIC_BASE_URL}/audiobook/${pdfId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log("Delete succesful: ", response.data);
    })
    .catch((error) => {
      console.log("error deleting data", error);
    });
  // };
}
