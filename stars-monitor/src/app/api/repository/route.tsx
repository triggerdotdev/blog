import {getAllGithubStars} from "../../../../helper/all.stars";
import {prisma} from "../../../../helper/prisma";
import {Repository} from "@prisma/client";
import {getList} from "../../../../helper/get.list";

export async function POST(request: Request) {
    const body = await request.json();
    if (!body.repository) {
        return new Response(JSON.stringify({error: 'Repository is required'}), {status: 400});
    }

    const {owner, name} = body.repository.match(/github.com\/(?<owner>.*)\/(?<name>.*)/).groups;
    if (!owner || !name) {
        return new Response(JSON.stringify({error: 'Repository is invalid'}), {status: 400});
    }

    if (body.todo === 'delete') {
        await prisma.repository.deleteMany({
            where: {
                name: `${owner}/${name}`
            }
        });

        return new Response(JSON.stringify({deleted: true}), {status: 200});
    }

    const starsMonth = await getAllGithubStars(owner, name);
    const repo: Repository[] = [];
    for (const stars of starsMonth) {
        repo.push(
            await prisma.repository.upsert({
                where: {
                    name_day_month_year: {
                        name: `${owner}/${name}`,
                        month: stars.date.month,
                        year: stars.date.year,
                        day: stars.date.day,
                    },
                },
                update: {
                    stars: stars.stars,
                },
                create: {
                    name: `${owner}/${name}`,
                    month: stars.date.month,
                    year: stars.date.year,
                    day: stars.date.day,
                    stars: stars.stars,
                }
            })
        );
    }
    return new Response(JSON.stringify(await getList(repo)), {status: 200});
}
