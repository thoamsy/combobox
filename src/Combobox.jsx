/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, createContext, useMemo, useContext, useEffect } from 'react';

const Context = createContext({
  onSelect() { },
  optionsRef: { current: [] }
})

const data = [
  {
    title: 'abc',
    id: 'abc'
  },
  {
    title: 'cd',
    id: 'cd'
  }
]

function Combobox({ onSelect }) {
  const optionsRef = useRef([]);

  useEffect(() => {
    console.count('app')
  })
  const value = useMemo(() => ({
    optionsRef,
    onSelect,
  }), []);

  return (
    <Context.Provider value={value}>
      <ComboList data={data} />
    </Context.Provider>
  );
}
Combobox.defaultProps = {
  onSelect() {

  }
}

function ComboList({ data }) {
  const { optionsRef } = useContext(Context)

  useEffect(() => {
    console.log(optionsRef.current, 'lll')
  });

  return (
    <ul>
      {data.map(({ title }) => (
        <ComboOption value={title} key={title}>
          {title}
        </ComboOption>
      ))}
    </ul>
  )
}

function ComboOption({ value, children, ...props }) {

  const { optionsRef, onSelect } = useContext(Context)
  useEffect(() => {
    optionsRef.current.push(value);
  }, [optionsRef, value]);

  const onClick = () => {
    onSelect(value)
  }

  return (
    <li {...props} role="option" tabIndex={0} onClick={onClick}>{children}</li>
  )
}

export default Combobox;
