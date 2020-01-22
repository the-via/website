$response = curl https://api.github.com/repos/the-via/firmware/contents
$files = $response.Content | ConvertFrom-Json

$firmwareList = "C:\temp\firmware.txt"
$keyboardList = "C:\temp\keyboards.txt"

"" > $firmwareList
"| Compatible as of $((Get-Date).ToString('dd MMM yyyy')) |" > $keyboardList
"| --------------------------- |" >> $keyboardList

$textInfo = (Get-Culture).TextInfo
$files | % {
    $path = $_.path.Trim()
    if ($path.EndsWith(".hex") -or $path.EndsWith(".bin")) {
        "<Download filename=""$path""></Download>" >> $firmwareList
        $name = $_.name -replace "_via.(hex|bin)", "" -replace "_", " "
        "| $($textInfo.ToTitleCase($name)) |" >> $keyboardList
    }
} 

#TODO: grab keyboard names for supported keyboards and run on build