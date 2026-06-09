terraform {
  required_version = ">= 1.6"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
  }

  # Recommended: store state in Azure Blob Storage so the team shares a single
  # source of truth. Run the bootstrap script in IAC/README.md first, then
  # uncomment this block and fill in the storage account name.
  #
  # backend "azurerm" {
  #   resource_group_name  = "solitarian-tfstate-rg"
  #   storage_account_name = "<your-unique-storage-account-name>"
  #   container_name       = "tfstate"
  #   key                  = "solitarian.tfstate"
  # }
}

provider "azurerm" {
  features {}
  tenant_id       = var.tenant_id
  subscription_id = var.subscription_id
}

# ---------------------------------------------------------------------------
# Resource group
# ---------------------------------------------------------------------------

resource "azurerm_resource_group" "main" {
  name     = var.resource_group_name
  location = var.location

  tags = var.tags
}

# ---------------------------------------------------------------------------
# Azure Static Web App
# ---------------------------------------------------------------------------

resource "azurerm_static_web_app" "main" {
  name                = var.app_name
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku_tier            = var.sku_tier
  sku_size            = var.sku_tier

  tags = var.tags
}

# ---------------------------------------------------------------------------
# Custom domain (optional)
# Before enabling, add a CNAME record at your DNS provider:
#   CNAME  <custom_domain>  →  <app_default_hostname>
# Then uncomment the block below and set custom_domain in tfvars.
# ---------------------------------------------------------------------------

# resource "azurerm_static_web_app_custom_domain" "main" {
#   static_web_app_id = azurerm_static_web_app.main.id
#   domain_name       = var.custom_domain
#   validation_type   = "cname-delegation"
# }
