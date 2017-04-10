<?php
set_time_limit(0);
//此文件用於快速測試UTF8編碼的文件是不是加了BOM，並可自動移除
function checkBOM($filename)
{
    global $auto;
    $contents = file_get_contents($filename);
    $charset[1] = substr($contents, 0, 1);
    $charset[2] = substr($contents, 1, 1);
    $charset[3] = substr($contents, 2, 1);
    if (ord($charset[1]) == 239 && ord($charset[2]) == 187 && ord($charset[3]) == 191)//\xEF \xBB \xBF
    {
        if ($auto == 1)
        {
            $rest = substr($contents, 3);
            rewrite($filename, $rest);
            return ("BOM found, automatically removed.");
        }
        else
        {
            return ("BOM found.");
        }
    }
    else
    {
        return ("BOM Not Found.");
    }
}

function rewrite($filename, $data)
{
    $filenum = fopen($filename, "w");
    flock($filenum, LOCK_EX);
    fwrite($filenum, $data);
    fclose($filenum);
}

$basedir = "./checkbom/"; //修改此行為需要檢測的目錄，點表示當前目錄
$auto = 1; //是否自動移除發現的BOM信息。1為是，0為否。

function spider($basedir)
{
    if ($dh = opendir($basedir))
    {
        while (($file = readdir($dh)) !== false)
        {
            if ($file!='.' && $file!='..' && !is_dir($basedir."/".$file))
            {
                echo "filename: $file ".checkBOM("$basedir/$file")."<br/>";
            }
            if($file!='.' && $file!='..' && !is_file($basedir."/".$file))
            {
                spider($basedir."/".$file);
            }
        }
        closedir($dh);
    }
}
spider($basedir);
//echo checkBOM("iambom.php");
?>