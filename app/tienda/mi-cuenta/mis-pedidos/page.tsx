/* eslint-disable @next/next/no-img-element */
'use client'
import { useState, useEffect } from "react";
import { getCookie } from "cookies-next";
import axios from "axios";
import OrderCard from "./OrderCard";


export default function Page() {

  return (
    <div className="py-24 bg-gradient-to-r from-primary/90 from-10% via-primary/60 via-30% to-primary/90 to-90%"> 
    <OrderCard/>
    </div>
  );
}
