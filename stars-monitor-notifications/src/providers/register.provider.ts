import {Schema} from "zod";

export function registerProvider<T>(
    name: string,
    options: {active: boolean},
    validation: Schema<T>,
    run: (libName: string, stars: number, values: T) => Promise<void>
) {
    // if not active, we can just pass an empty function, nothing will run
    if (!options.active) {
        return () => {};
    }

    // will validate and remove unnecessary values (Security wise)
    const env = validation.parse(process.env);

    // return the function we will run at the end of the job
    return async (libName: string, stars: number) => {
        console.log(`Running provider ${name}`);
        await run(libName, stars, env as T);
        console.log(`Finished running provider ${name}`);
    }
}