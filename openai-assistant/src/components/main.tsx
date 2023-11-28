"use client";

import {Assistant} from '@prisma/client';
import {useCallback, useState} from "react";
import {FieldValues, SubmitHandler, useForm} from "react-hook-form";
import {ChatgptComponent} from "@openai-assistant/components/chatgpt.component";
import {AssistantList} from "@openai-assistant/components/assistant.list";
import {TriggerProvider} from "@trigger.dev/react";

export interface ExtendedAssistant extends Assistant {
    pending?: boolean;
    eventId?: string;
}
export default function Main({list}: {list: ExtendedAssistant[]}) {
    const [assistantState, setAssistantState] = useState(list);
    const {register, handleSubmit} = useForm();

    const submit: SubmitHandler<FieldValues> = useCallback(async (data) => {
        const assistantResponse = await (await fetch('/api/assistant', {
            body: JSON.stringify({url: data.url}),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })).json();
        
        setAssistantState([...assistantState, {...assistantResponse, url:  data.url, pending: true}]);
    }, [assistantState])

    const deleteFromList = useCallback((val: ExtendedAssistant) => () => {
        fetch(`/api/assistant/${val.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        setAssistantState(assistantState.filter(v => v.id !== val.id));
    }, [assistantState])

    const changeStatus = useCallback((val: ExtendedAssistant) => async () => {
        const assistantResponse = await (await fetch(`/api/assistant?url=${val.url}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })).json();
        setAssistantState([...assistantState.filter((v) => v.id), assistantResponse]);
    }, [assistantState])

    return (
        <div className="w-full max-w-2xl mx-auto p-6 flex flex-col gap-4">
            <form className="flex items-center space-x-4" onSubmit={handleSubmit(submit)}>
                <input className="flex-grow p-3 border border-black/20 rounded-xl" placeholder="Add documentation link" type="text" {...register('url', {required: 'true'})} />
                <button className="flex-shrink p-3 border border-black/20 rounded-xl" type="submit">
                    Add
                </button>
            </form>
            <div className="divide-y-2 divide-gray-300 flex gap-2 flex-wrap">
                <TriggerProvider publicApiKey={process.env.NEXT_PUBLIC_TRIGGER_PUBLIC_API_KEY!}>
                    {assistantState.map(val => (
                        <AssistantList key={val.url} deleteFromList={deleteFromList(val)} val={val} onFinish={changeStatus(val)} />
                    ))}
                </TriggerProvider>
            </div>
            {assistantState.filter(f => !f.pending).length > 0 && <ChatgptComponent list={assistantState} />}
        </div>
    )
}
