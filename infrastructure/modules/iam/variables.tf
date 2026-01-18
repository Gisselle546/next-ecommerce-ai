variable "role_name" {
  type    = string
  default = "ecomrest-github-actions"
}

variable "github_sub_condition" {
  description = <<-EOT
    Condition value for the OIDC token subject (token.actions.githubusercontent.com:sub).
    Default allows any repo on the main branch: "repo:*/*:ref:refs/heads/main".
    For tighter security set to "repo:OWNER/REPO:ref:refs/heads/main".
  EOT
  type    = string
  default = "repo:*/*:ref:refs/heads/main"
}

variable "db_secret_arn" {
  description = "Optional ARN of the Secrets Manager secret for the DB. If empty policy uses '*'."
  type        = string
  default     = ""
}
