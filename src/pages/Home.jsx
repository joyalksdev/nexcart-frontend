import React from 'react'
import Hero from '../components/Home/Hero'
import Categories from '../components/Home/Categories'
import PromoBanner from '../components/Home/PromoBanner'
import Recommended from '../components/Home/Recommended'
import ProductCard from '../components/ui/ProductCard'

const Home = () => {
  return (
     <>
      <Hero />
      <Categories />
      <PromoBanner />
      <Recommended />
      <ProductCard />
    </>
  )
}

export default Home