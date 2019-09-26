import React from 'react'
import PropTypes from 'prop-types'



function ComboList({ data }) {
  return (
    <ul>
      {data.map(({ title }) => (
        <li tabIndex={0} key={title}>
          {title}
        </li>
      ))}
    </ul>
  )
}

export default ComboList;
