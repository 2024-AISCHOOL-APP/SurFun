import React from 'react'

const SpotSearch = () => {
  return (
    <div className=''>
      <video autoPlay loop muted className="video-background">
        <source src="/videos/surfing.mp4" type="video/mp4" />
      </video>
      <div className='welcome-message'>
        <input placeholder='지역검색'></input>
      </div>
    </div>
  )
}

export default SpotSearch