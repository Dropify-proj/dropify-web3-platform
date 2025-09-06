# Add secure vault to .gitignore to prevent accidental exposure
echo "" >> .gitignore
echo "# Dropify Secure Vault - NEVER COMMIT TO VERSION CONTROL" >> .gitignore
echo ".secure-vault/" >> .gitignore
echo ".secure-vault/**" >> .gitignore
echo "*.vault" >> .gitignore
echo ".vault-salt" >> .gitignore
echo "vault-*.key" >> .gitignore
echo "backup-*.enc" >> .gitignore
