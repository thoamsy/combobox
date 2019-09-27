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

const wrapEvent = (theirHandler, ourHandler) => event => {
  theirHandler && theirHandler(event);
  if (!event.defaultPrevented) {
    return ourHandler(event);
  }
};

const Context = createContext({
  onSelect() {},
  optionsRef: { current: [] },
});

function Combobox({ as: Comp = 'div', onSelect, ...props }) {
  const optionsRef = useRef([]);
  const inputRef = useRef();

  const [selected, setSelected] = useState(null);

  const value = useMemo(
    () => ({
      optionsRef,
      onSelect,
      selected,
      setSelected,
      inputRef,
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

function ComboPopover({ onKeyDown, ...props }) {
  const handleKeydown = useKeydown();

  const hidden = false;
  return (
    <div
      hidden={hidden}
      data-combobox-popover
      onKeyDown={wrapEvent(onKeyDown, handleKeydown)}
      {...props}
    ></div>
  );
}

function ComboInput({ as: Comp = 'input', onClick, onChange, ...props }) {
  const { inputRef } = useContext(Context);
  const handleKeydown = useKeydown();
  return (
    <Comp
      ref={inputRef}
      onKeyDown={handleKeydown}
      onClick={onClick}
      onChange={onChange}
      {...props}
    />
  );
}

function ComboList({ as: C = 'ul', onKeyDown, ...props }) {
  // const { optionsRef } = useContext(Context);

  const handleKeydown = useKeydown();

  return (
    <C
      onKeyDown={wrapEvent(onKeyDown, handleKeydown)}
      {...props}
      data-combobox-list
      role="listbox"
    />
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
      tabIndex="-1"
      onClick={onClick}
      {...props}
    />
  );
}

function useKeydown() {
  const { onSelect, optionsRef, selected, setSelected, inputRef } = useContext(
    Context,
  );

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
        // inputRef.current.focus();
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();

        if (!options || options.length === 0) {
          return;
        }

        const pos = options.indexOf(selected);

        setSelected(options[(pos - 1 + options.length) % options.length]);
        // inputRef.current.focus();
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

  const [inputValue, setValue] = useState('');
  const onCheck = useCallback(
    value => {
      setData(data => {
        return data.map(item =>
          item.title === value ? { ...item, isCheck: !item.isCheck } : item,
        );
      });
    },
    [data],
  );

  return (
    <Combobox>
      <ComboInput value={inputValue} onChange={setValue}></ComboInput>
      <ComboPopover>
        <ComboList>
          {data.map(({ title, isCheck }) => (
            <ComboOption value={title} key={title} type="checkbox">
              <input
                type="checkbox"
                onChange={() => onCheck(title)}
                checked={isCheck}
              />{' '}
              {title}
            </ComboOption>
          ))}
        </ComboList>
      </ComboPopover>
    </Combobox>
  );
};
export default App;
