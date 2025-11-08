import React from 'react'
import Header from '../../components/landing/Header'
import Hero from '../../components/landing/Hero'
import Features from '../../components/landing/Features'
import PersonalInfo from '../../components/landing/info'


const LandingPage = () => {
  return (
    <div className='bg-[#ffffff] text-gray-600'>
      <Header/>
      <main>
        <Hero/>
        <Features/>
        <PersonalInfo/>
    
        
      </main>
    </div>
  )
}

export default LandingPage