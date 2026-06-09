variable "tenant_id" {
  description = "Azure Active Directory tenant ID. Run 'az account list --output table' to find it."
  type        = string
}

variable "subscription_id" {
  description = "Azure subscription ID within the tenant above."
  type        = string
}

variable "location" {
  description = "Azure region for all resources. West Europe is closest to Denmark."
  type        = string
  default     = "West Europe"
}

variable "resource_group_name" {
  description = "Name of the resource group."
  type        = string
  default     = "solitarian-rg"
}

variable "app_name" {
  description = "Name of the Azure Static Web App. Must be globally unique."
  type        = string
  default     = "solitarian"
}

variable "sku_tier" {
  description = "SKU tier for the Static Web App. 'Free' is sufficient for this site; upgrade to 'Standard' for SLA guarantees or private endpoints."
  type        = string
  default     = "Free"

  validation {
    condition     = contains(["Free", "Standard"], var.sku_tier)
    error_message = "sku_tier must be 'Free' or 'Standard'."
  }
}

variable "custom_domain" {
  description = "Custom domain to attach (e.g. solitarian.dk). Leave empty if not yet configured."
  type        = string
  default     = ""
}

variable "tags" {
  description = "Tags applied to all resources."
  type        = map(string)
  default = {
    project     = "solitarian"
    managed-by  = "terraform"
  }
}
