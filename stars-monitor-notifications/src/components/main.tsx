"use client";
import {useForm} from "react-hook-form";
import axios from "axios";
import {Repository} from "@prisma/client";
import dynamic from "next/dynamic";
import {useCallback, useState} from "react";
const ChartComponent = dynamic(() => import('@/components/chart'), { ssr: false, })

interface List {
    name: string,
    list: Repository[]
}

export default function Main({list}: {list: List[]}) {
    const [repositoryState, setRepositoryState] = useState(list);
    const {register, handleSubmit} = useForm();

    const submit = useCallback(async (data: any) => {
        const {data: repositoryResponse} = await axios.post('/api/repository', {todo: 'add', repository: data.name});
        setRepositoryState([...repositoryState, ...repositoryResponse]);
    }, [repositoryState])

    const deleteFromList = useCallback((val: List) => () => {
        axios.post('/api/repository', {todo: 'delete', repository: `https://github.com/${val.name}`});
        setRepositoryState(repositoryState.filter(v => v.name !== val.name));
    }, [repositoryState])

    return (
        <div className="w-full max-w-2xl mx-auto p-6 space-y-12">
            <form className="flex items-center space-x-4" onSubmit={handleSubmit(submit)}>
                <input className="flex-grow p-3 border border-black/20 rounded-xl" placeholder="Add Git repository" type="text" {...register('name', {required: 'true'})} />
                <button className="flex-shrink p-3 border border-black/20 rounded-xl" type="submit">
                    Add
                </button>
            </form>
            <div className="divide-y-2 divide-gray-300">
                {repositoryState.map(val => (
                    <div key={val.name} className="space-y-4">
                        <div className="flex justify-between items-center py-10">
                            <h2 className="text-xl font-bold">{val.name}</h2>
                            <button className="p-3 border border-black/20 rounded-xl bg-red-400" onClick={deleteFromList(val)}>Delete</button>
                        </div>
                        <div className="bg-white rounded-lg border p-10">
                            <div className="h-[300px]]">
                                <ChartComponent repository={val.list} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
