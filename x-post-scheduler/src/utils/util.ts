
import { Dispatch, SetStateAction } from "react";
export interface DelSelectedCell {
	content?: string;
	day_id?: number;
	day?: string;
	time_id?: number;
	time?: string;
	published?: boolean;
	minutes?: number;
}
export interface SelectedCell {
	day_id?: number;
	day?: string;
	time_id?: number;
	time?: string;
	minutes?: number;
}

export interface Content {
	minutes?: number;
	content?: string;
	published?: boolean;
	day?: number;
}
export interface AvailableScheduleItem {
	time: number;
	schedule: Content[][];
}
export const tableHeadings: string[] = [
	"Time",
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];
export const availableSchedule: AvailableScheduleItem[] = [
	{
		time: 0,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 1,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 2,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 3,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 4,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 5,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 6,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 7,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 8,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 9,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 10,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 11,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 12,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 13,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 14,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 15,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 16,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 17,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 18,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 19,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 20,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 21,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 22,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 23,
		schedule: [[], [], [], [], [], [], []],
	},
];

export const formatTime = (value: number) => {
	if (value === 0) {
		return `Midnight`;
	} else if (value < 10) {
		return `${value}am`;
	} else if (value >= 10 && value < 12) {
		return `${value}am`;
	} else if (value === 12) {
		return `${value}noon`;
	} else {
		return `${value % 12}pm`;
	}
};

export const fetchSchedule = async (
	profile: string, updateYourSchedule: Dispatch<SetStateAction<AvailableScheduleItem[]>>
) => {
	try {
		const request = await fetch("/api/schedule/read", {
			method: "POST",
			body: JSON.stringify({ profile }),
			headers: {
				"Content-Type": "application/json",
			},
		});
		const response = await request.json();
		
		const { data } = response
		console.log(data)
		if (data) {
			const result = data.map((item: any) => {
				const date = new Date(item.timestamp);
				return {
					time:  date.getUTCHours() + 1 < 24 ? date.getUTCHours() + 1 : 0,
					schedule: {
						content: item.content,
						published: item.published,
						minutes: date.getUTCMinutes(),
						day: item.day_id
					},
			}
			
			}
				
			) 
			result.forEach((object: any) => {
				const matchingObjIndex = availableSchedule.findIndex((largeObj) => largeObj.time === object.time);
				if (matchingObjIndex !== -1) {
					availableSchedule[matchingObjIndex].schedule[object.schedule.day].push(object.schedule)
				}
			})
			updateYourSchedule(availableSchedule)
		}
	} catch (err) {
		console.error(err);
	}

};

export const updateSchedule = async (
	profile: any,
	schedule: any
) => {
	const { day_id, time, minutes, content, published } = schedule
	const timestampFormat = getNextDayOfWeek(day_id, time, minutes)
	try {
	await fetch("/api/schedule/create", {
			method: "POST",
			body: JSON.stringify({profile, timestamp: timestampFormat, content, published, day_id}),
			headers: {
				"Content-Type": "application/json",
			},
		});
        
	} catch (err) {
		console.error(err);
	}

};

export const deleteSchedule = async (
	profile: any,
	schedule: any
) => {
	const { day_id, time_id, minutes, content, published } = schedule
	const timestampFormat = getNextDayOfWeek(day_id, time_id, minutes)

	try {
		await fetch("/api/schedule/delete", {
			method: "POST",
			body: JSON.stringify({ profile, timestamp: timestampFormat,  content}),
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (err) {
		console.error(err);
	}
	
};

export const getNextDayOfWeek = (dayOfWeek: number, hours: number, minutes: number) => {
    var today = new Date();
    var daysUntilNextDay = dayOfWeek - today.getDay();
    if (daysUntilNextDay < 0) {
        daysUntilNextDay += 7;
    }
	today.setDate(today.getDate() + daysUntilNextDay);
	today.setHours(hours);
	today.setMinutes(minutes);
    return today;
}

export const convertToHour = (timestamp: Date) => {
	const date = new Date(timestamp);
	return { day: date.getUTCDate(), hour: date.getUTCHours()+1, minutes: date.getUTCMinutes() }
}

