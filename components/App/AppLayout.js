import { useSelector } from 'react-redux'
import CreateEventModal from '../Modal/CreateEventModal'
import { HeaderBar } from './HeaderBar'
import PanelLeft from './Panel/PanelLeft'
import PanelRight from './Panel/PanelRight'

const AppLayout = ({ children }) => {
  const { isCreateEventModalOpen } = useSelector(state => state.calendar)
  return (
    <div className="relative flex flex-col w-screen max-h-screen min-h-screen">
      <HeaderBar />
      <div className="flex flex-1">
        <PanelLeft />
        <div className="relative flex-auto">
          {children}
        </div>
        <PanelRight />
      </div>
      {
        isCreateEventModalOpen &&
        <CreateEventModal />
      }
    </div>
  )
}

export default AppLayout