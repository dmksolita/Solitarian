output "app_url" {
  description = "Default HTTPS hostname assigned to the Static Web App."
  value       = "https://${azurerm_static_web_app.main.default_host_name}"
}

output "api_key" {
  description = "Deployment token. Store this as the AZURE_STATIC_WEB_APPS_API_TOKEN pipeline variable in Azure DevOps."
  value       = azurerm_static_web_app.main.api_key
  sensitive   = true
}
