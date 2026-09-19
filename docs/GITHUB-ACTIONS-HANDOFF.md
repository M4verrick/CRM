# Codex handoff — CRM Actions modernization

## Decision
Actions already publishes images; approve hardening and release design, not new live deployment. Reviewed 2026-09-19: README and all four workflows. Default branch is **master**. The related `project-2024-25t1-g3-t1` repository contains identical copies of these workflow blobs; do not let two repositories independently control one environment. Confirm which repo is authoritative before any deployment changes.

Current workflows: `build-push-ecr-backend.yml` (ff5bb735...), `build-push-ecr-feature4-backend.yml` (cbdc7787...), `build-push-ecr-frontend.yml` (ba877667...) publish source-SHA-tagged images to public ECR from backend/crm, backend/crm-feature4 and dashboard. They use long-lived AWS access-key secrets and are not gated on the separate backend test workflow. `test-push-backend.yml` (4a586da7...) tests only backend/crm with Java 21 despite its step label saying 23. README references Terraform/EKS/ArgoCD; image-workflow comments mention ECS. Neither proves the current runtime target.

The README includes credential-like sample access values. Do not repeat or authenticate with them. Flag them for owner security review; no automatic revocation or history rewrite.

## Codex tasks
1. Record master SHA and inspect all current manifests, Dockerfiles, Terraform and GitOps paths. Resolve runtime authority and the duplicate-repository relationship with the owner. Preserve native GitOps reconciliation rather than add competing kubectl/ECS updates.
2. Introduce a real CI gate covering both backend modules and dashboard using their exact Maven/npm manifests and lockfiles. Use disposable DB/auth fixtures. Pin actions, minimal permissions and bounded timeouts. Correct the Java step label without an unreviewed runtime upgrade.
3. Refactor image publication so tests for the same source SHA must succeed first. Build immutable images once, scan them, record digests and promote those artifacts. Do not push a publicly accessible image containing private configuration, credentials or customer data. Preserve registry visibility until the owner explicitly reviews it.
4. Replace static AWS credentials with a repository/branch/environment-scoped OIDC role through an owner-executed bootstrap. Document exact ECR permissions and trust conditions, not key values or broad Administrator permissions. PRs cannot acquire publication/deployment credentials; avoid privileged pull_request_target execution.
5. Prepare a manual release/GitOps promotion stage for the confirmed canonical repo only. If ArgoCD owns the cluster, update reviewed manifest image digests through a PR and let it reconcile; do not run a second direct deployer. Separate Terraform plans/apply, database migrations and backup/restore decisions. No automatic infra apply, destructive migration or environment recreation.
6. Define service-specific readiness, rollout timeout and rollback to compatible prior digests. Reverting a deployment must not blindly downgrade a database. Serialize production promotion without cancelling an in-progress release and check environment-review feature availability on the actual plan.

## Acceptance / boundary
Run module/frontend tests and image builds with fake credentials, actionlint and redacted secret/artifact scanning. Test that failed CI, untrusted refs, mismatched digest, missing canonical-repo decision and pending migration approval block publication/deploy. Baseline failures remain visible.

Return small workflow/test/documentation changes and an owner setup checklist. Keep this branch unmerged. Do not trigger existing publishing workflows, push images, change IAM, rotate secrets, create resources or mutate production. This handoff is not a claim that the historical AWS infrastructure still exists.

References: https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-aws
