"use client";

import {FC, useEffect} from "react";
import {ExtendedAssistant} from "@openai-assistant/components/main";
import {useEventRunDetails} from "@trigger.dev/react";

export const Loading: FC<{eventId: string, onFinish: () => void}> = (props) => {
    const {eventId} = props;
    const { data, error } = useEventRunDetails(eventId);

    useEffect(() => {
        if (!data || error) {
            return ;
        }

        if (data.status === 'SUCCESS') {
            props.onFinish();
        }
    }, [data]);

    return <div className="pointer bg-yellow-300 border-yellow-500 p-1 px-3 text-yellow-950 border rounded-2xl">Loading</div>
};

export const AssistantList: FC<{val: ExtendedAssistant, deleteFromList: () => void, onFinish: () => void}> = (props) => {
    const {deleteFromList, val, onFinish} = props;
    if (val.pending) {
        return <Loading eventId={val.eventId!} onFinish={onFinish} />
    }

    return (
        <div key={val.url} onClick={deleteFromList} className="pointer relative bg-green-300 border-green-500 p-1 px-3 text-green-950 border rounded-2xl hover:bg-red-300 hover:border-red-500 hover:text-red-950 before:content-[attr(data-content)] hover:before:invisible hover:after:left-[50%] hover:after:-translate-x-[50%] hover:after:absolute hover:after:content-['Delete']" data-content={val.url} />
    )
}