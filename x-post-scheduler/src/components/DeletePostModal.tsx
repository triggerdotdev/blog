"use client";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, Dispatch, SetStateAction } from "react";
import {
	DelSelectedCell,
	AvailableScheduleItem,
	deleteSchedule,
} from "../utils/util";

interface Props {
	setDeleteEventModal: Dispatch<SetStateAction<boolean>>;
	deleteEventModal: boolean;
	delSelectedCell: DelSelectedCell;
	profile: string | any;
	yourSchedule: AvailableScheduleItem[];
	updateYourSchedule: Dispatch<SetStateAction<AvailableScheduleItem[]>>;
}

const DeletePostModal: React.FC<Props> = ({
	setDeleteEventModal,
	deleteEventModal,
	delSelectedCell,
	yourSchedule,
	updateYourSchedule,
	profile,
}) => {
	const closeModal = () => setDeleteEventModal(false);

	const handleDelete = () => {
		if (
			delSelectedCell.time_id !== undefined &&
			delSelectedCell.day_id !== undefined
		) {
			const initialSchedule = [...yourSchedule];
			let selectedDay =
				initialSchedule[delSelectedCell.time_id].schedule[
					delSelectedCell.day_id - 1
				];
			const updatedPosts = selectedDay.filter(
				(day) =>
					day.content !== delSelectedCell.content &&
					day.minutes !== delSelectedCell.minutes
			);
			initialSchedule[delSelectedCell.time_id].schedule[
				delSelectedCell.day_id - 1
			] = updatedPosts;
			const deletePostDetails = {
				username: localStorage.getItem("username"),
				content: delSelectedCell.content,
				day_id: delSelectedCell.day_id - 1,
				day: delSelectedCell.day,
				time_id: delSelectedCell.time_id,
				time: delSelectedCell.time,
				minutes: delSelectedCell.minutes,
				published: delSelectedCell.published

			}
			deleteSchedule(profile, deletePostDetails);
			updateYourSchedule(initialSchedule);
			closeModal();
		}
	};

	return (
		<div>
			<Transition appear show={deleteEventModal} as={Fragment}>
				<Dialog as='div' className='relative z-10' onClose={closeModal}>
					<Transition.Child
						as={Fragment}
						enter='ease-out duration-300'
						enterFrom='opacity-0'
						enterTo='opacity-100'
						leave='ease-in duration-200'
						leaveFrom='opacity-100'
						leaveTo='opacity-0'
					>
						<div className='fixed inset-0 bg-black bg-opacity-25' />
					</Transition.Child>

					<div className='fixed inset-0 overflow-y-auto'>
						<div className='flex min-h-full items-center justify-center p-4 text-center'>
							<Transition.Child
								as={Fragment}
								enter='ease-out duration-300'
								enterFrom='opacity-0 scale-95'
								enterTo='opacity-100 scale-100'
								leave='ease-in duration-200'
								leaveFrom='opacity-100 scale-100'
								leaveTo='opacity-0 scale-95'
							>
								<Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
									<Dialog.Title
										as='h3'
										className='text-xl font-bold leading-6 text-gray-900'
									>
										Delete post
									</Dialog.Title>
									<div className='mt-2'>
										<p className='mb-3'>Are you sure you want to delete?</p>
										<p className='text-sm text-gray-500'>
											{`"${delSelectedCell.content}" scheduled for ${delSelectedCell.day} at ${delSelectedCell.time_id}:${delSelectedCell.minutes}`}
										</p>
									</div>

									<div className='mt-4 flex items-center justify-between space-x-4'>
										<button
											type='button'
											className='inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
											onClick={handleDelete}
										>
											Yes
										</button>
										<button
											type='button'
											className='inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2'
											onClick={closeModal}
										>
											Cancel
										</button>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</div>
	);
};

export default DeletePostModal;