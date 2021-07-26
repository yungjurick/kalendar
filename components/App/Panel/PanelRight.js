import Image from 'next/image';
import IconButton from '../../Common/Button/IconButton';

const PanelRight = () => {
  const panelRightItems = [
    {
      label: 'Calendar',
      src: '/google-calender.png'
    },
    {
      label: 'Keeps',
      src: '/google-keep.png'
    },
    {
      label: 'Tasks',
      src: '/google-tasks.png'
    },
    {
      label: 'Contact',
      src: '/google-contacts.png'
    }
  ]

  return (
    <div className="flex flex-col items-center py-2 space-y-4 border-l min-w-56">
      {
        panelRightItems.map(({label, src}, i) => {
          return (
            <div key={i}>
              <IconButton
                size="medium"
                label={label}
                tooltipLocation="left"
                imgComponent={
                  <Image src={src} width="20px" height="20px" alt="panel-icon" className="z-10" />
                }
                onClickHandler={() => {}}
              />
            </div>
          )
        })
      }
    </div>
  )
}

export default PanelRight;