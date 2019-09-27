/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useRef,
  createContext,
  useMemo,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import './style.css';

const Context = createContext({
  onSelect() {},
  optionsRef: { current: [] },
});

function Combobox({ as: Comp = 'div', onSelect, ...props }) {
  const optionsRef = useRef([]);
  const [selected, setSelected] = useState(null);

  const value = useMemo(
    () => ({
      optionsRef,
      onSelect,
      selected,
      setSelected,
    }),
    [selected, onSelect],
  );

  return (
    <Context.Provider value={value}>
      <Comp {...props} data-combobox="" />
    </Context.Provider>
  );
}
Combobox.defaultProps = {
  onSelect() {},
};

function ComboList({ as: C = 'ul', ...props }) {
  // const { optionsRef } = useContext(Context);

  const handleKeydown = useKeydown();

  return (
    <C onKeyDown={handleKeydown} {...props} data-combobox-list role="listbox" />
  );
}

function ComboOption({ as: C = 'li', value, ...props }) {
  const { optionsRef, onSelect, selected, setSelected } = useContext(Context);
  useEffect(() => {
    optionsRef.current.push(value);
  }, [optionsRef, value]);

  const onClick = () => {
    setSelected(value);
    onSelect(value);
  };

  const isActive = selected === value;

  return (
    <C
      data-combobox-option
      data-highlighted={isActive ? '' : undefined}
      {...props}
      tabIndex={-1}
      onClick={onClick}
    />
  );
}

function useKeydown() {
  const { onSelect, optionsRef, selected, setSelected } = useContext(Context);

  return function handleKeydown(event) {
    const { current: options } = optionsRef;

    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();

        if (!options || options.length === 0) {
          return;
        }

        const pos = options.indexOf(selected);

        setSelected(options[(pos + 1) % options.length]);
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();

        if (!options || options.length === 0) {
          return;
        }

        const pos = options.indexOf(selected);

        setSelected(options[(pos - 1 + options.length) % options.length]);
        break;
      }
      case 'Enter': {
        event.preventDefault();
        onSelect && onSelect(selected);
        break;
      }
      default:
        break;
    }
  };
}

const App = () => {
  const [data, setData] = useState(() => [
    {
      title: 'abc',
      id: 'abc',
      isCheck: false,
    },
    {
      title: 'cd',
      id: 'cd',
      isCheck: false,
    },
  ]);

  const onSelect = useCallback(
    value => {
      setData(data => {
        return data.map(item =>
          item.title === value ? { ...item, isCheck: !item.isCheck } : item,
        );
      });
    },
    [data],
  );

  console.log(data);
  return (
    <Combobox onSelect={onSelect}>
      <ComboList>
        {data.map(({ title, isCheck }) => (
          <ComboOption value={title} key={title} type="checkbox">
            <input type="checkbox" onChange={() => {}} checked={isCheck} />{' '}
            {title}
          </ComboOption>
        ))}
      </ComboList>
    </Combobox>
  );
};
export default App;
