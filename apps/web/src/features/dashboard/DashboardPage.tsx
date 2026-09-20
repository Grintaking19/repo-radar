import { Typography } from "@mui/material";
import { useAppSelector } from "../../app/hooks";
import { selectTrackedRepos } from "../tracked/selectors";


export function DashboardPage() {
    const repos = useAppSelector(selectTrackedRepos);
    return (
        <>
        <Typography variant="h1" sx={{ mb:3 }}>
            Tracked Repositories
        </Typography>
        <Typography variant="body1">
            {repos.length === 0
                ? "You are not tracking any repositories yet."
                : `You are tracking ${repos.length} repositories.`}
        </Typography>
        {repos.length > 0 && (
            <ul>
                {repos.map((repo) => (
                    <li key={repo.id}>
                        {repo.fullName
                        } - {repo.description}
                    </li>
                ))}
            </ul>
        )}
        </>
    );
}