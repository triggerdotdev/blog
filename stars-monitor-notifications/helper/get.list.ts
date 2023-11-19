import {prisma} from "./prisma";
import {groupBy, sortBy} from "lodash";
import {Repository} from "@prisma/client";

function fixStars (arr: any[]): Array<{name: string, stars: number, month: number, year: number}> {
    return arr.map((current, index) => {
        return {
            ...current,
            stars: current.stars + arr.slice(index + 1, arr.length).reduce((acc, current) => acc + current.stars, 0),
        }
    }).reverse();
}

export const getList = async (data?: Repository[]) => {
    const repo = data || await prisma.repository.findMany();
    const uniqMonth = Object.values(
        groupBy(
            sortBy(
                Object.values(
                    groupBy(repo, (p) => p.name + '-' + p.year + '-' + p.month))
                    .map(current => {
                        const stars = current.reduce((acc, current) => acc + current.stars, 0);
                        return {
                            name: current[0].name,
                            stars,
                            month: current[0].month,
                            year: current[0].year
                        }
                    }),
            [(p: any) => -p.year, (p: any) => -p.month]
        ),p => p.name)
    );

    const fixMonthDesc = uniqMonth.map(p => fixStars(p));

    return fixMonthDesc.map(p => ({
        name: p[0].name,
        list: p
    }));
}