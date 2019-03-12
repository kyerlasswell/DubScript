<#
    DubScript log generator. Outputs to "DubScript/logs/dslog[date].csv"
#>
function Write-Log {
    [CmdletBinding()]
    param(
        [Parameter()]
        [ValidateNotNullOrEmpty()]
        [string]$Message,

        [Parameter()]
        [ValidateNotNullOrEmpty()]
        [ValidateSet('Information','Warning','Error')]
        [string]$Severity = 'Information'
    )

    [pscustomobject]@{
        Time = (Get-Date -f g)
        Message = $Message
        Severity = $Severity
    } | Export-Csv -Path "logs\dslog$((Get-Date).ToString("yyyyMMdd")).csv" -Append -NoTypeInformation
}