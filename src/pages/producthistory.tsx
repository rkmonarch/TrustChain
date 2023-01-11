import React from 'react';
import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Input from '../components/form-elements/input';
import Header from '../components/form-components/Header';
import Timeline from '../components/timeline';
import ProductDetail from '../components/product-detail';
import logchainABI from "../contracts/logchain.json";
import {
  useContractWrite,
  useWaitForTransaction,
  useAccount,
  useContractRead
} from "wagmi";

interface ProductDetails {
  name: string;
  description: string;
  imageURL: string;
  locationStatuses: string[];
  timestamp: number[];
  locationURL: string[];
}

const Producthistory: NextPage = () => {
  const [productData, setProductData] = useState({});
  const [productID, setProductID] = useState(0);
  const [productLocation, setProuctLocation] = useState('');
  const [productHistory, setProductHistory] = useState([{ title: "Created Location", time: "", Location: "" }]);
  const handleData = (e: any) => {
    setProductData({ ...productData, [e.target.name]: e.target.value })
  }
  
 
  const { data, isError, isLoading } = useContractRead({
    address: '0x3f4210Da2916100118DE851C5ff72B5B9A707E21',
    abi: logchainABI,
    functionName: 'getProduct',
    args: [parseInt((productData as any).productid)]
  })

  useEffect(() => {
    if (data as ProductDetails && !isLoading) {

      const { name, description, imageURL, locationStatuses, timestamp, locationURL } = data as ProductDetails;
      setProductHistory(locationStatuses.map((location: string, index: number) => {
       const convertedTime = timestamp[index];
       const date = new Date(convertedTime * 1000).toLocaleString();
        return { title: location, time: date, Location: locationURL[index] }
      }))
   
      setProductData({ ...productData, name, description, imageURL, locationStatuses, timestamp, locationURL })
    }
  }, [data, isLoading, productData])

 

  return (
    <>
      <Head>
        <title>Product History</title>
        <meta name="description" content="Chain -Product History" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="px-4 md:px-0 my-8 mx-auto max-w-[1080px]">
        <div className="max-w-7xl pt-5 pb-5 mx-auto">
          <Header heading="Product History" />
          <div className="flex flex-col text-center w-full">
            <div className="w-full py-4 overflow-x-hidden overflow-y-auto md:inset-0 justify-center flex md:h-full">
              <div className="relative w-full h-full md:h-auto">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                  <div className="px-6 py-6 lg:px-8">
                    <div className="flex flex-col md:flex-row space-x-5">
                      <div className="w-full md:w-1/2 space-y-6">
                        <form className="space-y-6">
                          <Input
                            id="productid"
                            name="productid"
                            label="Product ID"
                            type="text"
                            placeholder="Product ID"
                            onChange={handleData}
                          />
                        </form>
                        <div>
                          <p className="text-xl font-medium title-font mb-4 text-[#D27D2D]">{(productData as any).name}</p>
                          <div className="p-2 flex flex-col">
                            <ProductDetail label="" value={(productData as any).imageURL} type="image" />
                          </div>
                        </div>
                      </div>
                      <div className="w-full md:w-1/2 space-y-6">
                        <Timeline points={productHistory} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default Producthistory