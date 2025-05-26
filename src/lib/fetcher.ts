export const fetcher = async (url: string) => {
    const res = await fetch(url);
    
    if (!res.ok) {
      const error = new Error('An error occurred while fetching the data.');
      // Attach extra info to the error object
      error.info = await res.json();
      error.status = res.status;
      throw error;
    }
    
    return res.json();
  };
  
  // Alternative fetcher with axios
  import axios from 'axios';
  
  export const axiosFetcher = (url: string) => axios.get(url).then(res => res.data);