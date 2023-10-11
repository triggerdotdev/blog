import {
	SelectedCell,
	AvailableScheduleItem,
	updateSchedule,
	tableHeadings,
} from "@/utils/util";
import { Dialog, Transition } from "@headlessui/react";
import {
	FormEventHandler,
	Fragment,
	useState,
	Dispatch,
	SetStateAction,
} from "react";

interface Props {
	setAddEventModal: Dispatch<SetStateAction<boolean>>;
	updateYourSchedule: Dispatch<SetStateAction<AvailableScheduleItem[]>>;
	addEventModal: boolean;
	selectedCell: SelectedCell;
	profile: string | any;
	yourSchedule: AvailableScheduleItem[];
}

const AddPostModal: React.FC<Props> = ({
	setAddEventModal,
	addEventModal,
	selectedCell,
	updateYourSchedule,
	profile,
	yourSchedule,
}) => {
	const [content, setContent] = useState<string>("");
	const [minute, setMinute] = useState<number>(0);
	const closeModal = () => setAddEventModal(false);

	const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();
		if (
			Number(minute) < 60 &&
			content.trim().length > 0 &&
			selectedCell.time_id !== undefined &&
			selectedCell.day_id !== undefined
		) {
			const newSchedule = [...yourSchedule];
			const selectedDay =
				newSchedule[selectedCell.time_id].schedule[selectedCell.day_id - 1];
			selectedDay.push({
				content,
				published: false,
				minutes: minute,
				day: selectedCell.day_id,
			});
			const newPostDetails = {
				content,
				published: false,
				minutes: minute,
				day_id: selectedCell.day_id - 1,
				time: selectedCell.time_id,
				day: tableHeadings[selectedCell.day_id]
			}
			console.log(newSchedule)
			updateSchedule(profile, newPostDetails);
			updateYourSchedule(newSchedule);
			closeModal();
		}
	};

	return (
		<div>
			<Transition appear show={addEventModal} as={Fragment}>
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
						<div className='fixed inset-0 bg-black bg-opacity-80' />
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
								<Dialog.Panel className='w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
									<Dialog.Title
										as='h3'
										className='text-xl font-bold leading-6 text-gray-900'
									>
										Schedule a post on {selectedCell.day} by {selectedCell.time}
									</Dialog.Title>

									<form className='mt-2' onSubmit={handleSubmit}>
										{minute > 59 && (
											<p className='text-red-600'>
												Error, please minute must be less than 60
											</p>
										)}
										<label htmlFor='minute' className='opacity-60'>
											How many minutes past?
										</label>
										<input
											type='number'
											className='w-full border-[1px] px-4 py-2 rounded-md mb-2'
											name='title'
											id='title'
											value={minute.toString()}
											onChange={(e) => setMinute(parseInt(e.target.value, 10))}
											max={59}
											required
										/>

										<label htmlFor='content' className='opacity-60'>
											Post content
										</label>
										<textarea
											className='w-full border-[1px] px-4 py-2 rounded-md mb-2 text-sm'
											name='content'
											id='content'
											value={content}
											onChange={(e) => setContent(e.target.value)}
											required
										/>

										<div className='mt-4 flex items-center justify-between space-x-4'>
											<button
												type='submit'
												className='inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
											>
												Save
											</button>

											<button
												type='button'
												className='inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2'
												onClick={closeModal}
											>
												Cancel
											</button>
										</div>
									</form>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</div>
	);
};

export default AddPostModal;