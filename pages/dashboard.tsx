import React, {useEffect, useState} from 'react'
import { supabase } from './login';
import axios from 'axios';
export default function dashboard() {

  useEffect(() => {
    const session = supabase.auth.session();
    const providerToken = session?.provider_token as string;
    const fetchData = async () => {
      try {
        const response = await axios.get('https://discord.com/api/v8/users/@me', {
          headers: {
            Authorization: `Bearer ${providerToken}`
          }
        });
        console.log(response.data) 
      } catch(error) {
        console.log(error);
      }
    }
    fetchData();
  }, [])
  return (
    <div>dashboard</div>
  )
}
