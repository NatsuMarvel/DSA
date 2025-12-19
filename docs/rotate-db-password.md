# Rotate MongoDB Atlas Password (quick guide)

If your MongoDB URI (password) was committed, rotate the database user's password immediately.

1. Sign in to MongoDB Atlas → Security → Database Access
2. Find the database user (e.g., `vinaytadela_db_user`) and click **Edit**
3. Set a new password and save (Atlas will update credentials)
4. Update your runtime secrets:
   - Vercel: Project → Settings → Environment Variables → update `MONGO_URI` with the new password
   - GitHub (if using secrets for other workflows): Settings → Secrets & variables → Actions → update `MONGO_URI`
5. Remove the old commit containing the secret from history if necessary (use `git revert` or `git filter-repo` / BFG) — see notes below.

Notes:
- If the secret was ever pushed to a public repo, treat it as compromised and rotate credentials immediately.
- To remove the secret from history, consider using BFG Repo Cleaner or `git filter-repo`. This rewrites history and requires force-push and coordination with collaborators.

Example (BFG):

1. Install BFG (https://rtyley.github.io/bfg-repo-cleaner/)
2. `java -jar bfg.jar --delete-files backend/.env`
3. `git reflog expire --expire=now --all && git gc --prune=now --aggressive`
4. Force-push the cleaned branch: `git push --force` (coordinate with team)

If you'd like, I can prepare a PR that removes the file and adds `.gitignore`, and I can provide exact BFG commands formatted for your repo.