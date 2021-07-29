import { format } from 'date-fns'

const TimelineHeader = ({
  dates = [],
  wholeDayEvents = []
}) => {
  console.log(dates)

  return (
    <div className="flex flex-col">
      <div className="flex justify-between w-full pl-14">
        {
          dates.map((date, i) => {
            return (
              <div
                key={i}
                className={`
                  flex flex-col items-center justify-start
                  ${dates.length > 1 && 'flex-1'}
                  ${dates.length === 1 && 'pl-3'}
                `}
              >
                <span className="flex items-center justify-center h-8 mt-2 font-medium tracking-widest text-gray-600 text-xxs">
                  {format(new Date(date), 'EEE').toUpperCase()}
                </span>
                <span className="flex items-center justify-center text-2xl tracking-wider text-gray-700 w-11">
                  {format(new Date(date), 'd')}
                </span>
              </div>
            )
          })
        }
      </div>
      <div className="flex">
        <div className="flex items-end justify-start text-gray-500 text-xxs">
          <div className="flex items-end justify-between min-h-0 min-w-56">
            <span>
              {format(new Date(), 'z')}
            </span>
            <div className="relative w-2 border-b"/>
          </div>
        </div>
        <div className="w-full pl-2 border-b border-l">
          {/* Whole Day Events */}
        </div>
      </div>
    </div>
  )
}

export default TimelineHeader