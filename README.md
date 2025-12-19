# DSA Sheet (MERN)

This project is a minimal MERN stack implementation for a DSA sheet assignment.

Folders:
- `backend/` - Express + Mongoose API
- `frontend/` - React (Vite)

Quick start (backend):
1. Copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET`.
2. cd backend && npm install
3. npm run seed (optional) to add sample topics/problems
4. npm run dev

Quick start (frontend):
1. cd frontend && npm install
2. npm run dev (the app expects backend at `http://localhost:5000` by default)
3. You can register a new user via the frontend at `/register` (or call `/api/auth/register` directly).

Dev helpers:
- If Topics are empty (development only) you can populate sample data by POSTing to `/api/admin/seed` (only allowed when NODE_ENV !== 'production'). The frontend shows a "Populate sample data" button when no topics exist.

Let me know if you want me to wire up registration UI, persist checkbox states with real data in frontend, or add an admin interface to manage topics and problems.

## Deploying to AWS (recommended: ECS/Fargate + MongoDB Atlas + S3+CloudFront)

This project includes starter deployment artifacts to push the backend as a Docker image to ECR and run it on ECS/Fargate, and to host the frontend on S3 + CloudFront. It also contains minimal Terraform templates to create an ECR repo, ECS cluster and an S3 bucket.

### What I added
- `backend/Dockerfile` — containerize the backend
- `.github/workflows/backend-deploy.yml` — GitHub Actions to build/push image to ECR and update ECS service (uses GitHub OIDC role)
- `.github/workflows/frontend-deploy.yml` — build frontend and sync to S3, invalidate CloudFront
- `.github/workflows/eb-deploy.yml` — deploy backend to Elastic Beanstalk (uses OIDC or static creds)
- `deploy/terraform/*` — minimal Terraform templates (ECR, ECS cluster, S3) and optional Elastic Beanstalk templates
- `deploy/ecs/task-definition.json.template` — task definition template used by the backend workflow

### Topics endpoint behavior
- `GET /api/topics` is now public (no login required). If a user provides a valid Authorization token, the response will include per-problem `completed` flags for that user. This allows the Topics page to load for anonymous visitors and still show progress for logged-in users.
- There is a dev-only seed endpoint (`POST /api/admin/seed`) that the frontend uses to auto-populate sample data during development. Auto-seed runs silently on first non-silent load and once per browser session.
- For debugging, there's a simple DB health endpoint: `GET /api/admin/db-check` (dev use) which returns the Mongoose connection state.

#### Seeding production safely ✅
If you want the same curated DSA topics and problems in your production database (MongoDB Atlas), use the provided production-safe seeder which performs *idempotent upserts* (it will only add missing problems and topics and will not delete or overwrite existing data).

1. Add your production `MONGO_URI` to the environment where you will run the script (Elastic Beanstalk environment, a one-off CI job, or a machine with access to Atlas).
2. For safety, you must set `FORCE_PROD_SEED=1` (or `true`) in the same environment to allow the script to run.
3. Run the script from the `backend/` folder:

```bash
# example (run locally pointing to your Atlas cluster)
cd backend
MONGO_URI="<your-atlas-uri>" FORCE_PROD_SEED=1 node seedProduction.js
```

Recommendations:
- Use a CI job (e.g., GitHub Actions) or a one-off deployment task (Elastic Beanstalk `eb ssh` then run the above) so you don't expose secrets on a developer machine.
- The script is intentionally guarded and idempotent; it checks for existing problems/topics by title and only creates missing entries.
- If you'd like, I can add a GitHub Actions job that runs the seeder against your production DB using your `MONGO_URI` repository secret and GitHub OIDC (recommended).

### Troubleshooting connection issues
- If the Topics page shows no data and you expected seeded topics, restart the backend and check DB connection with the `/api/admin/db-check` endpoint.
- Logs show whether the server connected to MongoDB or started an in-memory MongoDB instance (the latter means your `MONGO_URI` was not used or failed to connect).
- Make sure `MONGO_URI` is set correctly (and that Atlas allows connections from your environment).

### Prerequisites
1. An AWS account and ability to create IAM roles and resources
2. A MongoDB Atlas cluster (recommended) or MongoDB URI for production
3. Create a GitHub OIDC role in AWS for Actions or provide AWS credentials as GitHub Secrets (less secure)
4. Create an S3 bucket and CloudFront distribution (or use the Terraform templates as a starting point)

### GitHub Secrets / required variables
- `AWS_ROLE_TO_ASSUME` – ARN of the IAM role Actions should assume (recommended) or set AWS static creds (`AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`)
- `AWS_REGION` – e.g. `us-east-1`
- `EB_APP` - Elastic Beanstalk application name
- `EB_ENV` - Elastic Beanstalk environment name
- `EB_S3_BUCKET` - S3 bucket used by the EB workflow to upload application versions
- `S3_BUCKET` – frontend bucket name (used by frontend workflow)
- `CLOUDFRONT_ID` – CloudFront distribution id for invalidations
- `MONGO_URI` – Atlas connection string (backend runtime secret)
- `JWT_SECRET` – backend JWT secret

#### Using GitHub OIDC + a minimal IAM role (recommended, no static AWS keys)
You can configure an IAM role for GitHub Actions to assume via GitHub OIDC. Grant the role only the permissions it needs to update EB and upload app versions. An example policy is included at `deploy/iam/eb-oidc-role-policy.json` — update variables (`EB_S3_BUCKET`, `AWS_REGION`, `AWS_ACCOUNT_ID`) to match your account.

**Step-by-step (Console)**
1. Open the AWS Console → **IAM** → **Roles** → **Create role**.
2. Select **Web identity** as the trusted entity type and choose the provider `token.actions.githubusercontent.com` (GitHub). If you don't have the provider set up, create it with the audience `sts.amazonaws.com`.
3. For the **Conditions** / subject (`sub`) add the repo restriction (this prevents other repos from using the role):
   - `token.actions.githubusercontent.com:sub` = `repo:OWNER/REPO:ref:refs/heads/main` (replace OWNER and REPO and branch as needed)
4. Attach the policy found at `deploy/iam/eb-oidc-role-policy.json` (update placeholder ARNs / region / account values).
5. Finish creating the role and copy the **Role ARN**.
6. In GitHub → Repository → Settings → Secrets & variables → Actions add a secret `AWS_ROLE_TO_ASSUME` with the Role ARN.

**Step-by-step (AWS CLI)**
1. Update `deploy/iam/github-oidc-trust-policy.json`: replace `AWS_ACCOUNT_ID`, `OWNER`, and `REPO` placeholders to match your environment and target branch.
2. Run the provided script to create the role and attach the policy:

```bash
chmod +x deploy/iam/create-oidc-role-commands.sh
./deploy/iam/create-oidc-role-commands.sh
```

The script will print the Role ARN which you should copy into the `AWS_ROLE_TO_ASSUME` repository secret.

**Notes & security tips**
- Restrict the `sub` condition to the exact repo and branch (or add multiple `sub` values for specific branches) to prevent other repos from assuming the role.
- Prefer the OIDC role approach over static AWS keys stored in GitHub Secrets.
- If you later want the role to provision SSM parameters or read them at runtime, attach the `deploy/iam/ssm-put-parameter-policy.json` or a read-only SSM policy.

If you'd like, I can also:
- Create a PR that updates `deploy/iam/github-oidc-trust-policy.json` with your repo details and run the CLI script from my side (you must provide the AWS account and confirm), or
- Give exact Console screenshots / steps for your AWS region.

If you'd like, I can add a second workflow that writes secrets into SSM parameter store from GitHub Secrets (useful if you want your app to read values from SSM rather than EB env vars).

### Syncing secrets to SSM Parameter Store (optional, free/low-cost)
A manual workflow is included at `.github/workflows/ssm-secrets-sync.yml` which will copy `MONGO_URI` and `JWT_SECRET` from GitHub repository secrets into SSM Parameter Store. By default it writes **SecureString** parameters under the prefix `/dsa-sheet/prod` but you can change the prefix and parameter type when triggering the workflow.

- To run it: go to GitHub → Actions → "Sync Repo Secrets to SSM Parameter Store" → Run workflow. Ensure `AWS_ROLE_TO_ASSUME` and `AWS_REGION` are configured secrets.
- The repo also includes a minimal IAM policy example for this (`deploy/iam/ssm-put-parameter-policy.json`). Attach a policy like this to your OIDC role so the Action can push params.

Runtime usage:
- The backend now includes `backend/secrets/loadFromSSM.js` which attempts to read `/dsa-sheet/prod/MONGO_URI` and `/dsa-sheet/prod/JWT_SECRET` (or the prefix configured via `SSM_PARAM_PREFIX`) at startup and populate `process.env` values if present.
- This means you can either: 1) have the EB workflow set environment variables directly from secrets (existing behavior), or 2) sync secrets to SSM and let the app read them on startup (useful for ECS task roles / Parameter Store patterns).

Vercel notes: to deploy backend as Serverless Functions on Vercel, the backend is exported as a serverless handler under `backend/api/index.js`, which ensures a DB connection is established before processing each request. Set `MONGO_URI` and `JWT_SECRET` in the Vercel project Environment Variables and connect the repo to Vercel to deploy both frontend and backend together.

Vercel deploy workflow
- I added `.github/workflows/vercel-deploy.yml` which deploys to Vercel on push to `main` or manually via Actions.
- To allow the workflow to deploy, add the following repository secrets in GitHub: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` (create these in your Vercel dashboard and paste them into GitHub secrets).

What I removed
- AWS-focused automation and IAM helpers (EB deploy, SSM sync, trust policy templates) were removed to keep the repository lean for Vercel deployment.
- SSM/Secrets Manager loaders and related IAM policy examples were removed; the app will use Vercel environment variables for production secrets.

How to finish deploy (quick checklist):
1. Connect this repository in Vercel (https://vercel.com/new) and create a project (select your org & project settings).
2. In Vercel project settings → Environment Variables add `MONGO_URI` and `JWT_SECRET` (and `NODE_ENV=production` if you want).
3. Add GitHub repo secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` (if you want Actions to deploy automatically).
4. Push to `main` — the deploy workflow will run and deploy to Vercel.

If you'd like, I can open a PR that removes the AWS files fully (this change is destructive if you want them back).

Security notes:
- `SecureString` uses AWS-managed KMS by default and encrypts values at rest; using SecureString is recommended for sensitive values but may have KMS-related costs in rare cases.
- If you ever commit secrets accidentally, rotate the DB credentials immediately and update the repository secrets/SSM values.

> Security note: add the `MONGO_URI` as a GitHub repository secret (Settings → Secrets & variables → Actions) — do not commit it to source control. After rotating your DB password in Atlas, update the `MONGO_URI` secret to reflect the new password.

### Terraform (optional)
- `deploy/terraform` contains minimal templates — run `terraform init` and `terraform apply` to create resources.
- It now includes an optional Elastic Beanstalk application and environment (`elastic_beanstalk.tf`) and a note about the Docker solution stack. **Keep in mind**: EB will provision EC2 instances (t2 micro fit Free Tier in many regions initially). Review Terraform outputs before applying to avoid unexpected costs. Extend the templates for ALB, CloudFront and Route53 as needed.

### Recommended deploy flow
1. Provision infra (Terraform or AWS Console): ECR repo, ECS cluster, S3 bucket, (CloudFront)
2. Set the GitHub repo secrets listed above
3. Push to `main` — GitHub Actions will build and push the backend image, register a new task definition and trigger a service update; it will also build the frontend and publish to S3 and invalidate CloudFront.

If you want, I can provision the AWS resources (using Terraform) and set up the GitHub OIDC role and a secure deploy pipeline — tell me and I’ll prepare the infrastructure changes and role policy templates.
