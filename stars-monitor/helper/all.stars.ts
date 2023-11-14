import axios from "axios";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const requestAmount = 20;

export const getAllGithubStars = async (owner: string, name: string) => {
    // Get the amount of stars from GitHub
    const totalStars = (await axios.get(`https://api.github.com/repos/${owner}/${name}`, {
        headers: {
            authorization: `token ${process.env.TOKEN}`,
        },
    })).data.stargazers_count;

    // get total pages
    const totalPages = Math.ceil(totalStars / 100);

    // How many pages to skip? We don't want to spam requests
    const pageSkips = totalPages < requestAmount ? requestAmount : Math.ceil(totalPages / requestAmount);

    // Send all the requests at the same time
    const starsDates = (await Promise.all([...new Array(requestAmount)].map(async (_, index) => {
        const getPage = (index * pageSkips) || 1;
        return (await axios.get(`https://api.github.com/repos/${owner}/${name}/stargazers?per_page=100&page=${getPage}`, {
            headers: {
                Accept: "application/vnd.github.v3.star+json",
                authorization: `token ${process.env.TOKEN}`,
            },
        })).data;
    }))).flatMap(p => p).reduce((acc: any, stars: any) => {
        const yearMonth = stars.starred_at.split('T')[0];
        acc[yearMonth] = (acc[yearMonth] || 0) + 1;
        return acc;
    }, {});

    // how many stars did we find from a total of `requestAmount` requests?
    const foundStars = Object.keys(starsDates).reduce((all, current) => all + starsDates[current], 0);

    // Find the earliest date
    const lowestMonthYear = Object.keys(starsDates).reduce((lowest, current) => {
        if (lowest.isAfter(dayjs.utc(current.split('T')[0]))) {
            return dayjs.utc(current.split('T')[0]);
        }
        return lowest;
    }, dayjs.utc());

    // Convert every possible date to array length
    const splitDate = dayjs.utc().diff(lowestMonthYear, 'day') + 1;

    // Create an array with the amount of stars we didn't find
    const array = [...new Array(totalStars - foundStars)];

    // Set the amount of value to add proportionally for each day
    let splitStars: any[][] = [];
    for (let i = splitDate; i > 0; i--) {
        splitStars.push(array.splice(0, Math.ceil(array.length / i)));
    }

    // Calculate the amount of stars for each day
    return [...new Array(splitDate)].map((_, index, arr) => {
        const yearMonthDay = lowestMonthYear.add(index, 'day').format('YYYY-MM-DD');
        const value = starsDates[yearMonthDay] || 0;
        return {
            stars: value + splitStars[index].length,
            date: {
                month: +dayjs.utc(yearMonthDay).format('M'),
                year: +dayjs.utc(yearMonthDay).format('YYYY'),
                day: +dayjs.utc(yearMonthDay).format('D'),
            }
        };
    });
}