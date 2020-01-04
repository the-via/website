$response = curl https://api.github.com/repos/the-via/firmware/contents
$files = $response.Content | ConvertFrom-Json
$files | % {
    $path = $_.path.Trim()
    $downloadUrl = $_.download_url.Trim()
    if ($path.EndsWith(".hex") -or $path.EndsWith(".bin")) {
        "<DownloadAsFile url=""$downloadUrl"" filename=""$path""></DownloadAsFile>"
    }
} >> C:\temp\firmware.txt

#TODO: grab keyboard names for supported keyboards and run on build