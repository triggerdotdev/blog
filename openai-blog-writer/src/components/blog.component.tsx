"use client";

import {FC, useCallback, useEffect, useState} from "react";
import {ExtendedAssistant} from "@openai-assistant/components/main";
import {SubmitHandler, useForm} from "react-hook-form";
import {useEventRunDetails} from "@trigger.dev/react";

interface Blog {
    title: string,
    aId: string;
}

export const BlogComponent: FC<{list: ExtendedAssistant[]}> = (props) => {
    const {list} = props;
    const {register, formState, handleSubmit} = useForm<Blog>();
    const [event, setEvent] = useState<string | undefined>(undefined);

    const addBlog: SubmitHandler<Blog> = useCallback(async (param) => {
        const {eventId} = await (await fetch('/api/blog', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(param)
        })).json();

        setEvent(eventId);
    }, []);

    return (
        <>
        <form className="flex flex-col gap-3 mt-5" onSubmit={handleSubmit(addBlog)}>
            <div className="flex flex-col gap-1">
                <div className="font-bold">Assistant</div>
                <select className="border border-gray-200 rounded-xl py-2 px-3" {...register('aId', {required: true})}>
                    {list.map(val => (
                        <option key={val.id} value={val.aId}>{val.url}</option>
                    ))}
                </select>
            </div>
            <div className="flex flex-col gap-1">
                <div className="font-bold">Title</div>
                <input className="border border-gray-200 rounded-xl py-2 px-3" placeholder="Blog title" {...register('title', {required: true})} />
            </div>
            <button className="border border-gray-200 rounded-xl py-2 px-3 bg-gray-100 hover:bg-gray-200" disabled={formState.isSubmitting}>Create blog</button>
        </form>
            {!!event && (
                <Blog eventId={event} />
            )}
        </>
    )
}

export const Blog: FC<{eventId: string}> = (props) => {
    const {eventId} = props;
    const { data, error } = useEventRunDetails(eventId);

    if (data?.status !== 'SUCCESS') {
        return <div className="pointer bg-yellow-300 border-yellow-500 p-1 px-3 text-yellow-950 border rounded-2xl">Loading</div>
    }
    return (
        <div>
            <a href={`http://localhost:3000/blog/${data.output.fileName}`}>Check blog post</a>
        </div>
    )
};