import React from 'react'
import Header from './CommonComponent/Header'
import Footer from './CommonComponent/Footer'
import HeroSection from './ShareFileComponent/HeroSection'
import RecentUploads from './CommonComponent/RecentUploads'

const ShareFile = () => {
  return (
    <>
    <Header/>
    <HeroSection/>
    <RecentUploads/>
    <Footer/>
    </>
  )
}

export default ShareFile