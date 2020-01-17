$response = curl https://api.github.com/repos/the-via/firmware/contents
$files = $response.Content | ConvertFrom-Json
Remove-Item C:\temp\firmware.txt
$files | % {
    $path = $_.path.Trim()
    if ($path.EndsWith(".hex") -or $path.EndsWith(".bin")) {
        "<Download filename=""$path""></Download>"
    }
} >> C:\temp\firmware.txt

#TODO: grab keyboard names for supported keyboards and run on build