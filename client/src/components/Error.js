import React from 'react'

const Error = ({ error }) => (
  <div>
    <p>Crashed! <span role="img" aria-label="crashed">😵</span></p>
    <p>Please try again later.</p>
    <p>{error || null}</p>
  </div>
)

export default Error
