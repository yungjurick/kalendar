import { HeaderBar } from './HeaderBar'
import PanelLeft from './Panel/PanelLeft'
import PanelRight from './Panel/PanelRight'

const AppLayout = ({ children }) => {
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
    </div>
  )
}

export default AppLayout