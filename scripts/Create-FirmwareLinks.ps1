function Get-TableHeader() {
    return @"
    | Compatible as of $((Get-Date).ToString('dd MMM yyyy')) |
    | ---------------------------- |
"@
}

### Firmware

$response = curl https://api.github.com/repos/the-via/firmware/contents
$files = $response.Content | ConvertFrom-Json

$firmwareList = "C:\temp\firmware.txt"

"" > $firmwareList


$files | % {
    $path = $_.path.Trim()
    if ($path.EndsWith(".hex") -or $path.EndsWith(".bin")) {
        "<Download filename=""$path""></Download>" >> $firmwareList
    }
} 

### Keyboards

$response = curl https://www.caniusevia.com/keyboards.v2.json
$keyboards = ($response.Content | ConvertFrom-Json).definitions

$keyboardList = "C:\temp\keyboards.txt"
Get-TableHeader > $keyboardList

$keyboards.PSObject.Properties | % {
    "| $($_.value.name) |"
} | Sort-Object >> $keyboardList
