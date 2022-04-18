// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import url from "url";
import axios from "axios";



export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  res.send(200);
}


