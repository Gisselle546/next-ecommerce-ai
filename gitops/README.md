# GitOps repo (local scaffold)

This folder is a scaffold for GitOps-driven CD using ArgoCD. It contains production overlays for the `backend` and `client` apps using kustomize. The CI pipeline should update the `REPLACE_IMAGE` placeholders with real image URIs (ECR/GHCR) and push changes to this repository.

Layout

- `apps/prod/<app>`: kustomize overlays for each app. Each overlay contains `namespace.yaml`, `deployment.yaml`, `service.yaml`, and `kustomization.yaml`.
- `argocd/`: ArgoCD `Application` manifests that point ArgoCD to the app overlay paths.

How CI should update images

Example CI step (bash):

```bash
# update backend image
sed -i "s|REPLACE_IMAGE|${ECR_REGISTRY}/${ORG}/ecomrest-backend:${GIT_SHA}|" apps/prod/backend/deployment.yaml

# commit and push
git add apps/prod/backend/deployment.yaml
git commit -m "ci: update backend image"
git push
```

Notes
- Keep secrets out of this repo; use SealedSecrets, ExternalSecrets, or ArgoCD integration with your secret store.
- Replace `REPLACE_IMAGE` placeholders via your CI (we scaffolded a simple workflow earlier).
