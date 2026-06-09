# IAC — Solitarian Infrastructure

Provisions the Azure hosting for the Solitarian site using Terraform.

**Hosting:** [Azure Static Web Apps](https://learn.microsoft.com/en-us/azure/static-web-apps/) — built-in CDN, automatic SSL, and custom domain support.

---

## Prerequisites

- [Terraform](https://developer.hashicorp.com/terraform/install) ≥ 1.6
- [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli) installed
- Contributor access to the target Azure subscription

---

## First-time setup

### 1. Identify the correct tenant and subscription

Because your account has access to multiple Azure tenants, you must log in explicitly to the right one and confirm which subscription to use.

**List all tenants your account can see:**
```bash
az login
az account list --output table
```

This prints a table with `Name`, `CloudName`, `SubscriptionId`, `TenantId`, and `IsDefault`. Find the row for the Solita Denmark subscription.

**If the right tenant isn't listed** (some tenants require a separate login):
```bash
az login --tenant <TenantId>
```

**Set it as the active context** so all subsequent CLI commands and Terraform use it:
```bash
az account set --subscription <SubscriptionId>
```

**Verify you're in the right place:**
```bash
az account show --output table
```

Copy the `TenantId` and `SubscriptionId` values — you'll need them in step 3.

### 2. (Recommended) Bootstrap remote state storage

Terraform state should be stored remotely so the whole team shares it.
Run this once before initialising Terraform:

```bash
az group create --name solitarian-tfstate-rg --location "West Europe"

az storage account create \
  --name <unique-storage-name> \
  --resource-group solitarian-tfstate-rg \
  --location "West Europe" \
  --sku Standard_LRS \
  --allow-blob-public-access false

az storage container create \
  --name tfstate \
  --account-name <unique-storage-name>
```

Then uncomment the `backend "azurerm"` block in `terraform/main.tf` and fill in the storage account name.

### 3. Configure variables

```bash
cd IAC/terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars — set tenant_id, subscription_id, and app_name at minimum
```

`terraform.tfvars` is gitignored. Never commit it.

### 4. Deploy the infrastructure

```bash
terraform init
terraform plan
terraform apply
```

### 5. Get the deployment token

After `apply`, retrieve the SWA deployment token and add it to Azure DevOps:

```bash
terraform output -raw api_key
```

Add it as a **secret pipeline variable** named `AZURE_STATIC_WEB_APPS_API_TOKEN` in the Azure DevOps pipeline settings.

---

## Azure DevOps pipeline variables

Set these as pipeline variables (secret where noted) in the Azure DevOps pipeline:

| Variable | Secret | Description |
|----------|--------|-------------|
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | ✅ | SWA deployment token (from `terraform output -raw api_key`) |
| `MENU_API_KEY` | ✅ | Bearer token for the canteen API |

---

## Custom domain

1. Run `terraform apply` once without a custom domain to get the default hostname (`terraform output app_url`).
2. Add a `CNAME` record at your DNS provider: `solitarian.dk → <default-hostname>`.
3. Set `custom_domain = "solitarian.dk"` in `terraform.tfvars`.
4. Uncomment the `azurerm_static_web_app_custom_domain` block in `main.tf`.
5. Run `terraform apply` again. Azure will validate the CNAME and provision the SSL certificate automatically (may take a few minutes).

---

## Upgrading SKU

The default SKU is `Free`. To get an SLA and advanced features (auth, private endpoints), change `sku_tier = "Standard"` in `terraform.tfvars` and re-apply.
