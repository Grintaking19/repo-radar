import { useSearchReposQuery } from "./services/github/githubApi.ts";

function App() {
  const { data, isLoading, isError } = useSearchReposQuery("react");
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error occurred while fetching data.</div>;
  }

  return (
    <ul>
      {data?.map((repo) => (
        <li key={repo.id}>
          <a href={repo.url}>
            {repo.fullName} - {repo.description}
            <br />
            Stars: {repo.stars} | Forks: {repo.forks} | Open Issues:{" "}
            {repo.openIssues}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default App;
