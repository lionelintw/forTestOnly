<?php
class Dl
{
    function download($fileName="", $targetFile="")
    {
        set_time_limit(0); // for slow connections
        clearstatcache();//to avoid caching for file_exists(),filesize()
// validate the request, fetch info from database etc
//$fileName = "1.jpg"; // retrieved from a database
        /*
        //處理中文檔名
            $ua = $_SERVER["HTTP_USER_AGENT"];
            $encoded_filename = rawurlencode($fileName);
            if (preg_match("/MSIE/", $ua)) {
             header('Content-Disposition: attachment; filename="' . $encoded_filename . '"');
            } else if (preg_match("/Firefox/", $ua)) {
             header("Content-Disposition: attachment; filename*=\"UTF-8''" . $fileName . '"');
            } else {
             header('Content-Disposition: attachment; filename="' . $fileName . '"');
            }
        //*/
//$targetFile = "./{$fileName}"; // file path
        if (empty($fileName) || !file_exists($targetFile))
        {
            die("File not found.");// output a nice error page
        }
// increment counter and whatever else you need to do
        header("Content-Description: File Transfer");
// $fileName could be replaced in the header below with any
// name you like so long as it has the proper file extension
        header("Content-Disposition: attachment; filename=\"$fileName\"");
//header('Content-type:application/force-download');//Some browsers have troubles with it
        header("Content-Type: application/octet-stream");
        header("Content-Transfer-Encoding: binary");
        header("Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0");
        if (strpos($_SERVER["HTTP_USER_AGENT"], "MSIE") !== false)
        {
            header("Pragma: no-cache");
        }
        header("Expires: -1");
        header("Content-Length: " . filesize($targetFile));
        /*
        ob_start();
        ob_end_clean();
        //上兩行註解程式碼在此可與下兩行程式碼互相替換
        //*/
        ob_clean();
        flush();
        readfile($targetFile);
//header("X-Sendfile: $targetFile");//for very large files with PHP,如使用Apache模組可取代上三行,參見https://tn123.org/mod_xsendfile/
        /*
        $chunk = 10 * 1024 * 1024; // bytes per chunk (10 MB)
        $fh = fopen($targetFile, "rb");
        while (!feof($fh)) {
            echo fread($fh, $chunk);
            ob_flush();  // flush output
            flush();
        }
        //另一種下載大檔可選用方法,用以取代readfile($targetFile)這行
        //*/
        exit;
    }
}
$dl = new dl;
$dl1 = $dl->download("1.jpg", "./1.jpg");
?>