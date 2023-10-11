"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
	Content,
	DelSelectedCell,
	SelectedCell,
	availableSchedule,
	fetchSchedule,
	formatTime,
	tableHeadings,
} from "@/utils/util";
import { FaClock } from "react-icons/fa6";
import AddEventModal from "@/components/AddPostModal";
import DeleteEventModal from "@/components/DeletePostModal";

const Dashboard = () => {
	const [yourSchedule, updateYourSchedule] = useState(availableSchedule);
	const [username, setUsername] = useState<string>("")
	const [addEventModal, setAddEventModal] = useState(false);
	const [deleteEventModal, setDeleteEventModal] = useState(false);
	const [selectedCell, setSelectedCell] = useState<SelectedCell>({
		day_id: 0,
		day: "",
		time_id: 0,
		time: "",
	});
	const [delSelectedCell, setDelSelectedCell] = useState<DelSelectedCell>({
		content: "",
		day_id: 0,
		day: "",
		published: false,
		time_id: 0,
		time: "",
		minutes: 0
	});
	
	
	const handleAddEvent = (id: number, time: number) => {
		setSelectedCell({
			day_id: id + 1,
			day: tableHeadings[id + 1],
			time_id: time,
			time: formatTime(time),
		});
		setAddEventModal(true);
	};

	const handleDeleteEvent = (
		e: React.MouseEvent<HTMLParagraphElement>,
		content: Content,
		time: number
	) => {
		e.stopPropagation();
		if (content.day !== undefined) {
			setDelSelectedCell({
				content: content.content,
				day_id: content.day,
				day: tableHeadings[content.day],
				published: content.published,
				time_id: time,
				time: formatTime(time),
				minutes: content.minutes,
			});
			setDeleteEventModal(true);
		}
	};

	const sendAuthRequest = useCallback(async (code: string | null) => {
			try {
			const request = await fetch("/api/twitter/auth", {
				method: "POST",
				body: JSON.stringify({ code }),
				headers: {
					"Content-Type": "application/json",
				},
			})
				const response = await request.json()
			if (response.token_type) {
				localStorage.setItem("username", response.data.username)
				console.log("RES >>", response)
				setUsername(response.data.username)
				fetchSchedule(response.data.username, updateYourSchedule)
			
			}
				
		} catch (err) {
			console.error(err)
		}
		}, [])

	useEffect(() => {
		const params = new URLSearchParams(window.location.href)
		const code = params.get("code")
		const userName = localStorage.getItem("username")
		sendAuthRequest(code)
		if (!userName) {
			sendAuthRequest(code)
		} else {
			setUsername(userName)
			fetchSchedule(userName, updateYourSchedule)
			}
		
	}, [sendAuthRequest]);
	
	

	return (
		<main className='w-full min-h-screen'>
			<header className='w-full flex items-center mb-6 justify-center'>
				<h2 className='text-center font-extrabold text-3xl mr-2'>
					Your Post Schedules
				</h2>
				<FaClock className='text-3xl text-pink-500' />
			</header>
			<div className=" p-8">
			<div className='w-full h-[80vh] overflow-y-scroll'>
				<table className='w-full border-collapse'>
					<thead>
						<tr>
							{tableHeadings.map((day, index) => (
								<th key={index} className='bg-[#F8F0DF] text-lg p-4 font-bold'>
									{day}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{yourSchedule.map((item, index) => (
							<tr key={index}>
								<td className='bg-[#F8F0DF] text-lg font-bold'>
									{formatTime(item.time)}
								</td>
								{item.schedule.map((sch, id) => (
									<td
										key={id}
										onClick={() => handleAddEvent(id, item.time)}
										className='cursor-pointer'
									>
                                        {sch.map((content, ind: number) => (
                                            <div key={ind} onClick={(e) =>
													handleDeleteEvent(e, content, item.time)
												} className={`p-3 ${
													content.published ? "bg-pink-500" : "bg-green-600"
												}  mb-2 rounded-md text-xs cursor-pointer`}
												>
                                                <p className="text-gray-700 mb-2"> {content.minutes === 0? "o'clock" : `at ${content.minutes} minutes past`}</p>
                                                <p
												className=" text-white">
												{content.content}
											</p>
                                            </div>
											
										))}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
			{addEventModal && (
				<AddEventModal
					setAddEventModal={setAddEventModal}
					addEventModal={addEventModal}
						selectedCell={selectedCell}
						yourSchedule={yourSchedule}
						updateYourSchedule={updateYourSchedule}
						profile={username}
				/>
			)}
			{deleteEventModal && (
				<DeleteEventModal
						setDeleteEventModal={setDeleteEventModal}
						deleteEventModal={deleteEventModal}
						delSelectedCell={delSelectedCell}
						yourSchedule={yourSchedule}
						updateYourSchedule={updateYourSchedule}
						profile={"dayvid_JS"}
				/>
				)}
				</div>
		</main>
	);
};

export default Dashboard;