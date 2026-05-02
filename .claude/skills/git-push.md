# git-push skill

Before pushing to git, always verify:

1. **Branch check** — confirm the current branch is NOT `main`. If it is, stop and tell the user to create a feature branch first.
2. **Co-author cleanup** — scan the commit messages of commits being pushed (unpushed commits since the remote tracking branch) and ensure none contain "Co-Authored-By: Claude" or any variant. The `commit-msg` hook handles this automatically at commit time, but verify before pushing.
3. **Push** — run `git push` (or `git push -u origin <branch>` if no upstream is set yet).

Never use `--no-verify` unless the user has explicitly requested an admin override to push directly to main.
