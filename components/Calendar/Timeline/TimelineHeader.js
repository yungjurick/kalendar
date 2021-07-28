import { format } from 'date-fns'

const TimelineHeader = ({
  dates = [],
  wholeDayEvents = []
}) => {
  console.log(dates)
  return (
    <div className="flex flex-col">
      <div className="flex justify-start w-full pl-20">
        {
          dates.map((date, i) => {
            return (
              <div key={i} className="flex flex-col items-center justify-start">
                <span className="flex items-center justify-center h-8 mt-2 font-medium tracking-widest text-gray-600 text-xxs">
                  {format(new Date(date), 'EEE').toUpperCase()}
                </span>
                <span className="flex items-center justify-center text-2xl tracking-wider w-11">
                  {format(new Date(date), 'd')}
                </span>
              </div>
            )
          })
        }
      </div>
      <div className="flex">
        <div className="flex items-end justify-start text-gray-500 text-xxs">
          <div className="flex items-center justify-between border-r min-w-56">
            <span>{format(new Date(), 'z')}</span>
          </div>
        </div>
        <div className="w-full pl-2 -ml-2 border-b">
          {/* Whole Day Events */}
        </div>
      </div>
    </div>
  )
}

export default TimelineHeader