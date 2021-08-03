import { EventRepeatTypes, RepeatChangesTypes } from './types'

export const getInitialUserEvents = () => {
  return {
    'Rick-1234': ['event-0', 'event-1', 'event-2', 'event-3'],
    'Jason-1234': [],
    'Paul-1234': [],
    'Jenny-1234': [],
    'Sylvia-1234': [],
    'Paula-1234': [],
  }
}

export const getInitialEvents = () => {
  return {
    'event-0': {
      eventUid: 'event-0',
      eventCreatorUid: 'Rick-1234',
      eventGroupUid: null,
      startDate: (new Date(2021, 7, 26, 22, 30)).toString(),
      endDate: (new Date(2021, 7, 26, 23, 30)).toString(),
      title: 'Sample Event',
      description: 'This is a sample event',
      themeColor: 0,
      location: '',
      invites: [],
      isAllDay: false,
      createdAt: (new Date(2021, 7, 26, 22, 30)).toString(),
    },
    'event-1': {
      eventUid: 'event-1',
      eventCreatorUid: 'Rick-1234',
      eventGroupUid: 'group-0',
      startDate: (new Date(2021, 7, 25, 13, 30)).toString(),
      endDate: (new Date(2021, 7, 25, 14, 30)).toString(),
      title: 'Sample Repeated Event',
      description: 'This is a sample repeated event',
      themeColor: 0,
      location: '',
      invites: [],
      isAllDay: false,
      createdAt: (new Date(2021, 7, 26, 22, 30)).toString(),
    },
    'event-2': {
      eventUid: 'event-2',
      eventCreatorUid: 'Rick-1234',
      eventGroupUid: null,
      startDate: (new Date(2021, 7, 26, 22, 30)).toString(),
      endDate: (new Date(2021, 7, 29, 23, 30)).toString(),
      title: 'Sample Multiday Event',
      description: 'This is a sample multiday event',
      themeColor: 0,
      location: '',
      invites: [],
      isAllDay: false,
      createdAt: (new Date(2021, 7, 26, 22, 30)).toString(),
    },
    'event-3': {
      eventUid: 'event-3',
      eventCreatorUid: 'Rick-1234',
      eventGroupUid: null,
      startDate: (new Date(2021, 7, 25, 0, 0)).toString(),
      endDate: (new Date(2021, 7, 25, 23, 59)).toString(),
      title: 'Sample Whole Day Event',
      description: 'This is a sample multiday event',
      themeColor: 0,
      location: '',
      invites: [],
      isAllDay: true,
      createdAt: (new Date(2021, 7, 26, 22, 30)).toString(),
    },
  }
}

export const getInitialEventGroups = () => {
  return {
    'group-0': {
      groupUid: 'group-0',
      repeatType: EventRepeatTypes.DAILY,
      repeatChanges: {
        '2021-8-29': {
          type: RepeatChangesTypes.CHANGE,
          payload: {
            title: 'Changed Title'
          }
        }
      }
    }
  }
}

export const getInitialInvited = () => {
  return {
    'Rick-1234': [],
    'Jason-1234': [],
    'Paul-1234': [],
    'Jenny-1234': [],
    'Sylvia-1234': [],
    'Paula-1234': [],
  }
}

export const getInitialEventInvites = () => {
  return {
    'event-0': [
      {
        userUid: 'Jason-1234',
        status: 0
      }
    ]
  }
}

export const getInitialUsers = () => {
  return {
    'Rick-1234': {
      userUid: 'Rick-1234',
      displayName: 'Rick',
      email: 'rick@zmail.com',
      photoUrl: 'https://gravatar.com/avatar/762cbbab74ca0b222c1aaed8948be973?s=400&d=identicon&r=x',
      timezone: '',
      defaultThemeColor: 0,
      friendsUidList: []
    },
    'Jason-1234': {
      userUid: 'Jason-1234',
      displayName: 'Jason',
      email: 'jason@zmail.com',
      photoUrl: 'https://gravatar.com/avatar/4ca469ca1aaf654b4ea9b66d707633dd?s=400&d=identicon&r=x',
      timezone: '',
      defaultThemeColor: 0,
      friendsUidList: []
    },
    'Paul-1234': {
      userUid: 'Paul-1234',
      displayName: 'Paul',
      email: 'paul@zmail.com',
      photoUrl: 'https://gravatar.com/avatar/b93feab801e929f410d7a154690e1c51?s=400&d=identicon&r=x',
      timezone: '',
      defaultThemeColor: 0,
      friendsUidList: []
    },
    'Jenny-1234': {
      userUid: 'Jenny-1234',
      displayName: 'Jenny',
      email: 'jenny@zmail.com',
      photoUrl: 'https://gravatar.com/avatar/812a467548d161b286f205c93ec790c7?s=400&d=identicon&r=x',
      timezone: '',
      defaultThemeColor: 0,
      friendsUidList: []
    },
    'Sylvia-1234': {
      userUid: 'Sylvia-1234',
      displayName: 'Sylvia',
      email: 'sylvia@zmail.com',
      photoUrl: 'https://gravatar.com/avatar/5510d8bfdaec458391dde465e150b4d2?s=400&d=identicon&r=x',
      timezone: '',
      defaultThemeColor: 0,
      friendsUidList: []
    },
    'Paula-1234': {
      userUid: 'Paula-1234',
      displayName: 'Paula',
      email: 'paula@zmail.com',
      photoUrl: 'https://gravatar.com/avatar/112af9daaf0c5dde5e9dc9ce2bb65748?s=400&d=identicon&r=x',
      timezone: '',
      defaultThemeColor: 0,
      friendsUidList: []
    }
  }
}
