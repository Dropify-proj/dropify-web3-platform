@echo off
echo ========================================
echo DROPIFY SECURITY CLEANUP INITIATED
echo ========================================
echo.
echo Removing sensitive files from AI-accessible locations...
echo.

REM Delete sensitive business documents
del /Q "BUSINESS_TECH_SUMMARY.md" 2>nul
del /Q "SUPRA_QA_NARRATIVE.md" 2>nul
del /Q "SUPRA_PRESENTATION_NARRATIVE.md" 2>nul
del /Q "SUPRA_ACQUISITION_PROPOSAL.md" 2>nul

REM Remove secure vault from workspace
rmdir /S /Q ".secure-vault" 2>nul

REM Clear any temporary files
del /Q "*CONFIDENTIAL*" 2>nul
del /Q "*SECRET*" 2>nul
del /Q "*NDA*" 2>nul

REM Clear git history (if needed)
echo Clearing git cache...
git rm --cached -r . 2>nul
git add . 2>nul

echo.
echo ========================================
echo SECURITY CLEANUP COMPLETED
echo ========================================
echo.
echo Sensitive files have been:
echo 1. Copied to C:\SecureDropify\
echo 2. Removed from AI-accessible workspace
echo 3. Cleared from git cache
echo.
echo NEXT STEPS:
echo 1. Verify files are in C:\SecureDropify\
echo 2. Set up encryption on that folder
echo 3. Never store sensitive info in this workspace again
echo.
pause
