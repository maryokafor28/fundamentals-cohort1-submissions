import React from 'react'

const TrimText = ({ item, maxLength }) => {
  if (!item) return null;
  
  return (
    <>
      {item.length > maxLength ? item.substring(0, maxLength) + '...' : item}
    </>
  )
}

export default TrimText