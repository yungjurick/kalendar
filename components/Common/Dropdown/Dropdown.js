import { useEffect, useRef } from 'react';

/*
  Dropdown Data Prop Type

  data = [
    ...,
    {
      label: String
      iconComponent: Component
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
      className="absolute left-0 z-20 py-2 bg-white rounded-md shadow-lg drop-shadow min-w-168 top-full"
    >
      {
        data.map((d, i) => {
          return (
            <div
              key={i}
              onClick={() => handleOnClick(d.onClickHandler)}
              className="flex px-4 py-2 transition hover:bg-gray-100"
            >
              {
                d.iconComponent !== null &&
                <div className="mr-3">
                  {d.iconComponent}
                </div>
              }
              <div className="text-sm">
                {d.label}
              </div>
            </div>
          )
        })
      }
    </div>
  )
}

export default Dropdown