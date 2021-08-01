export const ThemeColorTypes = {
	RED: 0,
	GREEN: 1,
	GOLD: 2,
	BLUE: 3,
	CYAN: 4,
	PURPLE: 5,
	BROWN: 6,
}

export const EventRepeatTypes = {
	DAILY: 0,
	WEEKLY: 1,
	BI_WEEKLY: 2,
	MONTHLY: 3,
	WEEK_DAYS: 4,
}

export const EventInviteStatusTypes = {
	PENDING: 0,
	ACCEPTED: 1,
	DECLINED: 2,
}

export const CalendarViewTypes = {
	DAY_VIEW: 0,
	WEEK_VIEW: 1,
	MONTH_VIEW: 2,
	YEAR_VIEW: 3,
}

export const RepeatChangesTypes = {
	CHANGE: 'change',
	DELETE: 'delete',
}

export const MINUTE_SEGMENT_INDEX = {
	0: 0,
	15: 1,
	30: 2,
	45: 3,
}

export const MINUTE_SEGMENT_KEYS = Object.keys(MINUTE_SEGMENT_INDEX);