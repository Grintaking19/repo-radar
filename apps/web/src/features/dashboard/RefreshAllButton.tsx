import { Button } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectTrackedIds } from "../tracked/selectors";
import { githubApi } from "../../services/github/githubApi";
import { QueryStatus } from "@reduxjs/toolkit/query";

export function RefreshAllButton() {
  const dispatch = useAppDispatch();
  const ids = useAppSelector(selectTrackedIds);

  const anyFetching = useAppSelector((state) =>
    ids.some(
      (id) =>
        githubApi.endpoints.getTrackedRepo.select(id)(state)?.status ===
        QueryStatus.pending,
    ),
  );

  return (
    <Button
      size="small"
      variant="outlined"
      disabled={anyFetching || ids.length === 0}
      onClick={() => {
        dispatch(githubApi.util.invalidateTags(["Repo"]));
      }}
    >
      {anyFetching ? "Refreshing..." : "Refresh All"}
    </Button>
  );
}
