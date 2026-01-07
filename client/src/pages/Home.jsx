import React from 'react'
import MainBanner from '../components/MainBanner'
import Categories from '../components/Catagories'
import BestSeller from '../components/BestSeller'
import BottomBanner from '../components/BottomBanner'
import NewsLetter from '../components/NewLetter'
import Footer from '../components/Footer'
import Brands from '../components/Brands'

export default function Home() {
  return (
    <div className='mt-10'>
      <MainBanner/>
      <Categories />
      <BestSeller />
      <BottomBanner/>
      <Brands/>
      <NewsLetter/>
    </div>
  )
}
