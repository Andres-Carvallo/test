'use client'

import Hero from './cdghero01BO';
import { useState, useEffect } from "react";


export default function hero() {
  const Hero01 = {
    BannerId: "24eed87b-2b78-4922-836a-9d860f878350", 
    BannerImageId: "62ef3e11-da1d-47ef-8332-f00aa953d181"
  };


  return (
    <Hero HeroBOData={Hero01}/>
  )
}