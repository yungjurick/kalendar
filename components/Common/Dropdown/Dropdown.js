import { useEffect, useRef } from 'react';

/*
  Dropdown Data Prop Type

  data = [
    ...,
    {
      leftLabel: String
      rightLabel: Component
      onClickHandler: Function
    }
  ]
*/

const Dropdown = ({
  data = [],
  onCloseDropdown
}) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const checkOutsideClick = (e) => {
      if (dropdownRef && dropdownRef.current) {
        const outsideClick = !dropdownRef.current.contains(e.target);
        if (outsideClick) {
          onCloseDropdown();
        }
      }
    }

    document.addEventListener('click', checkOutsideClick)

    return () => {
      document.removeEventListener('click', checkOutsideClick);
    }
  }, [dropdownRef, onCloseDropdown])

  const handleOnClick = (handler) => {
    handler();
    onCloseDropdown();
  }

  return (
    <div
      ref={dropdownRef}
      className="absolute left-0 z-50 py-2 bg-white rounded-md dropdownBoxShadow min-w-168 top-full"
    >
      {
        data.map((d, i) => {
          return (
            <div
              key={i}
              onClick={() => handleOnClick(d.onClickHandler)}
              className="flex items-center justify-between px-4 py-2 transition cursor-pointer hover:bg-gray-100"
            >
              <div className="text-sm">
                {d.leftLabel}
              </div>
              <div className="text-sm text-gray-400">
                {d.rightLabel}
              </div>
            </div>
          )
        })
      }
    </div>
  )
}

export default Dropdown