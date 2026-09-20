import { Button } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import type { TrackedRepo } from "../../services/github/types";
import { repoTracked, repoUntracked } from "./trackedSlice";
import { selectIsTracked } from "./selectors";

export function TrackButton({ repo }: { repo: TrackedRepo }) {
  const dispatch = useAppDispatch();
  const isTracked = useAppSelector((state) =>
    selectIsTracked(state, repo.fullName),
  );

  const handleClick = () => {
    if (isTracked) {
      dispatch(repoUntracked(repo.fullName));
    } else {
      dispatch(repoTracked(repo));
    }
  };

  return (
    <Button
      size="small"
      variant={isTracked ? "contained" : "outlined"}
      color={isTracked ? "secondary" : "primary"}
      disableElevation
      onClick={handleClick}
      aria-label={
        isTracked ? `Untrack ${repo.fullName}` : `Track ${repo.fullName}`
      }
    >
      {isTracked ? "Untrack" : "Track"}
    </Button>
  );
}
