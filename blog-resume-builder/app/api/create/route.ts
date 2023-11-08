import {NextRequest, NextResponse} from "next/server";
import {client} from "@/trigger";

export async function POST(req: NextRequest) {
    const data = await req.formData();
    const allArr = {
        name: data.getAll('companies[][companyName]'),
        position: data.getAll('companies[][position]'),
        workedYears: data.getAll('companies[][workedYears]'),
        technologies: data.getAll('companies[][technologies]'),
    };

    const payload = {
        firstName: data.get('firstName'),
        lastName: data.get('lastName'),
        photo: Buffer.from((await (data.get('photo[0]') as File).arrayBuffer())).toString('base64'),
        email: data.get('email'),
        companies: allArr.name.map((name, index) => ({
            companyName: allArr.name[index],
            position: allArr.position[index],
            workedYears: allArr.workedYears[index],
            technologies: allArr.technologies[index],
        })).filter((company) => company.companyName && company.position && company.workedYears && company.technologies)
    }

    await client.sendEvent({
        name: 'create.resume',
        payload
    });

    return NextResponse.json({ })
}

export const runtime = 'nodejs';