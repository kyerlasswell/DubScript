<# 
    Import a .csv into DubScript and it will automatically rename the original files,
    move them to the proper folder, convert them to .wav
#>

. "$PSScriptRoot\Write-Log.ps1" #Loads Write-Log cmdlet (which should be in the same folder as this script)
$csv = Import-Csv "C:\Users\Music Director\DubScript\dublist\dublist.csv"
$original_path = Get-ChildItem "P:\Media Shooter\" -Recurse -File
$destination_path = "S:\Spots\"

# For each entry in the dublist
foreach($line in $csv) { 
    # For every file in the Media Shooter folder
    foreach($file in $original_path) { 
        $current_name = $file.FullName
        $moved_original = $destination_path + $line.new + $file.Extension
        $converted_name = $destination_path + $line.new + ".wav"
        
        # Check if a given filename matches dublist entry.
        # If there is a match, copy the file to the Spots 
        # folder with the new name from the dublist.
        # Convert the copied file to .wav and delete the .mp3 version
        if(($current_name -like "*"+$line.current+$file.Extension)) {
            Copy-Item $current_name $moved_original -Verbose
            & ffmpeg.exe -y -i $moved_original $converted_name
            Remove-Item $moved_original -Verbose
            Write-Log -Message "$current_name >> $converted_name"
        } 
    }
}
# If running in the console, wait for input before closing.
if ($Host.Name -eq "ConsoleHost") {
    Write-Host "Complete. Press any key to exit."
    $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyUp") > $null
}